import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { ClientScopeForm } from "../client-scopes/form/ClientScopeForm";
import type { HomeParams } from "./Home";

export type NewClientScopeParams = HomeParams;

export const NewClientScopeRoute: RouteConfig = {
  path: "/:realm/client-scopes/new",
  component: ClientScopeForm,
  breadcrumb: (t) => t("client-scopes:createClientScope"),
  access: "manage-clients",
};

export const toNewClientScope = (
  params: NewClientScopeParams
): LocationDescriptorObject => ({
  pathname: generatePath(NewClientScopeRoute.path, params),
});
