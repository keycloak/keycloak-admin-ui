import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { SessionsSection } from "../sessions/SessionsSection";
import type { HomeParams } from "./Home";

export type SessionsParams = HomeParams;

export const SessionsRoute: RouteConfig = {
  path: "/:realm/sessions",
  component: SessionsSection,
  breadcrumb: (t) => t("sessions:title"),
  access: "view-realm",
};

export const toSessions = (
  params: SessionsParams
): LocationDescriptorObject => ({
  pathname: generatePath(SessionsRoute.path, params),
});
