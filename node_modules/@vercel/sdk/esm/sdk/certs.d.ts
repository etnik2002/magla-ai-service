import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import { GetCertByIdRequest, GetCertByIdResponseBody } from "../models/getcertbyidop.js";
import { IssueCertRequest, IssueCertResponseBody } from "../models/issuecertop.js";
import { RemoveCertRequest, RemoveCertResponseBody } from "../models/removecertop.js";
import { UploadCertRequest, UploadCertResponseBody } from "../models/uploadcertop.js";
export declare class Certs extends ClientSDK {
    /**
     * Get cert by id
     *
     * @remarks
     * Get cert by id
     */
    getCertById(request: GetCertByIdRequest, options?: RequestOptions): Promise<GetCertByIdResponseBody>;
    /**
     * Remove cert
     *
     * @remarks
     * Remove cert
     */
    removeCert(request: RemoveCertRequest, options?: RequestOptions): Promise<RemoveCertResponseBody>;
    /**
     * Issue a new cert
     *
     * @remarks
     * Issue a new cert
     */
    issueCert(request: IssueCertRequest, options?: RequestOptions): Promise<IssueCertResponseBody>;
    /**
     * Upload a cert
     *
     * @remarks
     * Upload a cert
     */
    uploadCert(request: UploadCertRequest, options?: RequestOptions): Promise<UploadCertResponseBody>;
}
//# sourceMappingURL=certs.d.ts.map