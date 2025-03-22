import { TreeDataNode } from "antd";
import http from "../../common/baseApi";

export const getDirTree = (): Promise<TreeDataNode[]> => {
  return http.get("/knowledge/tree");
};

export const getKnowledgeContentById = (id: string): Promise<any> => {
  if (!id) {
    return Promise.reject("id 不能为空");
  }
  return http.get(`/knowledge/${id}`);
};

export const updateKnowledgeContentById = (
  id: string,
  data: { title?: string; content?: string }
): Promise<any> => {
  console.log("id", id, typeof id);
  if (!id || id === "null") {
    return Promise.reject("id 不能为空");
  }
  return http.put(`/knowledge/node/${id}`, data);
};

// 给树节点添加子节点
export const addChildNode = (
  parentId: string,
  data: { title: string; content?: string }
): Promise<any> => {
  return http.post(`/knowledge/node/${parentId}`, data);
};

// 删除节点
export const deleteNode = (id: string): Promise<any> => {
  return http.delete(`/knowledge/node/${id}`);
};