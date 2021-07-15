import React from "react";
import ReactFlow, { Elements, Position } from "react-flow-renderer";

import type { ExecutionList, ExpandableExecution } from "../execution-model";
import { ConditionalNode } from "./ConditionalNode";
import { getLayoutedElements } from "./auto-layout";

import "./flow-diagram.css";

type FlowDiagramProps = {
  executionList: ExecutionList;
};

const createEdge = (
  node: string,
  expandableList: ExpandableExecution[],
  direction: boolean = true
) =>
  expandableList.map((ex) => ({
    id: `edge-${node}-to-${ex.id}`,
    source: direction ? node : ex.id!,
    target: direction ? ex.id! : node,
  }));

const convert = (expandableList: ExpandableExecution[]) => {
  let result: Elements = [];
  for (const ex of expandableList) {
    result.push({
      id: ex.id!,
      type: ex.requirement === "CONDITIONAL" ? "conditionalNode" : undefined,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { label: ex.displayName! },
      position: { x: 0, y: 0 },
    });
    if (ex.executionList) {
      const subFlow = ex.executionList;
      result = result.concat(createEdge(ex.id!, subFlow));
      result = result.concat(convert(subFlow));
    } else {
      result = result.concat(createEdge("end", [ex], false));
    }
  }
  return result as Elements;
};

export const FlowDiagram = ({
  executionList: { expandableList },
}: FlowDiagramProps) => {
  let elements = convert(expandableList);
  elements.unshift({
    id: "start",
    sourcePosition: Position.Right,
    type: "input",
    data: { label: "Start" },
    position: { x: 0, y: 0 },
    className: "keycloak__authentication__input_node",
  });
  elements.push({
    id: "end",
    targetPosition: Position.Left,
    type: "output",
    data: { label: "End" },
    position: { x: 0, y: 0 },
    className: "keycloak__authentication__output_node",
  });

  elements = elements.concat(createEdge("start", expandableList));

  return (
    <ReactFlow
      nodeTypes={{
        conditionalNode: ConditionalNode,
      }}
      elements={getLayoutedElements(elements)}
    />
  );
};
