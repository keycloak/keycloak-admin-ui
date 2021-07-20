import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from "../../routes";
import { ClientsSection } from "../ClientsSection";
import type { HomeParams } from "../../routes/Home";

export type ClientsParams = HomeParams & {
  tab?: string;
};

export const ClientsRoute: RouteConfig = {
  path: "/:realm/clients/:tab?",
  component: ClientsSection,
  breadcrumb: (t) => t("clients:clientList"),
  access: "query-clients",
};

export const toClients = (params: ClientsParams): LocationDescriptorObject => ({
  pathname: generatePath(ClientsRoute.path, params),
});
