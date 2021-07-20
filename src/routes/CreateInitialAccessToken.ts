import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import { CreateInitialAccessToken } from "../clients/initial-access/CreateInitialAccessToken";
import type { HomeParams } from "./Home";

export type CreateInitialAccessTokenParams = HomeParams;

export const CreateInitialAccessTokenRoute: RouteConfig = {
  path: "/:realm/clients/initialAccessToken/create",
  component: CreateInitialAccessToken,
  breadcrumb: (t) => t("clients:createToken"),
  access: "manage-clients",
};

export const toCreateInitialAccessToken = (
  params: CreateInitialAccessTokenParams
): LocationDescriptorObject => ({
  pathname: generatePath(CreateInitialAccessTokenRoute.path, params),
});
