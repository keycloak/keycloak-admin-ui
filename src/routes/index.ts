import type { TFunction } from "i18next";
import type { AccessType } from "keycloak-admin/lib/defs/whoAmIRepresentation";
import type { ComponentType } from "react";
import { AddClientRoute } from "./AddClient";
import { AddIdentityProviderRoute } from "./AddIdentityProvider";
import { AddKeycloakOpenIdProviderRoute } from "./AddKeycloakOpenIdProvider";
import { AddOpenIdProviderRoute } from "./AddOpenIdProvider";
import { AddRealmRoute } from "./AddRealm";
import { AddRoleRoute } from "./AddRole";
import { AddRoleToClientRoute } from "./AddRoleToClient";
import { AddUserRoute } from "./AddUser";
import { ClientRoute } from "./Client";
import { ClientRoleRoute } from "./ClientRole";
import { ClientsRoute } from "./Clients";
import { ClientScopeRoute } from "./ClientScope";
import { ClientScopeMapperRoute } from "./ClientScopeMapper";
import { ClientScopesRoute } from "./ClientScopes";
import { CreateInitialAccessTokenRoute } from "./CreateInitialAccessToken";
import { EventsRoute } from "./Events";
import { GroupsRoute } from "./Groups";
import { HomeRoute } from "./Home";
import { IdentityProviderRoute } from "./IdentityProvider";
import { IdentityProvidersRoute } from "./IdentityProviders";
import { ImportClientRoute } from "./ImportClient";
import { NewClientScopeRoute } from "./NewClientScope";
import { RealmSettingsRoute } from "./RealmSettings";
import { RoleRoute } from "./Role";
import { RolesRoute } from "./Roles";
import { SearchGroupsRoute } from "./SearchGroups";
import { SessionsRoute } from "./Sessions";
import { UserRoute } from "./User";
import { UserFederationRoute } from "./UserFederation";
import { UserFederationKerberosRoute } from "./UserFederationKerberos";
import { UserFederationLdapRoute } from "./UserFederationLdap";
import { UserFederationsKerberosRoute } from "./UserFederationsKerberos";
import { UsersRoute } from "./Users";

export type RouteConfig = {
  path: string;
  component: ComponentType;
  breadcrumb: ((t: TFunction) => string) | null;
  access: AccessType;
  exact?: boolean;
};

const routes: RouteConfig[] = [
  AddClientRoute,
  AddIdentityProviderRoute,
  AddKeycloakOpenIdProviderRoute,
  AddOpenIdProviderRoute,
  AddRealmRoute,
  AddRoleRoute,
  AddRoleToClientRoute,
  AddUserRoute,
  ClientRoute,
  ClientRoleRoute,
  ClientScopeRoute,
  ClientScopeMapperRoute,
  ClientScopesRoute,
  ClientsRoute,
  CreateInitialAccessTokenRoute,
  EventsRoute,
  GroupsRoute,
  HomeRoute,
  IdentityProviderRoute,
  IdentityProvidersRoute,
  ImportClientRoute,
  NewClientScopeRoute,
  RealmSettingsRoute,
  RoleRoute,
  RolesRoute,
  SearchGroupsRoute,
  SessionsRoute,
  UserRoute,
  UserFederationKerberosRoute,
  UserFederationLdapRoute,
  UserFederationRoute,
  UserFederationsKerberosRoute,
  UsersRoute,
];

export default routes;
