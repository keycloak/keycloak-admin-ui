import React from "react";
import ReactFlow, { Elements, Position, isNode } from "react-flow-renderer";
import dagre from "dagre";

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
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 130;
  const nodeHeight = 28;

  const getLayoutedElements = (elements: Elements, direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    elements.forEach((element) => {
      if (isNode(element)) {
        dagreGraph.setNode(element.id, {
          width: nodeWidth,
          height: nodeHeight,
        });
      } else {
        dagreGraph.setEdge(element.source, element.target);
      }
    });

    dagre.layout(dagreGraph);

    return elements.map((element) => {
      if (isNode(element)) {
        const nodeWithPosition = dagreGraph.node(element.id);
        element.targetPosition = isHorizontal ? Position.Left : Position.Top;
        element.sourcePosition = isHorizontal
          ? Position.Right
          : Position.Bottom;

        element.position = {
          x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
          y: nodeWithPosition.y - nodeHeight / 2,
        };
      }

      return element;
    });
  };

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

  return <ReactFlow elements={getLayoutedElements(elements, "LR")} />;
};
