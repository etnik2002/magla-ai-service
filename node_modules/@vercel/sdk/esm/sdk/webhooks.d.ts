import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import { CreateWebhookRequest, CreateWebhookResponseBody } from "../models/createwebhookop.js";
import { DeleteWebhookRequest } from "../models/deletewebhookop.js";
import { GetWebhookRequest, GetWebhookResponseBody } from "../models/getwebhookop.js";
import { GetWebhooksRequest, GetWebhooksResponseBody } from "../models/getwebhooksop.js";
export declare class Webhooks extends ClientSDK {
    /**
     * Creates a webhook
     *
     * @remarks
     * Creates a webhook
     */
    createWebhook(request: CreateWebhookRequest, options?: RequestOptions): Promise<CreateWebhookResponseBody>;
    /**
     * Get a list of webhooks
     *
     * @remarks
     * Get a list of webhooks
     */
    getWebhooks(request: GetWebhooksRequest, options?: RequestOptions): Promise<GetWebhooksResponseBody>;
    /**
     * Get a webhook
     *
     * @remarks
     * Get a webhook
     */
    getWebhook(request: GetWebhookRequest, options?: RequestOptions): Promise<GetWebhookResponseBody>;
    /**
     * Deletes a webhook
     *
     * @remarks
     * Deletes a webhook
     */
    deleteWebhook(request: DeleteWebhookRequest, options?: RequestOptions): Promise<void>;
}
//# sourceMappingURL=webhooks.d.ts.map