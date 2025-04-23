import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import { CreateRecordRequest, CreateRecordResponseBody } from "../models/createrecordop.js";
import { GetRecordsRequest, GetRecordsResponseBody } from "../models/getrecordsop.js";
import { RemoveRecordRequest, RemoveRecordResponseBody } from "../models/removerecordop.js";
import { UpdateRecordRequest, UpdateRecordResponseBody } from "../models/updaterecordop.js";
export declare class Dns extends ClientSDK {
    /**
     * List existing DNS records
     *
     * @remarks
     * Retrieves a list of DNS records created for a domain name. By default it returns 20 records if no limit is provided. The rest can be retrieved using the pagination options.
     */
    getRecords(request: GetRecordsRequest, options?: RequestOptions): Promise<GetRecordsResponseBody>;
    /**
     * Create a DNS record
     *
     * @remarks
     * Creates a DNS record for a domain.
     */
    createRecord(request: CreateRecordRequest, options?: RequestOptions): Promise<CreateRecordResponseBody>;
    /**
     * Update an existing DNS record
     *
     * @remarks
     * Updates an existing DNS record for a domain name.
     */
    updateRecord(request: UpdateRecordRequest, options?: RequestOptions): Promise<UpdateRecordResponseBody>;
    /**
     * Delete a DNS record
     *
     * @remarks
     * Removes an existing DNS record from a domain name.
     */
    removeRecord(request: RemoveRecordRequest, options?: RequestOptions): Promise<RemoveRecordResponseBody>;
}
//# sourceMappingURL=dns.d.ts.map