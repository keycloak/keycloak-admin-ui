import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { UserFederationSection } from "../user-federation/UserFederationSection";
import type { HomeParams } from "./Home";

export type UserFederationsKerberosParams = HomeParams;

export const UserFederationsKerberosRoute: RouteConfig = {
  path: "/:realm/user-federation/kerberos",
  component: UserFederationSection,
  breadcrumb: null,
  access: "view-realm",
};

export const toUserFederationsKerberos = (
  params: UserFederationsKerberosParams
): LocationDescriptorObject => ({
  pathname: generatePath(UserFederationsKerberosRoute.path, params),
});
