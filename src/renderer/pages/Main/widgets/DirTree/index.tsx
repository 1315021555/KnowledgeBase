import React, { useEffect, useState } from "react";
import {
  addChildNode,
  deleteNode,
  getDirTree,
  getKnowledgeContentById,
} from "@/service/api/knowledage";
import { Dropdown, Tree, type TreeDataNode, type TreeProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAndUpdateTreeData,
  setSelectedId,
  setTreeData,
} from "@/renderer/redux/knowledgeSlice";
import { useNavigate } from "react-router-dom";
import { CopyOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getParentId } from "../Note/utils";
// 写死的三个目录，每个目录有三层的树形数据
const defaultData: TreeDataNode[] = [];

const DirTree: React.FC = () => {
  // const [treeData, setTreeData] = useState<TreeDataNode[]>(defaultData);
  // 展开的节点：根节点，添加子节点之后的节点
  const [expandedKeys, setExpandedKeys] = useState(["1"]);
  const treeData = useSelector((state: any) => state.knowledge.treeData);
  const selectedKey = useSelector((state: any) => state.knowledge.selectedId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAndUpdateTreeData() as any);
  }, []);

  const onDragEnter: TreeProps["onDragEnter"] = (info) => {
    console.log(info);
  };

  const onDrop: TreeProps["onDrop"] = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: TreeDataNode[],
      key: React.Key,
      callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];

    let dragObj: TreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: TreeDataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setTreeData(data);
  };

  const onSelect: TreeProps["onSelect"] = (keys, info) => {
    if (keys.length === 0) return;
    navigate(`/knowledge`);
    console.log("select", keys, info);
    dispatch(setSelectedId(keys[0]));
  };

  // 自定义渲染Tree节点，添加右键菜单组件
  const titleRender = (nodeData: any) => {
    const menuItems = [
      {
        label: "新建页面",
        key: "1",
        icon: <CopyOutlined />,
        onClick: () => {
          console.log("新建页面", nodeData);
          // 给选中节点添加子节点
          const newNodeData = {
            title: "New Page",
            content: "",
          };
          addChildNode(nodeData.key, newNodeData).then((res) => {
            console.log("添加子节点成功", res);
            // 更新目录和知识内容
            dispatch(fetchAndUpdateTreeData() as any);
            dispatch(setSelectedId(res.id));
            // 展开节点
            setExpandedKeys([...expandedKeys, nodeData.key]);
            console.log("展开节点", expandedKeys);
          });
        },
      },
      {
        label: "复制",
        key: "2",
        icon: <CopyOutlined />,
        onClick: () => {
          // setActiveNode(nodeData);
          console.log("Duplicate", nodeData);
        },
      },
      // {
      //   label: "重命名",
      //   key: "3",
      //   icon: <EditOutlined />,
      //   onClick: () => {
      //     // setModalTitle("重命名");
      //     // setActiveNode(nodeData);
      //     // setModalValue(nodeData.title);

      //     console.log("Rename", nodeData);
      //     // onOpen();
      //   },
      // },
      {
        label: "删除",
        key: "4",
        icon: <DeleteOutlined />,
        onClick: () => {
          // setActiveNode(nodeData);
          console.log("Delete", nodeData);
          const keyToDelete = nodeData.key;
          const parentNode = getParentId(treeData, keyToDelete);
          console.log("父节点", parentNode);
          deleteNode(keyToDelete).then((res) => {
            console.log("删除节点成功", res);
            dispatch(fetchAndUpdateTreeData() as any);
            dispatch(setSelectedId(parentNode.id));
          });
        },
      },
    ];

    return (
      <Dropdown
        menu={{
          items: menuItems,
        }}
        trigger={["contextMenu"]}
      >
        <div>
          <div>{nodeData.title}</div>
        </div>
      </Dropdown>
    );
  };

  const tree = treeData?.length ? (
    <Tree
      className="draggable-tree"
      defaultExpandedKeys={expandedKeys}
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
  ) : (
    "加载目录中"
  );
  return <>{tree}</>;
};

export default DirTree;
