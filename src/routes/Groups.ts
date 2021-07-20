import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { GroupsSection } from "../groups/GroupsSection";
import type { HomeParams } from "./Home";

export type GroupsParams = HomeParams;

export const GroupsRoute: RouteConfig = {
  path: "/:realm/groups",
  component: GroupsSection,
  breadcrumb: null,
  access: "query-groups",
  exact: false,
};

export const toGroups = (params: GroupsParams): LocationDescriptorObject => ({
  pathname: generatePath(GroupsRoute.path, params),
});
