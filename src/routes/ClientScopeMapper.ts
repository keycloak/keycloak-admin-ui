import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { MappingDetails } from "../client-scopes/details/MappingDetails";
import type { HomeParams } from "./Home";

export type ClientScopeMapperParams = HomeParams & {
  id: string;
  mapperId: string;
};

export const ClientScopeMapperRoute: RouteConfig = {
  path: "/:realm/client-scopes/:id/mappers/:mapperId",
  component: MappingDetails,
  breadcrumb: (t) => t("common:mappingDetails"),
  access: "view-clients",
};

export const toClientScopeMapper = (
  params: ClientScopeMapperParams
): LocationDescriptorObject => ({
  pathname: generatePath(ClientScopeMapperRoute.path, params),
});
