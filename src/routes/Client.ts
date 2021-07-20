import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { ClientDetails } from "../clients/ClientDetails";
import type { HomeParams } from "./Home";

export type ClientParams = HomeParams & {
  clientId: string;
  tab: string;
};

export const ClientRoute: RouteConfig = {
  path: "/:realm/clients/:clientId/:tab",
  component: ClientDetails,
  breadcrumb: (t) => t("clients:clientSettings"),
  access: "view-clients",
};

export const toClient = (params: ClientParams): LocationDescriptorObject => ({
  pathname: generatePath(ClientRoute.path, params),
});
