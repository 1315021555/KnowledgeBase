import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Flex, Space, Typography } from "antd";
import { Bubble, Prompts, Sender } from "@ant-design/x";
import { RiAiGenerate2 } from "react-icons/ri";
const fooAvatar: React.CSSProperties = {
  color: "#f56a00",
  backgroundColor: "#fde3cf",
};

const barAvatar: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#87d068",
};

const hideAvatar: React.CSSProperties = {
  visibility: "hidden",
};

const App: React.FC = () => (
  <>
    <div
      className="chat"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "15px",
        height: "100% ",
      }}
    >
      <Typography.Title level={4}>
        <Flex align="center" gap="small">
          <RiAiGenerate2 />
          AI助手
        </Flex>
      </Typography.Title>
      <div
        className="bubbleList"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 15,
          overflowY: "auto",
        }}
      >
        <Bubble
          placement="start"
          content="Good morning, how are you?"
          avatar={{ icon: <UserOutlined />, style: fooAvatar }}
        />
        <Bubble
          placement="start"
          content="What a beautiful day!"
          styles={{ avatar: hideAvatar }}
          avatar={{}}
        />
        <Bubble
          placement="end"
          content="Hi, good morning, I'm fine!"
          avatar={{ icon: <UserOutlined />, style: barAvatar }}
        />
        <Bubble
          placement="end"
          content="Thank you!"
          styles={{ avatar: hideAvatar }}
          avatar={{}}
        />
        <Bubble
          placement="end"
          content="Hi, good morning, I'm fine!"
          avatar={{ icon: <UserOutlined />, style: barAvatar }}
        />
        <Bubble
          placement="end"
          content="Thank you!"
          styles={{ avatar: hideAvatar }}
          avatar={{}}
        />
      </div>

      <Prompts> </Prompts>
      {/* 输入框 */}
      <Sender></Sender>
    </div>
  </>
);

export default App;
