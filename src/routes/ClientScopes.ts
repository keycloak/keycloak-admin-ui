import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { ClientScopesSection } from "../client-scopes/ClientScopesSection";
import type { HomeParams } from "./Home";

export type ClientScopesParams = HomeParams;

export const ClientScopesRoute: RouteConfig = {
  path: "/:realm/client-scopes",
  component: ClientScopesSection,
  breadcrumb: (t) => t("client-scopes:clientScopeList"),
  access: "view-clients",
};

export const toClientScopes = (
  params: ClientScopesParams
): LocationDescriptorObject => ({
  pathname: generatePath(ClientScopesRoute.path, params),
});
