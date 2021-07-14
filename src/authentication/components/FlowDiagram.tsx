import React from "react";
import ReactFlow, { Elements, Position } from "react-flow-renderer";

import type { ExecutionList, ExpandableExecution } from "../execution-model";

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
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: { label: ex.displayName! },
      position: { x: 200 * (ex.level! + 1), y: 25 + 100 * ex.index! },
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
    position: { x: 20, y: 25 },
    className: "keycloak__authentication__input_node",
  });
  elements.push({
    id: "end",
    targetPosition: Position.Left,
    type: "output",
    data: { label: "End" },
    position: { x: 800, y: 25 },
    className: "keycloak__authentication__output_node",
  });

  elements = elements.concat(createEdge("start", expandableList));

  return <ReactFlow elements={elements} />;
};
