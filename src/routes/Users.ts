import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { UsersSection } from "../user/UsersSection";
import type { HomeParams } from "./Home";

export type UsersParams = HomeParams;

export const UsersRoute: RouteConfig = {
  path: "/:realm/users",
  component: UsersSection,
  breadcrumb: (t) => t("users:title"),
  access: "query-users",
};

export const toUsers = (params: UsersParams): LocationDescriptorObject => ({
  pathname: generatePath(UsersRoute.path, params),
});
