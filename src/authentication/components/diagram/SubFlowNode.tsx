import React, { memo } from "react";
import { Handle, Position } from "react-flow-renderer";

type NodeProps = {
  data: { label: string };
};

type SubFlowNodeProps = NodeProps & {
  prefix: string;
};

export const SubFlowNode = memo(function TheNode({
  data: { label },
  prefix,
}: SubFlowNodeProps) {
  return (
    <>
      <Handle position={Position.Right} type="source" />
      <div className="react-flow__node-default keycloak__authentication__subflow_node">
        <div>
          {prefix} {label}
        </div>
      </div>
      <Handle position={Position.Left} type="target" />
    </>
  );
});

export const StartSubFlowNode = ({ ...props }: NodeProps) => (
  <SubFlowNode {...props} prefix="Start" />
);
export const EndSubFlowNode = ({ ...props }: NodeProps) => (
  <SubFlowNode {...props} prefix="End" />
);
