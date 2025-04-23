import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import { CreateCheckRequest, CreateCheckResponseBody } from "../models/createcheckop.js";
import { GetAllChecksRequest, GetAllChecksResponseBody } from "../models/getallchecksop.js";
import { GetCheckRequest, GetCheckResponseBody } from "../models/getcheckop.js";
import { RerequestCheckRequest, RerequestCheckResponseBody } from "../models/rerequestcheckop.js";
import { UpdateCheckRequest, UpdateCheckResponseBody } from "../models/updatecheckop.js";
export declare class Checks extends ClientSDK {
    /**
     * Creates a new Check
     *
     * @remarks
     * Creates a new check. This endpoint must be called with an OAuth2 or it will produce a 400 error.
     */
    createCheck(request: CreateCheckRequest, options?: RequestOptions): Promise<CreateCheckResponseBody>;
    /**
     * Retrieve a list of all checks
     *
     * @remarks
     * List all of the checks created for a deployment.
     */
    getAllChecks(request: GetAllChecksRequest, options?: RequestOptions): Promise<GetAllChecksResponseBody>;
    /**
     * Get a single check
     *
     * @remarks
     * Return a detailed response for a single check.
     */
    getCheck(request: GetCheckRequest, options?: RequestOptions): Promise<GetCheckResponseBody>;
    /**
     * Update a check
     *
     * @remarks
     * Update an existing check. This endpoint must be called with an OAuth2 or it will produce a 400 error.
     */
    updateCheck(request: UpdateCheckRequest, options?: RequestOptions): Promise<UpdateCheckResponseBody>;
    /**
     * Rerequest a check
     *
     * @remarks
     * Rerequest a selected check that has failed.
     */
    rerequestCheck(request: RerequestCheckRequest, options?: RequestOptions): Promise<RerequestCheckResponseBody>;
}
//# sourceMappingURL=checks.d.ts.map