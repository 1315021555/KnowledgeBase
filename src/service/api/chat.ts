import http from "../../common/baseApi";
interface ChatRequest {
  question: string; // 请求体中的提问内容
}
interface KnowledgeChatRequest {
  question: string; // 请求体中的提问内容
  knowledgeId: number; // 可选的知识ID
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

export const getChatHistoryByKnowledgeId = async (knowledgeId: number) => {
  return http.get(`/chat/history/knowledge/${knowledgeId}`);
};
