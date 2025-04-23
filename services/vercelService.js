import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import fs from 'fs/promises';

const exec = promisify(execCallback);
const VERCEL_API = 'https://api.vercel.com';
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
    console.error("FATAL: VERCEL_TOKEN is not defined in environment variables.");
}

async function vercelFetch(endpoint, options = {}) {
    const url = `${VERCEL_API}${endpoint}`;
    const headers = {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers,
    };

    console.log(`Vercel API Request: ${options.method || 'GET'} ${url}`);


    const response = await fetch(url, { ...options, headers });

    console.log(`Vercel API Response Status: ${response.status}`);

    if (!response.ok && response.headers.get('content-type')?.includes('application/json') !== true) {
        const errorText = await response.text();
        console.error(`Vercel API Error (Non-JSON): Status ${response.status}, Body: ${errorText}`);
        throw new Error(`Vercel API Error: ${response.status} ${response.statusText}. ${errorText}`);
    }

    const responseBody = await response.text();

    try {
        const data = JSON.parse(responseBody);

        if (!response.ok) {
            console.error(`Vercel API Error: Status ${response.status}, Response:`, data);
            throw new Error(`Vercel API Error (${response.status}): ${data.error?.message || 'Unknown Vercel API error'}`);
        }

        console.log(`Vercel API Response Data (snippet): ${responseBody.substring(0, 200)}...`);
        return data;

    } catch (parseError) {
        console.error(`Error parsing Vercel API JSON response (Status: ${response.status}):`, parseError);
        console.error("Raw Response Body:", responseBody);
        if (response.ok) {
            throw new Error(`Failed to parse successful Vercel API response. Body: ${responseBody}`);
        } else {
            throw new Error(`Vercel API Error (${response.status}): Failed to parse error response. Body: ${responseBody}`);
        }
    }
}

