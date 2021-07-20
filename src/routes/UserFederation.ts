import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { UserFederationSection } from "../user-federation/UserFederationSection";
import type { HomeParams } from "./Home";

export type UserFederationParams = HomeParams;

export const UserFederationRoute: RouteConfig = {
  path: "/:realm/user-federation",
  component: UserFederationSection,
  breadcrumb: (t) => t("userFederation"),
  access: "view-realm",
};

export const toUserFederation = (
  params: UserFederationParams
): LocationDescriptorObject => ({
  pathname: generatePath(UserFederationRoute.path, params),
});
