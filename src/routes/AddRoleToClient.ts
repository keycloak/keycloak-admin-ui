import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { RealmRoleTabs } from "../realm-roles/RealmRoleTabs";
import type { HomeParams } from "./Home";

export type AddRoleToClientParams = HomeParams & {
  clientId: string;
};

export const AddRoleToClientRoute: RouteConfig = {
  path: "/:realm/clients/:clientId/roles/add-role",
  component: RealmRoleTabs,
  breadcrumb: (t) => t("roles:createRole"),
  access: "manage-realm",
};

export const toAddRoleToClient = (
  params: AddRoleToClientParams
): LocationDescriptorObject => ({
  pathname: generatePath(AddRoleToClientRoute.path, params),
});
