
interface ChatRequest {
  question: string; // 请求体中的提问内容
}
export const streamChat = async (request: ChatRequest) => {
  const { question } = request;
  return new EventSource(
    `http://localhost:3000/chat/stream?question=${encodeURIComponent(question)}`
  );
};
