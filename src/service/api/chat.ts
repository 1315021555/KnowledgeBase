import { ChatHistoryMessage } from "@/renderer/utils/formatMessage";
import http from "../../common/baseApi";
interface ChatRequest {
  question: string; // 请求体中的提问内容
}
interface KnowledgeChatRequest {
  question: string; // 请求体中的提问内容
  knowledgeId: number; // 可选的知识ID
}

// types/chat.ts
export interface SessionChatParams {
  question: string;
  sessionId: number;
  isRag?: boolean; // 可选参数，默认为 false
}

export interface ChatMessageEvent {
  data: {
    message: string;
  };
}

// 基于某个知识的聊天接口
export const streamKnowledgeChat = async (request: KnowledgeChatRequest) => {
  const { question, knowledgeId } = request;
  return new EventSource(
    `http://localhost:3000/chat/stream?knowledgeId=${encodeURIComponent(
      knowledgeId
    )}&question=${encodeURIComponent(question)}`
  );
};

// 基于RAG的聊天接口
export const streamRagChat = async (request: ChatRequest) => {
  const { question } = request;
  return new EventSource(
    `http://localhost:3000/chat/RagChat?question=${encodeURIComponent(
      question
    )}`
  );
};

// 会话Chat
export const sessionChat = async (params: SessionChatParams) => {
  const { question, sessionId, isRag } = params;
  return new EventSource(
    `http://localhost:3000/chat/sessionChat?question=${encodeURIComponent(
      question
    )}&sessionId=${encodeURIComponent(sessionId)}&isRag=${encodeURIComponent(
      isRag ?? false
    )}`
  );
};

export const getChatHistoryByKnowledgeId = async (knowledgeId: number) => {
  return http.get(`/chat/history/knowledge/${knowledgeId}`);
};

export const getSessionList = async () => {
  return http.get("/chat/sessionList");
};

export const getChatHistoryBySessionId = async (
  sessionId: number
): Promise<ChatHistoryMessage[]> => {
  return http.get(`/chat/history/session/${sessionId}`);
};

/**
 * 创建一个新的会话
 */
export const createChatSession = async (data: { name: string }) => {
  return http.post("/chat/session", data);
};

/**
 * 删除一个会话
 */
export const deleteChatSession = async (sessionId: number) => {
  return http.delete(`/chat/session/${sessionId}`);
};

/**
 * 更新一个会话
 */
export const updateChatSession = async (
  sessionId: number,
  data: { name: string }
) => {
  return http.put(`/chat/session/${sessionId}`, data);
};
