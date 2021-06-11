import React from "react";
import { useTranslation } from "react-i18next";
import {
  DataListItemRow,
  DataListControl,
  DataListDragButton,
  DataListItemCells,
  DataListCell,
  DataListItem,
  DataListContent,
  DataListToggle,
} from "@patternfly/react-core";

import type { ExpandableExecution } from "../FlowDetails";
import { FlowTitle } from "./FlowTitle";

import "./flow-row.css";

type FlowRowProps = {
  execution: ExpandableExecution;
};

export const FlowRow = ({ execution }: FlowRowProps) => {
  const { t } = useTranslation("authentication");
  return (
    <DataListItem className="keycloak__authentication__flow-item">
      <DataListItemRow
        key={execution.id}
        id={execution.id}
        className="keycloak__authentication__flow-row"
        aria-level={execution.level}
      >
        <DataListControl>
          <DataListDragButton
            aria-label={t("common:reorder")}
            aria-labelledby={execution.displayName}
            aria-describedby={t("common-help:dragHelp")}
          />
        </DataListControl>
        <DataListToggle
          onClick={() => {}}
          isExpanded={execution.isCollapsed}
          id={`toggle1-${execution.id}`}
          aria-controls={`expand-${execution.id}`}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key={`${execution.id}-name`}>
              <FlowTitle key={execution.id} title={execution.displayName!} />
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
      {execution.executionList && execution.executionList.length > 0 && (
        <DataListContent
          aria-label="Primary Content Details"
          id={`expand-${execution.id}`}
          isHidden={!open}
        >
          <>
            {execution.executionList.map((execution) => (
              <FlowRow key={execution.id} execution={execution} />
            ))}
          </>
        </DataListContent>
      )}
    </DataListItem>
  );
};
