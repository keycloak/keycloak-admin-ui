import React from "react";
import ReactFlow, { Elements, Position } from "react-flow-renderer";

import type { ExecutionList, ExpandableExecution } from "../execution-model";
import { EndSubFlowNode, StartSubFlowNode } from "./diagram/SubFlowNode";
import { ConditionalNode } from "./diagram/ConditionalNode";
import { getLayoutedElements } from "./diagram/auto-layout";

import "./flow-diagram.css";

type FlowDiagramProps = {
  executionList: ExecutionList;
};

const createEdge = (fromNode: string, toNode: string) => ({
  id: `edge-${fromNode}-to-${toNode}`,
  source: fromNode,
  target: toNode,
});

const createNode = (parentNode: string, ex: ExpandableExecution) => {
  const result: Elements = [];
  let nodeType: string | undefined = undefined;
  if (ex.executionList) {
    nodeType = "startSubFlow";
  }
  if (ex.requirement === "CONDITIONAL") {
    nodeType = "conditional";
  }
  result.push({
    id: ex.id!,
    type: nodeType,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: ex.displayName! },
    position: { x: 0, y: 0 },
  });

  result.push(createEdge(parentNode, ex.id!));
  return result;
};

const subFlow = (
  parentNode: ExpandableExecution,
  executionList: ExpandableExecution[],
  endNode: string
) => {
  let elements: Elements = [];
  const endSubFlowId = `${parentNode.id!}-end`;
  elements.push({
    id: endSubFlowId,
    type: "endSubFlow",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: parentNode.displayName! },
    position: { x: 0, y: 0 },
  });

  let hasSubList = false;
  for (let index = 0; index < executionList.length; index++) {
    const execution = executionList[index];
    elements = elements.concat(
      createNode(executionList[index - 1]?.id || parentNode.id!, execution)
    );
    if (execution.executionList) {
      hasSubList = true;
      elements = elements.concat(
        subFlow(execution, execution.executionList, endSubFlowId)
      );
    }
  }

  if (!hasSubList) {
    elements.push(
      createEdge(executionList[executionList.length - 1].id!, endSubFlowId)
    );
  }
  elements.push(createEdge(endSubFlowId, endNode));

  return elements;
};

export const FlowDiagram = ({
  executionList: { expandableList },
}: FlowDiagramProps) => {
  let elements: Elements = [
    {
      id: "start",
      sourcePosition: Position.Right,
      type: "input",
      data: { label: "Start" },
      position: { x: 0, y: 0 },
      className: "keycloak__authentication__input_node",
    },
    {
      id: "end",
      targetPosition: Position.Left,
      type: "output",
      data: { label: "End" },
      position: { x: 0, y: 0 },
      className: "keycloak__authentication__output_node",
    },
  ];

  for (const ex of expandableList) {
    elements = elements.concat(createNode("start", ex));
    if (ex.executionList) {
      elements = elements.concat(subFlow(ex, ex.executionList, "end"));
    } else {
      elements.push(createEdge(ex.id!, "end"));
    }
  }

  return (
    <ReactFlow
      nodeTypes={{
        conditional: ConditionalNode,
        startSubFlow: StartSubFlowNode,
        endSubFlow: EndSubFlowNode,
      }}
      elements={getLayoutedElements(elements)}
    />
  );
};
