import { Page } from "@patternfly/react-core";
import React, { FunctionComponent, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  HashRouter as Router,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import { AlertProvider } from "./components/alert/Alerts";
import { PageBreadCrumbs } from "./components/bread-crumb/PageBreadCrumbs";
import { ErrorRenderer } from "./components/error/ErrorRenderer";
import { Help } from "./components/help-enabler/HelpHeader";
import { AccessContextProvider, useAccess } from "./context/access/Access";
import { useRealm } from "./context/realm-context/RealmContext";
import { ServerInfoProvider } from "./context/server-info/ServerInfoProvider";
import { ForbiddenSection } from "./ForbiddenSection";
import { SubGroups } from "./groups/SubGroupsContext";
import { Header } from "./PageHeader";
import { PageNav } from "./PageNav";
import routes, { RouteConfig } from "./routes";

export const mainPageContentId = "kc-main-content-page-container";

const AppContexts: FunctionComponent = ({ children }) => (
  <AccessContextProvider>
    <Help>
      <AlertProvider>
        <ServerInfoProvider>
          <SubGroups>{children}</SubGroups>
        </ServerInfoProvider>
      </AlertProvider>
    </Help>
  </AccessContextProvider>
);

// TODO: Handle this logic in the provider of the realm
const RealmPathSelector: FunctionComponent = ({ children }) => {
  const { setRealm } = useRealm();
  const { realm } = useParams<{ realm: string }>();

  useEffect(() => {
    if (realm) setRealm(realm);
  }, []);

  return <>{children}</>;
};

// If someone tries to go directly to a route they don't
// have access to, show forbidden page.
type SecuredRouteProps = { route: RouteConfig };

const SecuredRoute = ({ route }: SecuredRouteProps) => {
  const { hasAccess } = useAccess();
  if (hasAccess(route.access)) return <route.component />;

  return <ForbiddenSection />;
};

export const App = () => {
  return (
    <AppContexts>
      <Router>
        <Page
          header={<Header />}
          isManagedSidebar
          sidebar={<PageNav />}
          breadcrumb={<PageBreadCrumbs />}
          mainContainerId={mainPageContentId}
        >
          <ErrorBoundary
            FallbackComponent={ErrorRenderer}
            onReset={() => window.location.reload()}
          >
            <Switch>
              {routes.map((route, i) => (
                <Route
                  key={i}
                  path={route.path}
                  component={() => (
                    <RealmPathSelector>
                      <SecuredRoute route={route} />
                    </RealmPathSelector>
                  )}
                />
              ))}
            </Switch>
          </ErrorBoundary>
        </Page>
      </Router>
    </AppContexts>
  );
};
