import type { TFunction } from "i18next";
import type { AccessType } from "keycloak-admin/lib/defs/whoAmIRepresentation";
import type { BreadcrumbsRoute } from "use-react-router-breadcrumbs";
import { AuthenticationSection } from "./authentication/AuthenticationSection";
import { RoleMappingForm } from "./client-scopes/add/RoleMappingForm";
import { DashboardSection } from "./dashboard/Dashboard";
import { PageNotFoundSection } from "./PageNotFoundSection";
import { AESGeneratedSettings } from "./realm-settings/key-providers/aes-generated/AESGeneratedForm";
import { ECDSAGeneratedSettings } from "./realm-settings/key-providers/ecdsa-generated/ECDSAGeneratedForm";
import { HMACGeneratedSettings } from "./realm-settings/key-providers/hmac-generated/HMACGeneratedForm";
import { RSAGeneratedSettings } from "./realm-settings/key-providers/rsa-generated/RSAGeneratedForm";
import { RSASettings } from "./realm-settings/key-providers/rsa/RSAForm";
import { LdapMapperDetails } from "./user-federation/ldap/mappers/LdapMapperDetails";
import { UserFederationKerberosSettings } from "./user-federation/UserFederationKerberosSettings";
import { UserFederationLdapSettings } from "./user-federation/UserFederationLdapSettings";
import { UsersTabs } from "./user/UsersTabs";

export type RouteDef = BreadcrumbsRoute & {
  access: AccessType;
  component: () => JSX.Element;
};

type RoutesFn = (t: TFunction) => RouteDef[];

export const routes: RoutesFn = (t: TFunction) => [
  {
    path: "/:realm/client-scopes/:id/mappers/oidc-role-name-mapper",
    component: RoleMappingForm,
    breadcrumb: t("common:mappingDetails"),
    access: "view-clients",
  },
  {
    path: "/:realm/users/:id/:tab",
    component: UsersTabs,
    breadcrumb: t("users:userDetails"),
    access: "manage-users",
  },
  {
    path: "/:realm/realm-settings/keys/:id?/aes-generated/settings",
    component: AESGeneratedSettings,
    breadcrumb: t("realm-settings:editProvider"),
    access: "view-realm",
  },
  {
    path: "/:realm/realm-settings/keys/:id?/ecdsa-generated/settings",
    component: ECDSAGeneratedSettings,
    breadcrumb: t("realm-settings:editProvider"),
    access: "view-realm",
  },
  {
    path: "/:realm/realm-settings/keys/:id?/hmac-generated/settings",
    component: HMACGeneratedSettings,
    breadcrumb: t("realm-settings:editProvider"),
    access: "view-realm",
  },
  {
    path: "/:realm/realm-settings/keys/:id?/rsa-generated/settings",
    component: RSAGeneratedSettings,
    breadcrumb: t("realm-settings:editProvider"),
    access: "view-realm",
  },
  {
    path: "/:realm/realm-settings/keys/:id?/rsa/settings",
    component: RSASettings,
    breadcrumb: t("realm-settings:editProvider"),
    access: "view-realm",
  },
  {
    path: "/:realm/authentication",
    component: AuthenticationSection,
    breadcrumb: t("authentication"),
    access: "view-realm",
  },
  {
    path: "/:realm/user-federation/kerberos/new",
    component: UserFederationKerberosSettings,
    breadcrumb: t("common:settings"),
    access: "view-realm",
  },
  {
    path: "/:realm/user-federation/ldap/new",
    component: UserFederationLdapSettings,
    breadcrumb: t("user-federation:addOneLdap"),
    access: "view-realm",
  },
  {
    path: "/:realm/user-federation/ldap/:id/:tab?",
    component: UserFederationLdapSettings,
    breadcrumb: t("common:settings"),
    access: "view-realm",
  },
  {
    path: "/:realm/user-federation/ldap/:id/:tab/:mapperId",
    component: LdapMapperDetails,
    breadcrumb: t("common:mappingDetails"),
    access: "view-realm",
  },
  {
    path: "/",
    component: DashboardSection,
    breadcrumb: t("common:home"),
    access: "anyone",
  },
  {
    path: "*",
    component: PageNotFoundSection,
    breadcrumb: null,
    access: "anyone",
  },
];
