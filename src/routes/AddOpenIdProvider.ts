import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { AddOpenIdConnect } from "../identity-providers/add/AddOpenIdConnect";
import type { HomeParams } from "./Home";

export type AddOpenIdProviderParams = HomeParams;

export const AddOpenIdProviderRoute: RouteConfig = {
  path: "/:realm/identity-providers/oidc",
  component: AddOpenIdConnect,
  breadcrumb: (t) => t("identity-providers:addOpenIdProvider"),
  access: "manage-identity-providers",
};

export const toAddOpenIdProvider = (
  params: AddOpenIdProviderParams
): LocationDescriptorObject => ({
  pathname: generatePath(AddOpenIdProviderRoute.path, params),
});
