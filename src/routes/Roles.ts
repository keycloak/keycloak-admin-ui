import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { RealmRolesSection } from "../realm-roles/RealmRolesSection";
import type { HomeParams } from "./Home";

export type RolesParams = HomeParams;

export const RolesRoute: RouteConfig = {
  path: "/:realm/roles",
  component: RealmRolesSection,
  breadcrumb: (t) => t("roles:roleList"),
  access: "view-realm",
};

export const toRoles = (params: RolesParams): LocationDescriptorObject => ({
  pathname: generatePath(RolesRoute.path, params),
});
