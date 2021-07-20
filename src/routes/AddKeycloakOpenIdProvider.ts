import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { AddOpenIdConnect } from "../identity-providers/add/AddOpenIdConnect";
import type { HomeParams } from "./Home";

export type AddKeycloakOpenIdProviderParams = HomeParams;

export const AddKeycloakOpenIdProviderRoute: RouteConfig = {
  path: "/:realm/identity-providers/keycloak-oidc",
  component: AddOpenIdConnect,
  breadcrumb: (t) => t("identity-providers:addKeycloakOpenIdProvider"),
  access: "manage-identity-providers",
};

export const toAddKeycloakOpenIdProvider = (
  params: AddKeycloakOpenIdProviderParams
): LocationDescriptorObject => ({
  pathname: generatePath(AddKeycloakOpenIdProviderRoute.path, params),
});
