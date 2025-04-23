import dotenv from 'dotenv';
dotenv.config();

import { Octokit } from '@octokit/rest';
import simpleGit from 'simple-git';
import https from 'https';
import fs from 'fs/promises';
import path from 'path';

class GitHubService {
    constructor() {
        const token = process.env.GITHUB_TOKEN;
        console.log("GitHub Token (first 5 chars):", token ? token.substring(0, 5) : "undefined");

        if (!token) {
            console.error("FATAL: GITHUB_TOKEN is not defined in environment variables.");
        }

        this.octokit = new Octokit({
            auth: `token ${token}`,
            baseUrl: 'https://api.github.com',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'NodeJS-App'
            }
        });

        this.token = token;
    }

    createRepoWithTokenAuth(repoName) {
        return new Promise((resolve, reject) => {
            const isOrg = process.env.GITHUB_ORGANIZATION &&
                process.env.GITHUB_ORGANIZATION !== process.env.GITHUB_USERNAME;
            const owner = isOrg ? process.env.GITHUB_ORGANIZATION : process.env.GITHUB_USERNAME;

            if (!owner) {
                return reject(new Error("GitHub owner (username or organization) not found in environment variables."));
            }

            const data = JSON.stringify({
                name: repoName,
                private: false,
                auto_init: true
            });

            const targetPath = isOrg ? `/orgs/${owner}/repos` : '/user/repos';

            const options = {
                hostname: 'api.github.com',
                path: targetPath,
                method: 'POST',
                headers: {
                    'User-Agent': 'NodeJS-App',
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };

            console.log(`Creating repository '${repoName}' for ${isOrg ? 'organization' : 'user'}: ${owner}`);
            console.log(`API Path: ${targetPath}`);

            const req = https.request(options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => { responseData += chunk; });
                res.on('end', () => {
                    console.log(`GitHub API response status: ${res.statusCode}`);
                    try {
                        if (!responseData) {
                            if (res.statusCode >= 200 && res.statusCode < 300) {
                                console.log(`Repository action successful with status ${res.statusCode} (No response body).`);
                                resolve({ html_url: `https://github.com/${owner}/${repoName}` });
                                return;
                            } else {
                                reject(new Error(`GitHub API returned status ${res.statusCode} with no response body.`));
                                return;
                            }
                        }

                        const parsedData = JSON.parse(responseData);
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            console.log(`Repository created successfully: ${parsedData.html_url}`);
                            resolve(parsedData);
                        } else {
                            console.error(`GitHub API error: Status ${res.statusCode}, Response:`, parsedData);
                            reject(new Error(`GitHub API returned status ${res.statusCode}: ${parsedData.message || responseData}`));
                        }
                    } catch (e) {
                        console.error("Error parsing GitHub API response:", responseData);
                        reject(new Error(`Could not parse GitHub API response (Status: ${res.statusCode}): ${responseData}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error("Network error during GitHub repo creation:", error);
                reject(error);
            });

            req.write(data);
            req.end();
        });
    }

    async initializeRepository(repoPath, repoName) {
        try {
            console.log(`Initializing git repository process in: ${repoPath}`);

            const gitFolderPath = path.join(repoPath, '.git');
            try {
                const stats = await fs.stat(gitFolderPath);
                if (stats.isDirectory()) {
                    console.log(`Found existing .git directory created by Vite. Removing it.`);
                    await fs.rm(gitFolderPath, { recursive: true, force: true });
                    console.log("Existing .git directory removed.");
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.warn(`Warning: Could not check/remove existing .git directory: ${error.message}`);
                } else {
                    console.log(".git directory not found, proceeding with initialization.");
                }
            }

            const gitOptions = {
                baseDir: repoPath,
                binary: 'git',
                maxConcurrentProcesses: 6,
            };
            const git = simpleGit(gitOptions);

            await git.init();
            console.log("Git repository initialized.");

            const githubUsername = process.env.GITHUB_USERNAME;
            if (!githubUsername) {
                throw new Error("GITHUB_USERNAME is not defined in environment variables.");
            }
            const userEmail = `${githubUsername}@users.noreply.github.com`;
            await git.addConfig('user.name', githubUsername);
            await git.addConfig('user.email', userEmail);
            console.log(`Git user configured: Name=${githubUsername}, Email=${userEmail}`);

            const lockFilePath = path.join(repoPath, '.git', 'index.lock');
            try {
                await fs.access(lockFilePath);
                console.warn(`Lock file ${lockFilePath} exists before 'git add'. Attempting removal.`);
                await fs.unlink(lockFilePath);
                console.log("Removed existing lock file.");
            } catch (lockError) {
                if (lockError.code !== 'ENOENT') {
                    console.error(`Error checking/removing lock file: ${lockError.message}`);
                }
            }

            console.log("Staging files with 'git add .'...");
            await git.add(".");
            console.log("Added all files to git staging area.");

            const status = await git.status();
            if (status.files.length > 0 || status.staged.length > 0) {
                await git.commit("Initial commit of project files");
                console.log("Initial commit created.");
            } else {
                console.log("No changes detected to commit.");
            }

            const isOrg = process.env.GITHUB_ORGANIZATION &&
                process.env.GITHUB_ORGANIZATION !== process.env.GITHUB_USERNAME;
            const owner = isOrg ? process.env.GITHUB_ORGANIZATION : githubUsername;
            const encodedToken = encodeURIComponent(this.token);
            if (!this.token) throw new Error("GITHUB_TOKEN is missing, cannot create remote URL.");
            const remoteUrl = `https://${encodedToken}@github.com/${owner}/${repoName}.git`;

            const remotes = await git.getRemotes(true);
            const originExists = remotes.some(remote => remote.name === 'origin');

            if (originExists) {
                console.log("Remote 'origin' already exists. Setting URL...");
                await git.remote(['set-url', 'origin', remoteUrl]);
            } else {
                console.log("Adding remote 'origin'...");
                await git.addRemote("origin", remoteUrl);
            }
            console.log(`Remote 'origin' configured for: github.com/${owner}/${repoName}.git`);

            console.log("Attempting to push to 'origin main'...");
            try {
                const branchSummary = await git.branchLocal();
                let currentBranch = branchSummary.current;

                if (!currentBranch) {
                    console.log("No current branch found. Setting HEAD to main.");
                    if (!branchSummary.all.includes('main')) {
                        await git.checkoutLocalBranch('main');
                        console.log("Created and checked out 'main' branch.");
                        currentBranch = 'main';
                    } else {
                        await git.checkout('main');
                        console.log("Checked out existing 'main' branch.");
                        currentBranch = 'main';
                    }
                } else if (currentBranch !== 'main') {
                    if (branchSummary.all.includes('main')) {
                        console.log(`Current branch is '${currentBranch}'. Checking out 'main'...`);
                        await git.checkout('main');
                        currentBranch = 'main';
                    } else {
                        console.log(`Current branch is '${currentBranch}'. Creating and checking out 'main' branch...`);
                        await git.checkoutLocalBranch('main');
                        currentBranch = 'main';
                    }
                } else {
                    console.log("Current local branch is 'main'.");
                }

                console.log("Pushing using: git push -u origin main --force");
                await git.push(['-u', 'origin', 'main', '--force']);
                console.log("Successfully pushed initial commit(s) to 'origin main'.");

            } catch (pushError) {
                console.error("Error pushing to 'origin main':", pushError.message);
                console.error(pushError);
                throw new Error(`Failed to push to GitHub: ${pushError.message}`);
            }

        } catch (error) {
            console.error("GitHub Repository Initialization/Push Error:", error);
            if (error.task) {
                console.error("Failed Git Task:", error.task);
            }
            throw error;
        }
    }

    async testRepoCreation() {
        console.warn("testRepoCreation function called - ensure it uses createRepoWithTokenAuth if needed.");
        const testRepoName = `test-repo-${Date.now().toString().slice(-6)}`;
        return this.createRepoWithTokenAuth(testRepoName);
    }
}

export default new GitHubService();
