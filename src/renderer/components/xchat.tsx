import {
  // 消息气泡
  Bubble,
  // 发送框
  Sender,
} from "@ant-design/x";

const messages = [
  {
    content: "Hello, Ant Design X!",
    role: "user",
  },
];

const XChat = () => (
  <div>
    <Bubble.List items={messages} />
    <Sender />
  </div>
);

export default XChat;
