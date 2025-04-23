import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import { ArtifactExistsRequest } from "../models/artifactexistsop.js";
import { ArtifactQueryRequest, ResponseBody } from "../models/artifactqueryop.js";
import { DownloadArtifactRequest } from "../models/downloadartifactop.js";
import { RecordEventsRequest } from "../models/recordeventsop.js";
import { StatusRequest, StatusResponseBody } from "../models/statusop.js";
import { UploadArtifactRequest, UploadArtifactResponseBody } from "../models/uploadartifactop.js";
export declare class Artifacts extends ClientSDK {
    /**
     * Record an artifacts cache usage event
     *
     * @remarks
     * Records an artifacts cache usage event. The body of this request is an array of cache usage events. The supported event types are `HIT` and `MISS`. The source is either `LOCAL` the cache event was on the users filesystem cache or `REMOTE` if the cache event is for a remote cache. When the event is a `HIT` the request also accepts a number `duration` which is the time taken to generate the artifact in the cache.
     */
    recordEvents(request: RecordEventsRequest, options?: RequestOptions): Promise<void>;
    /**
     * Get status of Remote Caching for this principal
     *
     * @remarks
     * Check the status of Remote Caching for this principal. Returns a JSON-encoded status indicating if Remote Caching is enabled, disabled, or disabled due to usage limits.
     */
    status(request: StatusRequest, options?: RequestOptions): Promise<StatusResponseBody>;
    /**
     * Upload a cache artifact
     *
     * @remarks
     * Uploads a cache artifact identified by the `hash` specified on the path. The cache artifact can then be downloaded with the provided `hash`.
     */
    uploadArtifact(request: UploadArtifactRequest, options?: RequestOptions): Promise<UploadArtifactResponseBody>;
    /**
     * Download a cache artifact
     *
     * @remarks
     * Downloads a cache artifact indentified by its `hash` specified on the request path. The artifact is downloaded as an octet-stream. The client should verify the content-length header and response body.
     */
    downloadArtifact(request: DownloadArtifactRequest, options?: RequestOptions): Promise<ReadableStream<Uint8Array>>;
    /**
     * Check if a cache artifact exists
     *
     * @remarks
     * Check that a cache artifact with the given `hash` exists. This request returns response headers only and is equivalent to a `GET` request to this endpoint where the response contains no body.
     */
    artifactExists(request: ArtifactExistsRequest, options?: RequestOptions): Promise<void>;
    /**
     * Query information about an artifact
     *
     * @remarks
     * Query information about an array of artifacts.
     */
    artifactQuery(request: ArtifactQueryRequest, options?: RequestOptions): Promise<{
        [k: string]: ResponseBody | null;
    }>;
}
//# sourceMappingURL=artifacts.d.ts.map