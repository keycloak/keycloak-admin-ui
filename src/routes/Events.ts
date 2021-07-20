import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { EventsSection } from "../events/EventsSection";
import type { HomeParams } from "./Home";

export type EventsParams = HomeParams & {
  tab?: string;
};

export const EventsRoute: RouteConfig = {
  path: "/:realm/events/:tab?",
  component: EventsSection,
  breadcrumb: (t) => t("events:title"),
  access: "view-events",
};

export const toEvents = (params: EventsParams): LocationDescriptorObject => ({
  pathname: generatePath(EventsRoute.path, params),
});
