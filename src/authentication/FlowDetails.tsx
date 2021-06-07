import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Label, PageSection } from "@patternfly/react-core";
import { CheckCircleIcon } from "@patternfly/react-icons";

import type AuthenticationExecutionInfoRepresentation from "keycloak-admin/lib/defs/authenticationExecutionInfoRepresentation";
import type AuthenticationFlowRepresentation from "keycloak-admin/lib/defs/authenticationFlowRepresentation";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { EmptyExecutionState } from "./EmptyExecutionState";
import { toUpperCase } from "../util";

export const FlowDetails = () => {
  const { t } = useTranslation("authentication");
  const adminClient = useAdminClient();
  const { id, usedBy, buildIn } = useParams<{
    id: string;
    usedBy: string;
    buildIn: string;
  }>();

  const [flow, setFlow] = useState<AuthenticationFlowRepresentation>();
  const [executions, setExecutions] = useState<
    AuthenticationExecutionInfoRepresentation[]
  >();

  useFetch(
    async () => {
      const flows = await adminClient.authenticationManagement.getFlows();
      const flow = flows.find((f) => f.id === id);
      const executions = await adminClient.authenticationManagement.getExecutions(
        { flow: flow?.alias! }
      );
      return { flow, executions };
    },
    (results) => {
      setFlow(results.flow);
      setExecutions(results.executions);
    },
    []
  );

  return (
    <>
      <ViewHeader
        titleKey={toUpperCase(flow?.alias! || "")}
        badges={[
          { text: <Label>{t(usedBy)}</Label> },
          buildIn
            ? {
                text: (
                  <Label
                    className="keycloak_authentication-section__usedby_label"
                    icon={<CheckCircleIcon />}
                  >
                    {t("buildIn")}
                  </Label>
                ),
                id: "buildIn",
              }
            : {},
        ]}
      />
      <PageSection variant="light">
        {executions &&
          executions.length > 0 &&
          executions.map((execution) => (
            <h1 key={execution.id}>{execution.displayName}</h1>
          ))}
        {!executions || (executions.length === 0 && <EmptyExecutionState />)}
      </PageSection>
    </>
  );
};
