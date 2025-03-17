import { Link } from "react-router-dom";

const AIChat = () => {
  return (
    <div>
      <h1>AI Chat</h1>
      {/* 返回上一级路由 */}
      <Link to="/">返回</Link>
    </div>

  );
};

export default AIChat;
