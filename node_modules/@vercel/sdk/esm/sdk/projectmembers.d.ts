import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import { AddProjectMemberRequest, AddProjectMemberResponseBody } from "../models/addprojectmemberop.js";
import { GetProjectMembersRequest, GetProjectMembersResponseBody } from "../models/getprojectmembersop.js";
import { RemoveProjectMemberRequest, RemoveProjectMemberResponseBody } from "../models/removeprojectmemberop.js";
export declare class ProjectMembers extends ClientSDK {
    /**
     * List project members
     *
     * @remarks
     * Lists all members of a project.
     */
    getProjectMembers(request: GetProjectMembersRequest, options?: RequestOptions): Promise<GetProjectMembersResponseBody>;
    /**
     * Adds a new member to a project.
     *
     * @remarks
     * Adds a new member to the project.
     */
    addProjectMember(request: AddProjectMemberRequest, options?: RequestOptions): Promise<AddProjectMemberResponseBody>;
    /**
     * Remove a Project Member
     *
     * @remarks
     * Remove a member from a specific project
     */
    removeProjectMember(request: RemoveProjectMemberRequest, options?: RequestOptions): Promise<RemoveProjectMemberResponseBody>;
}
//# sourceMappingURL=projectmembers.d.ts.map