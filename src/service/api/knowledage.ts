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
  if (!id) {
    return Promise.reject("id 不能为空");
  }
  return http.put(`/knowledge/node/${id}`, data);
};
