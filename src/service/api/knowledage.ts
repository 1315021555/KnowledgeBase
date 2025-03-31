import { TreeDataNode } from "antd";
import http from "../../common/baseApi";

interface KnowledgeContent {
  id: string; // 知识节点 ID
  title: string; // 知识节点标题
  content: string; // 知识节点内容
  children?: KnowledgeContent[]; // 子节点数组
  parentId?: string; // 父节点 ID
  lastAccessedAt?: string; // 最后访问时间
}

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
  data: Partial<KnowledgeContent>
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

// 移动节点
export const moveNode = (id: string, parentId: string): Promise<any> => {
  return http.put(`/knowledge/node/${id}/move/${parentId}`);
};

// 获取最近访问的知识节点
export const getRecentlyAccessedKnowledge = (): Promise<KnowledgeContent[]> => {
  return http.get("/knowledge/recentlyAccessed");
};

// 搜索知识节点
export const searchKnowledge = (query: string): Promise<KnowledgeContent[]> => {
  return http.get(`/knowledge/search/${query}`);
};
