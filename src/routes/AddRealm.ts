import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { NewRealmForm } from "../realm/add/NewRealmForm";
import type { HomeParams } from "./Home";

export type AddRealmParams = HomeParams;

export const AddRealmRoute: RouteConfig = {
  path: "/:realm/add-realm",
  component: NewRealmForm,
  breadcrumb: (t) => t("realm:createRealm"),
  access: "manage-realm",
};

export const toAddRealm = (
  params: AddRealmParams
): LocationDescriptorObject => ({
  pathname: generatePath(AddRealmRoute.path, params),
});
