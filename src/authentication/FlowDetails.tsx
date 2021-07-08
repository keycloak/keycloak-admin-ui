import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DataList, Label, PageSection } from "@patternfly/react-core";
import { CheckCircleIcon } from "@patternfly/react-icons";

import type AuthenticationExecutionInfoRepresentation from "keycloak-admin/lib/defs/authenticationExecutionInfoRepresentation";
import type AuthenticationFlowRepresentation from "keycloak-admin/lib/defs/authenticationFlowRepresentation";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { EmptyExecutionState } from "./EmptyExecutionState";
import { toUpperCase } from "../util";
import { FlowHeader } from "./components/FlowHeader";
import { FlowRow } from "./components/FlowRow";
import { ExecutionList } from "./execution-model";

export type ExpandableExecution = AuthenticationExecutionInfoRepresentation & {
  executionList: ExpandableExecution[];
  isCollapsed: boolean;
};

export const FlowDetails = () => {
  const { t } = useTranslation("authentication");
  const adminClient = useAdminClient();
  const { id, usedBy, buildIn } = useParams<{
    id: string;
    usedBy: string;
    buildIn: string;
  }>();

  const [flow, setFlow] = useState<AuthenticationFlowRepresentation>();
  const [executionList, setExecutionList] = useState<ExecutionList>();
  const [dragged, setDragged] = useState<ExpandableExecution>();

  useFetch(
    async () => {
      const flows = await adminClient.authenticationManagement.getFlows();
      const flow = flows.find((f) => f.id === id);
      const executions =
        await adminClient.authenticationManagement.getExecutions({
          flow: flow?.alias!,
        });
      return { flow, executions };
    },
    ({ flow, executions }) => {
      setFlow(flow);
      setExecutionList(new ExecutionList(executions));
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
        {executionList?.expandableList &&
          executionList.expandableList.length > 0 && (
            <DataList
              aria-label="flows"
              onDragFinish={(order) => {
                const index = order.findIndex((ex) => ex === dragged!.id);
                const pref = executionList.findExecution(order[index - 1]);
                console.log(pref);

                if (((pref && pref.level) || 0) !== dragged!.level) {
                  console.log("we are in trouble");
                }
              }}
              onDragStart={(id) => {
                const item = executionList.order().find((ex) => ex.id === id)!;
                setDragged(item);
                if (item.executionList && !item.isCollapsed) {
                  item.isCollapsed = true;
                  //setExecutions([...executions]);
                }
              }}
              onDragMove={() => {}}
              onDragCancel={() => {}}
              itemOrder={executionList.order().map((ex) => ex.id!)}
            >
              <FlowHeader />
              <>
                {executionList.expandableList.map((execution) => (
                  <FlowRow
                    key={execution.id}
                    execution={execution}
                    onRowClick={(execution) => {
                      execution.isCollapsed = !execution.isCollapsed;
                      setExecutionList(executionList.clone());
                    }}
                  />
                ))}
              </>
            </DataList>
          )}
        {!executionList?.expandableList ||
          (executionList.expandableList.length === 0 && (
            <EmptyExecutionState />
          ))}
      </PageSection>
    </>
  );
};
