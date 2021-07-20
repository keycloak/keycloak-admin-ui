import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { RealmRoleTabs } from "../realm-roles/RealmRoleTabs";
import type { HomeParams } from "./Home";

export type RoleParams = HomeParams & {
  id: string;
  tab?: string;
};

export const RoleRoute: RouteConfig = {
  path: "/:realm/roles/:id/:tab?",
  component: RealmRoleTabs,
  breadcrumb: (t) => t("roles:roleDetails"),
  access: "view-realm",
};

export const toRole = (params: RoleParams): LocationDescriptorObject => ({
  pathname: generatePath(RoleRoute.path, params),
});
