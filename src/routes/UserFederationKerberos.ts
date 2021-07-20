import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { UserFederationKerberosSettings } from "../user-federation/UserFederationKerberosSettings";
import type { HomeParams } from "./Home";

export type UserFederationKerberosParams = HomeParams & {
  id: string;
};

export const UserFederationKerberosRoute: RouteConfig = {
  path: "/:realm/user-federation/kerberos/:id",
  component: UserFederationKerberosSettings,
  breadcrumb: (t) => t("common:settings"),
  access: "view-realm",
};

export const toUserFederationKerberos = (
  params: UserFederationKerberosParams
): LocationDescriptorObject => ({
  pathname: generatePath(UserFederationKerberosRoute.path, params),
});
