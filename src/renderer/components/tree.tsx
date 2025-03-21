import React from "react";
import { Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";

// 定义 Tree 组件的 props
interface TreeComponentProps {
  treeData: TreeDataNode[];
  expandedKeys: string[];
  onDragEnter: TreeProps["onDragEnter"];
  onDrop: TreeProps["onDrop"];
  onSelect: TreeProps["onSelect"];
}

const TreeComponent: React.FC<TreeComponentProps> = ({
  treeData,
  expandedKeys,
  onDragEnter,
  onDrop,
  onSelect,
}) => {
  return (
    <Tree
      className="draggable-tree"
      defaultExpandedKeys={expandedKeys}
      draggable
      blockNode
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onSelect={onSelect}
      treeData={treeData}
    />
  );
};

export default TreeComponent;
