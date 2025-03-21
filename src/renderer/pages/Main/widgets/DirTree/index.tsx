import React, { useEffect, useState } from "react";
import TreeComponent from "@/renderer/components/tree";
import { getDirTree, getKnowledgeContentById } from "@/service/api/knowledage";
import type { TreeDataNode, TreeProps } from "antd";
import { useDispatch } from "react-redux";
import { setSelectedId } from "@/renderer/redux/knowledgeSlice";

// 写死的三个目录，每个目录有三层的树形数据
const defaultData: TreeDataNode[] = [];

const DirTree: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>(defaultData);
  const [expandedKeys] = useState(["1-1", "2-1", "3-1"]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDirTree();
        if (!data) {
          return;
        }
        console.log("获取目录树成功:", data);
        setTreeData(data);
      } catch (error) {
        console.error("获取目录树失败:", error);
      }
    };

    fetchData();
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
    console.log("select", keys, info);
    dispatch(setSelectedId(keys[0]));
  };

  return (
    <TreeComponent
      treeData={treeData}
      expandedKeys={expandedKeys}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onSelect={onSelect}
    />
  );
};

export default DirTree;
