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
  const [executions, setExecutions] = useState<ExpandableExecution[]>();

  const transformToExpandableList = (
    level: number,
    list: ExpandableExecution[],
    currIndex: number,
    execution: ExpandableExecution
  ) => {
    for (let index = currIndex; index < list.length; index++) {
      const ex = list[index];
      const nextRowLevel = list[index + 1]?.level || 0;

      if (ex.level === level && nextRowLevel === level) {
        execution.executionList.push(ex);
      } else if (ex.level === level) {
        const expandable = transformToExpandableList(
          nextRowLevel,
          list,
          index + 1,
          {
            ...ex,
            executionList: [],
            isCollapsed: false,
          }
        );
        execution.executionList.push(expandable);
      }
    }
    return execution;
  };

  const order = (list: ExpandableExecution[]) => {
    let result: ExpandableExecution[] = [];
    for (const row of list) {
      result.push(row);
      if (row.executionList && !row.isCollapsed) {
        result = result.concat(order(row.executionList));
      }
    }
    return result;
  };

  useFetch(
    async () => {
      const flows = await adminClient.authenticationManagement.getFlows();
      const flow = flows.find((f) => f.id === id);
      const executions = await adminClient.authenticationManagement.getExecutions(
        { flow: flow?.alias! }
      );
      return { flow, executions };
    },
    ({ flow, executions }) => {
      setFlow(flow);
      setExecutions(
        transformToExpandableList(0, executions as ExpandableExecution[], 0, {
          executionList: [],
          isCollapsed: false,
        }).executionList
      );
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
        {executions && executions.length > 0 && (
          <DataList
            aria-label="flows"
            onDragFinish={() => {}}
            onDragStart={(id) => {
              const item = order(executions).find((ex) => ex.id === id)!;
              if (item.executionList && !item.isCollapsed) {
                item.isCollapsed = true;
                setExecutions([...executions]);
              }
            }}
            onDragMove={() => {}}
            onDragCancel={() => {}}
            itemOrder={order(executions).map((ex) => ex.id!)}
          >
            <FlowHeader />
            <>
              {executions.map((execution) => (
                <FlowRow
                  key={execution.id}
                  execution={execution}
                  onRowClick={(execution) => {
                    execution.isCollapsed = !execution.isCollapsed;
                    setExecutions([...executions]);
                  }}
                />
              ))}
            </>
          </DataList>
        )}
        {!executions || (executions.length === 0 && <EmptyExecutionState />)}
      </PageSection>
    </>
  );
};
