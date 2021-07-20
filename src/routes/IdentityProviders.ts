import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { IdentityProvidersSection } from "../identity-providers/IdentityProvidersSection";
import type { HomeParams } from "./Home";

export type IdentityProvidersParams = HomeParams;

export const IdentityProvidersRoute: RouteConfig = {
  path: "/:realm/identity-providers",
  component: IdentityProvidersSection,
  breadcrumb: (t) => t("identityProviders"),
  access: "view-identity-providers",
};

export const toIdentityProviders = (
  params: IdentityProvidersParams
): LocationDescriptorObject => ({
  pathname: generatePath(IdentityProvidersRoute.path, params),
});
