import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from ".";
import {
  AddIdentityProvider,
  IdentityProviderCrumb,
} from "../identity-providers/add/AddIdentityProvider";
import type { HomeParams } from "./Home";

export type AddIdentityProviderParams = HomeParams & {
  id: string;
};

export const AddIdentityProviderRoute: RouteConfig = {
  path: "/:realm/identity-providers/:id",
  component: AddIdentityProvider,
  breadcrumb: IdentityProviderCrumb,
  access: "manage-identity-providers",
};

export const toAddIdentityProvider = (
  params: AddIdentityProviderParams
): LocationDescriptorObject => ({
  pathname: generatePath(AddIdentityProviderRoute.path, params),
});
