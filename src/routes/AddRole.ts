import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { RealmRoleTabs } from "../realm-roles/RealmRoleTabs";
import type { HomeParams } from "./Home";

export type AddRoleParams = HomeParams;

export const AddRoleRoute: RouteConfig = {
  path: "/:realm/roles/add-role",
  component: RealmRoleTabs,
  breadcrumb: (t) => t("roles:createRole"),
  access: "manage-realm",
};

export const toAddRole = (params: AddRoleParams): LocationDescriptorObject => ({
  pathname: generatePath(AddRoleRoute.path, params),
});
