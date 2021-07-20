import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { DashboardSection } from "../dashboard/Dashboard";

export type HomeParams = {
  realm: string;
};

export const HomeRoute: RouteConfig = {
  path: "/:realm/",
  component: DashboardSection,
  breadcrumb: (t) => t("common:home"),
  access: "anyone",
};

export const toHome = (params: HomeParams): LocationDescriptorObject => ({
  pathname: generatePath(HomeRoute.path, params),
});
