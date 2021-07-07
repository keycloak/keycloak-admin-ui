import KcAdminClient from "keycloak-admin";

export default async function (): Promise<KcAdminClient> {
  const realm =
    new URLSearchParams(window.location.search).get("realm") || "master";

  const kcAdminClient = new KcAdminClient();

  try {
    await kcAdminClient.init(
      { onLoad: "check-sso", pkceMethod: "S256" },
      {
        url: keycloakAuthUrl(),
        realm: realm,
        clientId: "security-admin-console-v2",
      }
    );
    kcAdminClient.setConfig({ realmName: realm });
  } catch (error) {
    alert("failed to initialize keycloak");
  }

  return kcAdminClient;
}

const keycloakAuthUrl = () => {
  // Eventually, authContext should not be hard-coded.
  // You are allowed to change this context on your keycloak server,
  // but it is rarely done.
  const authContext = "/auth";

  const searchParams = new URLSearchParams(window.location.search);

  // passed in as query param
  const authUrlFromParam = searchParams.get("keycloak-server");
  if (authUrlFromParam) return authUrlFromParam + authContext;

  // demo mode
  if (searchParams.get("demo")) return "http://localhost:8080" + authContext;

  // admin console served from keycloak server
  return window.location.origin + authContext;
};
