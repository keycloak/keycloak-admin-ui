import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { UserGroups } from "../user/UserGroups";
import type { HomeParams } from "./Home";

export type UserParams = HomeParams & {
  id: string;
};

export const UserRoute: RouteConfig = {
  path: "/:realm/users/:id",
  component: UserGroups,
  breadcrumb: (t) => t("users:userDetails"),
  access: "manage-users",
};

export const toUser = (params: UserParams): LocationDescriptorObject => ({
  pathname: generatePath(UserRoute.path, params),
});
