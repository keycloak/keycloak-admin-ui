import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { RealmRoleTabs } from "../realm-roles/RealmRoleTabs";
import type { HomeParams } from "./Home";

export type ClientRoleParams = HomeParams & {
  clientId: string;
  id: string;
  tab?: string;
};

export const ClientRoleRoute: RouteConfig = {
  path: "/:realm/clients/:clientId/roles/:id/:tab?",
  component: RealmRoleTabs,
  breadcrumb: (t) => t("roles:roleDetails"),
  access: "view-realm",
};

export const toClientRole = (
  params: ClientRoleParams
): LocationDescriptorObject => ({
  pathname: generatePath(ClientRoleRoute.path, params),
});
