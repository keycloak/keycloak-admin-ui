import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageSection } from "@patternfly/react-core";

import type AuthenticationExecutionInfoRepresentation from "keycloak-admin/lib/defs/authenticationExecutionInfoRepresentation";
import type AuthenticationFlowRepresentation from "keycloak-admin/lib/defs/authenticationFlowRepresentation";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { EmptyExecutionState } from "./EmptyExecutionState";

export const FlowDetails = () => {
  const { t } = useTranslation("authentication");
  const adminClient = useAdminClient();
  const { id } = useParams<{ id: string }>();

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
      <ViewHeader titleKey={flow?.alias!} />
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
