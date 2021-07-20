import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { UsersTabs } from "../user/UsersTabs";
import type { HomeParams } from "./Home";

export type AddUserParams = HomeParams;

export const AddUserRoute: RouteConfig = {
  path: "/:realm/users/add-user",
  component: UsersTabs,
  breadcrumb: (t) => t("users:createUser"),
  access: "manage-users",
};

export const toAddUser = (params: AddUserParams): LocationDescriptorObject => ({
  pathname: generatePath(AddUserRoute.path, params),
});
