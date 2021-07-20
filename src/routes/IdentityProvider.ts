import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { DetailSettings } from "../identity-providers/add/DetailSettings";
import type { HomeParams } from "./Home";

export type IdentityProviderParams = HomeParams & {
  id: string;
  tab?: string;
};

export const IdentityProviderRoute: RouteConfig = {
  path: "/:realm/identity-providers/:id/:tab?",
  component: DetailSettings,
  breadcrumb: null,
  access: "manage-identity-providers",
};

export const toIdentityProvider = (
  params: IdentityProviderParams
): LocationDescriptorObject => ({
  pathname: generatePath(IdentityProviderRoute.path, params),
});
