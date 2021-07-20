import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { NewClientForm } from "../clients/add/NewClientForm";
import type { HomeParams } from "./Home";

export type AddClientParams = HomeParams;

export const AddClientRoute: RouteConfig = {
  path: "/:realm/clients/add-client",
  component: NewClientForm,
  breadcrumb: (t) => t("clients:createClient"),
  access: "manage-clients",
};

export const toAddClient = (
  params: AddClientParams
): LocationDescriptorObject => ({
  pathname: generatePath(AddClientRoute.path, params),
});
