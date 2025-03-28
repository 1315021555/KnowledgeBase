import { MessageInfo } from "@ant-design/x/es/use-x-chat";

export interface ChatHistoryMessage {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  session?: Object;
  knowledge?: Object;
}

export function formatMessage(
  chatHistory: ChatHistoryMessage[]
): MessageInfo<string>[] {
  const res = [];
  for (let i = 0; i < chatHistory.length; i++) {
    const item = chatHistory[i];
    res.push({
      // id: item.id,
      message: item.question,
      status: "local",
    } as MessageInfo<string>);
    res.push({
      // id: item.id,
      message: item.answer,
      status: "success",
    } as MessageInfo<string>);
  }
  return res;
}
