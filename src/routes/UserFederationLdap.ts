import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { UserFederationSection } from "../user-federation/UserFederationSection";
import type { HomeParams } from "./Home";

export type UserFederationLdapParams = HomeParams;

export const UserFederationLdapRoute: RouteConfig = {
  path: "/:realm/user-federation/ldap",
  component: UserFederationSection,
  breadcrumb: null,
  access: "view-realm",
};

export const toUserFederationLdap = (
  params: UserFederationLdapParams
): LocationDescriptorObject => ({
  pathname: generatePath(UserFederationLdapRoute.path, params),
});
