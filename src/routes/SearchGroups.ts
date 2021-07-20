import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { SearchGroups } from "../groups/SearchGroups";
import type { HomeParams } from "./Home";

export type SearchGroupsParams = HomeParams;

export const SearchGroupsRoute: RouteConfig = {
  path: "/:realm/groups/search",
  component: SearchGroups,
  breadcrumb: (t) => t("groups:searchGroups"),
  access: "query-groups",
};

export const toSearchGroups = (
  params: SearchGroupsParams
): LocationDescriptorObject => ({
  pathname: generatePath(SearchGroupsRoute.path, params),
});
