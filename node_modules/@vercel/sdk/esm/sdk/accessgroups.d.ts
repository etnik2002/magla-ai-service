import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import { CreateAccessGroupRequest, CreateAccessGroupResponseBody } from "../models/createaccessgroupop.js";
import { CreateAccessGroupProjectRequest, CreateAccessGroupProjectResponseBody } from "../models/createaccessgroupprojectop.js";
import { DeleteAccessGroupRequest } from "../models/deleteaccessgroupop.js";
import { DeleteAccessGroupProjectRequest } from "../models/deleteaccessgroupprojectop.js";
import { ListAccessGroupMembersRequest, ListAccessGroupMembersResponseBody } from "../models/listaccessgroupmembersop.js";
import { ListAccessGroupProjectsRequest, ListAccessGroupProjectsResponseBody } from "../models/listaccessgroupprojectsop.js";
import { ListAccessGroupsRequest, ListAccessGroupsResponseBody } from "../models/listaccessgroupsop.js";
import { ReadAccessGroupRequest, ReadAccessGroupResponseBody } from "../models/readaccessgroupop.js";
import { ReadAccessGroupProjectRequest, ReadAccessGroupProjectResponseBody } from "../models/readaccessgroupprojectop.js";
import { UpdateAccessGroupRequest, UpdateAccessGroupResponseBody } from "../models/updateaccessgroupop.js";
import { UpdateAccessGroupProjectRequest, UpdateAccessGroupProjectResponseBody } from "../models/updateaccessgroupprojectop.js";
export declare class AccessGroups extends ClientSDK {
    /**
     * Reads an access group
     *
     * @remarks
     * Allows to read an access group
     */
    readAccessGroup(request: ReadAccessGroupRequest, options?: RequestOptions): Promise<ReadAccessGroupResponseBody>;
    /**
     * Update an access group
     *
     * @remarks
     * Allows to update an access group metadata
     */
    updateAccessGroup(request: UpdateAccessGroupRequest, options?: RequestOptions): Promise<UpdateAccessGroupResponseBody>;
    /**
     * Deletes an access group
     *
     * @remarks
     * Allows to delete an access group
     */
    deleteAccessGroup(request: DeleteAccessGroupRequest, options?: RequestOptions): Promise<void>;
    /**
     * List members of an access group
     *
     * @remarks
     * List members of an access group
     */
    listAccessGroupMembers(request: ListAccessGroupMembersRequest, options?: RequestOptions): Promise<ListAccessGroupMembersResponseBody>;
    /**
     * List access groups for a team, project or member
     *
     * @remarks
     * List access groups
     */
    listAccessGroups(request: ListAccessGroupsRequest, options?: RequestOptions): Promise<ListAccessGroupsResponseBody>;
    /**
     * Creates an access group
     *
     * @remarks
     * Allows to create an access group
     */
    createAccessGroup(request: CreateAccessGroupRequest, options?: RequestOptions): Promise<CreateAccessGroupResponseBody>;
    /**
     * List projects of an access group
     *
     * @remarks
     * List projects of an access group
     */
    listAccessGroupProjects(request: ListAccessGroupProjectsRequest, options?: RequestOptions): Promise<ListAccessGroupProjectsResponseBody>;
    /**
     * Create an access group project
     *
     * @remarks
     * Allows creation of an access group project
     */
    createAccessGroupProject(request: CreateAccessGroupProjectRequest, options?: RequestOptions): Promise<CreateAccessGroupProjectResponseBody>;
    /**
     * Reads an access group project
     *
     * @remarks
     * Allows reading an access group project
     */
    readAccessGroupProject(request: ReadAccessGroupProjectRequest, options?: RequestOptions): Promise<ReadAccessGroupProjectResponseBody>;
    /**
     * Update an access group project
     *
     * @remarks
     * Allows update of an access group project
     */
    updateAccessGroupProject(request: UpdateAccessGroupProjectRequest, options?: RequestOptions): Promise<UpdateAccessGroupProjectResponseBody>;
    /**
     * Delete an access group project
     *
     * @remarks
     * Allows deletion of an access group project
     */
    deleteAccessGroupProject(request: DeleteAccessGroupProjectRequest, options?: RequestOptions): Promise<void>;
}
//# sourceMappingURL=accessgroups.d.ts.map