async function pollDeploymentStatus(deploymentUrl, timeout = 300000, interval = 10000) {
    const startTime = Date.now();
    console.log(`Polling deployment status for Vercel deployment URL: ${deploymentUrl}`);

    while (Date.now() - startTime < timeout) {
        try {
            const deploymentInfo = await vercelFetch(deploymentUrl.replace(VERCEL_API, ''));

            const state = deploymentInfo.readyState || deploymentInfo.status;
            console.log(`Current deployment state: ${state}`);

            if (state === 'READY') {
                const finalUrl = deploymentInfo.url ? `https://${deploymentInfo.url}` : null;
                if (!finalUrl) {
                    console.warn("Deployment READY but URL not found in response:", deploymentInfo);
                    throw new Error("Deployment succeeded but failed to get the final URL.");
                }
                console.log(`Deployment successful: ${finalUrl}`);
                return { status: 'READY', url: finalUrl, deployment: deploymentInfo };
            } else if (['ERROR', 'CANCELED', 'FAILED'].includes(state)) {
                console.error(`Deployment failed with state: ${state}. Reason: ${deploymentInfo.error?.message || 'Unknown'}`);
                throw new Error(`Deployment failed or was canceled. State: ${state}`);
            }

        } catch (error) {
            console.error(`Error polling deployment status: ${error.message}`);
            if (error.message.includes('Deployment failed')) {
                throw error;
            }
        }

        await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Deployment status polling timed out after ${timeout / 1000} seconds.`);
}


export async function createAndDeploy(repo_url) {
    let projectId = null;
    let repoId = null;

    try {
        const repoMatch = repo_url.match(/github\.com\/([^/]+)\/([^/.]+)/);
        if (!repoMatch) {
            throw new Error("Invalid GitHub repo URL format.");
        }
        const owner = repoMatch[1];
        const repo = repoMatch[2].replace(/\.git$/, '');
        const fullRepo = `${owner}/${repo}`;
        const projectName = repo;

        console.log(`Starting Vercel setup for project: ${projectName}, repo: ${fullRepo}`);

        let project;
        try {
            console.log(`Checking for existing Vercel project: ${projectName}`);
            project = await vercelFetch(`/v9/projects/${projectName}`);
            projectId = project.id;
            console.log(`Project '${projectName}' already exists (ID: ${projectId}).`);
            if (project.link?.type === 'github' && project.link?.repoId) {
                repoId = project.link.repoId;
                console.log(`Project already linked to GitHub repo ID: ${repoId}`);
            } else {
                console.log("Project exists but is not linked or repoId is missing. Attempting to link...");
            }
        } catch (error) {
            if (error.message.includes('404') || error.message.includes('not_found')) {
                console.log(`Project '${projectName}' not found. Creating new project.`);
                project = null;
            } else {
                console.error("Error checking for existing project:", error);
                throw error;
            }
        }

        if (!project) {
            project = await vercelFetch('/v9/projects', {
                method: 'POST',
                body: JSON.stringify({
                    name: projectName,
                    framework: "vite",
                    gitRepository: {
                        type: 'github',
                        repo: fullRepo
                    },
                })
            });
            projectId = project.id;
            if (project.link?.type === 'github' && project.link?.repoId) {
                repoId = project.link.repoId;
                console.log(`Project created (ID: ${projectId}) and linked to GitHub repo ID: ${repoId}`);
            } else {
                console.warn(`Project created (ID: ${projectId}) but failed to get repoId from link information. Deployment might fail.`);
                console.warn("Project Link details:", project.link);
            }
        } else if (!repoId) {
            console.log(`Linking existing project '${projectName}' (ID: ${projectId}) to repo: ${fullRepo}`);
            try {
                const linkData = await vercelFetch(`/v9/projects/${projectId}/link`, {
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'github',
                        repo: fullRepo,
                        productionBranch: 'main'
                    })
                });
                if (linkData?.repoId) {
                    repoId = linkData.repoId;
                    console.log(`GitHub repository linked successfully. Repo ID: ${repoId}`);
                    project.link = { ...project.link, repoId: repoId, type: 'github' };
                } else {
                    console.warn('GitHub repository linked, but repoId not found in link response. Deployment might fail.');
                    console.warn("Link response:", linkData);
                }

            } catch (linkError) {
                console.error(`Failed to link GitHub repository: ${linkError.message}`);
                throw linkError;
            }
        }

        if (!repoId) {
            console.error("FATAL: Could not determine GitHub repoId after project creation/linking. Cannot trigger deployment.");
            throw new Error("Failed to obtain GitHub repoId from Vercel API.");
        }


        console.log(`Explicitly triggering production deployment for project: ${projectName} (ID: ${projectId}) using repoId: ${repoId}`);
        const deploymentPayload = {
            name: projectName,
            target: 'production',
            gitSource: {
                type: 'github',
                repoId: repoId,
                ref: 'main'
            }
        };
        console.log("Deployment Payload:", JSON.stringify(deploymentPayload));

        const deploymentResponse = await vercelFetch('/v13/deployments', {
            method: 'POST',
            body: JSON.stringify(deploymentPayload)
        });

        console.log(`Deployment triggered successfully. Deployment ID: ${deploymentResponse.id}, URL Hint: ${deploymentResponse.url}`);
        const deploymentCheckUrl = `/v13/deployments/${deploymentResponse.id}`;


        try {
            const finalDeployment = await pollDeploymentStatus(deploymentCheckUrl);
            console.log(`Deployment completed successfully! URL: ${finalDeployment.url}`);
            return {
                message: 'Project created, linked, and deployment successful.',
                projectName: project.name,
                projectId: projectId,
                deploymentId: deploymentResponse.id,
                status: finalDeployment.status,
                url: finalDeployment.url
            };
        } catch (pollingError) {
            console.error(`Deployment polling failed: ${pollingError.message}`);
            return {
                message: 'Project created, linked, and deployment triggered, but status polling failed or timed out.',
                projectName: project.name,
                projectId: projectId,
                deploymentId: deploymentResponse.id,
                status: 'POLLING_FAILED',
                url: `https://${projectName}.vercel.app`
            };
        }

    } catch (error) {
        console.error(`Error in Vercel create/deploy process: ${error.message}`);
        console.error(error.stack);

        throw error;
    }
}
