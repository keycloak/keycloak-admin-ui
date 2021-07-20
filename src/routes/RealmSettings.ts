import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { RealmSettingsSection } from "../realm-settings/RealmSettingsSection";
import type { HomeParams } from "./Home";

export type RealmSettingsParams = HomeParams & {
  tab?: string;
};

export const RealmSettingsRoute: RouteConfig = {
  path: "/:realm/realm-settings/:tab?",
  component: RealmSettingsSection,
  breadcrumb: (t) => t("realmSettings"),
  access: "view-realm",
};

export const toRealmSettings = (
  params: RealmSettingsParams
): LocationDescriptorObject => ({
  pathname: generatePath(RealmSettingsRoute.path, params),
});
