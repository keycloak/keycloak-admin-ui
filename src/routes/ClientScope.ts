import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { ClientScopeForm } from "../client-scopes/form/ClientScopeForm";
import type { HomeParams } from "./Home";

export type ClientScopeParams = HomeParams & {
  id: string;
  type: string;
  tab: string;
};

export const ClientScopeRoute: RouteConfig = {
  path: "/:realm/client-scopes/:id/:type/:tab",
  component: ClientScopeForm,
  breadcrumb: (t) => t("client-scopes:clientScopeDetails"),
  access: "view-clients",
};

export const toClientScope = (
  params: ClientScopeParams
): LocationDescriptorObject => ({
  pathname: generatePath(ClientScopeRoute.path, params),
});
