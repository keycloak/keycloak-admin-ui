import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DataList,
  Label,
  PageSection,
  Toolbar,
  ToolbarContent,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import { CheckCircleIcon, TableIcon } from "@patternfly/react-icons";

import type AuthenticationExecutionInfoRepresentation from "keycloak-admin/lib/defs/authenticationExecutionInfoRepresentation";
import type AuthenticationFlowRepresentation from "keycloak-admin/lib/defs/authenticationFlowRepresentation";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { EmptyExecutionState } from "./EmptyExecutionState";
import { toUpperCase } from "../util";
import { FlowHeader } from "./components/FlowHeader";
import { FlowRow } from "./components/FlowRow";
import { ExecutionList, IndexChange, LevelChange } from "./execution-model";
import { FlowDiagram } from "./components/FlowDiagram";

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

  const [tableView, setTableView] = useState(true);
  const [flow, setFlow] = useState<AuthenticationFlowRepresentation>();
  const [executionList, setExecutionList] = useState<ExecutionList>();
  const [dragged, setDragged] =
    useState<AuthenticationExecutionInfoRepresentation>();
  const [liveText, setLiveText] = useState("");

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

  const executeChange = async (
    ex: AuthenticationFlowRepresentation,
    change: LevelChange | IndexChange
  ) => {
    let id = ex.id!;
    if ("parent" in change) {
      await adminClient.authenticationManagement.delExecution({ id });
      const result =
        await adminClient.authenticationManagement.addExecutionToFlow({
          flow: change.parent?.displayName! || flow?.alias!,
          provider: ex.providerId!,
        });
      id = result.id!;
    }
    const c = change as IndexChange;
    const times = c.newIndex - c.oldIndex;
    for (let index = 0; index < Math.abs(times); index++) {
      if (times > 0) {
        await adminClient.authenticationManagement.lowerPriorityExecution({
          id,
        });
      } else {
        await adminClient.authenticationManagement.raisePriorityExecution({
          id,
        });
      }
    }
  };

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
            <Toolbar id="toolbar">
              <ToolbarContent>
                <ToggleGroup>
                  <ToggleGroupItem
                    icon={<TableIcon />}
                    aria-label="copy icon button"
                    buttonId="third"
                    isSelected={tableView}
                    onChange={() => setTableView(true)}
                  />
                  <ToggleGroupItem
                    icon={<i className="fas fa-project-diagram"></i>}
                    aria-label="undo icon button"
                    buttonId="fourth"
                    isSelected={!tableView}
                    onChange={() => setTableView(false)}
                  />
                </ToggleGroup>
              </ToolbarContent>
            </Toolbar>
          )}
        {tableView &&
          executionList?.expandableList &&
          executionList.expandableList.length > 0 && (
            <>
              <DataList
                aria-label="flows"
                onDragFinish={(order) => {
                  const withoutHeaderId = order.slice(1);
                  setLiveText(
                    t("common:onDragFinish", { list: dragged?.displayName })
                  );
                  const change = executionList.getChange(
                    dragged!,
                    withoutHeaderId
                  );
                  executeChange(dragged!, change);
                }}
                onDragStart={(id) => {
                  const item = executionList.findExecution(id)!;
                  setLiveText(
                    t("common:onDragStart", { item: item.displayName })
                  );
                  setDragged(item);
                  if (item.executionList && !item.isCollapsed) {
                    item.isCollapsed = true;
                    setExecutionList(executionList.clone());
                  }
                }}
                onDragMove={() =>
                  setLiveText(
                    t("common:onDragMove", { item: dragged?.displayName })
                  )
                }
                onDragCancel={() => setLiveText(t("common:onDragCancel"))}
                itemOrder={[
                  "header",
                  ...executionList.order().map((ex) => ex.id!),
                ]}
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
              <div className="pf-screen-reader" aria-live="assertive">
                {liveText}
              </div>
            </>
          )}
        {!tableView && executionList?.expandableList && (
          <FlowDiagram executionList={executionList} />
        )}
        {!executionList?.expandableList ||
          (executionList.expandableList.length === 0 && (
            <EmptyExecutionState />
          ))}
      </PageSection>
    </>
  );
};
