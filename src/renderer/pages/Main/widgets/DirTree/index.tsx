import React, { useEffect, useState } from "react";
import {
  addChildNode,
  deleteNode,
  getDirTree,
  getKnowledgeContentById,
  moveNode,
} from "@/service/api/knowledage";
import {
  Dropdown,
  Tree,
  type TreeDataNode,
  type TreeProps,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAndUpdateTreeData,
  setSelectedId,
  setTreeData,
} from "@/renderer/redux/knowledgeSlice";
import { useNavigate } from "react-router-dom";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getParentId } from "../Editor/utils";
import { useSetKnowledgeId } from "@/renderer/hooks/useSetKnowledgeId";

const DirTree: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState(["1"]);
  const [loading, setLoading] = useState(false);
  const treeData = useSelector((state: any) => state.knowledge.treeData);
  const selectedKey = useSelector((state: any) => state.knowledge.selectedId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setKnowledgeId = useSetKnowledgeId();

  useEffect(() => {
    dispatch(fetchAndUpdateTreeData() as any);
  }, []);


  const onDragEnter: TreeProps["onDragEnter"] = (info) => {
    // Optional: Add visual feedback during drag
    console.log("Drag enter:", info);
  };

  const onDrop: TreeProps["onDrop"] = async (info) => {
    setLoading(true);
    try {
      const { dragNode, node, dropPosition, dropToGap } = info;

      const moveRes = await moveNode(
        dragNode.key as string,
        node.key as string
      );
      console.log("moveRes", moveRes);

      // Refresh the tree data from server
      await dispatch(fetchAndUpdateTreeData() as any);

      message.success("位置更新成功");
    } catch (error) {
      console.error("拖拽失败:", error);
      message.error("拖拽失败");
    } finally {
      setLoading(false);
    }
  };

  const onSelect: TreeProps["onSelect"] = (keys, info) => {
    if (keys.length === 0) return;
    navigate(`/knowledge`);
    setKnowledgeId(keys[0] as string);
  };

  const titleRender = (nodeData: any) => {
    const isRoot = nodeData.key == "1";

    const menuItems = [
      {
        label: "新建页面",
        key: "1",
        icon: <CopyOutlined />,
        onClick: async () => {
          try {
            const newNodeData = {
              title: "New Page",
              content: "",
            };
            await addChildNode(nodeData.key, newNodeData);
            await dispatch(fetchAndUpdateTreeData() as any);
            setExpandedKeys([...expandedKeys, nodeData.key]);
          } catch (error) {
            message.error("创建页面失败");
          }
        },
      },
      {
        label: "复制",
        key: "2",
        icon: <CopyOutlined />,
        onClick: () => {
          console.log("Duplicate", nodeData);
        },
      },
    ];

    if (!isRoot) {
      menuItems.push({
        label: "删除",
        key: "4",
        icon: <DeleteOutlined />,
        onClick: async () => {
          try {
            const keyToDelete = nodeData.key;
            const parentNode = getParentId(treeData, keyToDelete);
            await deleteNode(keyToDelete);
            await dispatch(fetchAndUpdateTreeData() as any);
            setKnowledgeId(parentNode.id);
          } catch (error) {
            message.error("删除失败");
          }
        },
      });
    }

    return (
      <Dropdown
        menu={{
          items: menuItems,
        }}
        trigger={["contextMenu"]}
      >
        <div className="tree-node-content">
          <div>{nodeData.title}</div>
        </div>
      </Dropdown>
    );
  };

  return (
    <Tree
      className="draggable-tree"
      expandedKeys={expandedKeys}
      onExpand={(keys) => setExpandedKeys(keys as string[])}
      defaultExpandAll
      autoExpandParent
      blockNode
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onSelect={onSelect}
      treeData={treeData}
      draggable={{
        icon: false,
      }}
      titleRender={titleRender}
      selectedKeys={[selectedKey]}
    />
  );
};

export default DirTree;
