import React, { useEffect } from "react";
import {
  CopyOutlined,
  DiffOutlined,
  PlusOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Flex, GetProp, message, Space, theme, Typography } from "antd";
import { Bubble, Prompts, Sender, useXAgent, useXChat } from "@ant-design/x";
import { RiAiGenerate2 } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { EmitType, setEmitObjFromChat } from "@/renderer/redux/editorSlice";
import { Tooltip } from "antd"; // 引入 Tooltip 组件

const roles: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
    placement: "start",
    avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
  },
  local: {
    placement: "end",
    avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
  },
};
const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));
const App: React.FC = () => {
  const selectedText = useSelector((state: any) => state.chat.selectedText);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!selectedText) return;
    onSubmit(selectedText);
  }, [selectedText]);
  const [content, setContent] = React.useState<string>("");

  // UI
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const showFooter = (id: string | number, status: string, index: number) => {
    const isInit = id === "init";
    const isLocal = status === "local";
    const isLastLoading = index === messages.length - 1 && loading;
    return !isInit && !isLocal && !isLastLoading; // 最后一条消息，且不是初始化消息，且不是本地消息，才显示footer
  };
  // 代理请求
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onError }) => {
      setLoading(true);
      await sleep();

      onSuccess(`Mock success return. You said: ${message}`);
      setLoading(false);
      onError(new Error("Mock request failed"));
    },
  });

  // 数据管理
  const { onRequest, messages } = useXChat({
    agent,
    defaultMessages: [
      {
        id: "init",
        message: "你好,我是你的智能助手，请问有什么可以帮您的吗？",
        status: "success",
      },
    ],
    requestPlaceholder: "请输入您的问题",
    requestFallback: "请求失败，请稍后再试",
  });

  const onSubmit = (nextContent: string) => {
    onRequest(nextContent);
    setContent("");
  };
  const copyMessage = (message: string) => {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "复制成功",
          duration: 1,
        });
      })
      .catch((error) => {
        console.error("Failed to copy message: ", error);
      });
  };

  const insertMessage = (message: string) => {
    dispatch(
      setEmitObjFromChat({
        type: EmitType.INSERT,
        content: message,
      })
    );
  };

  // 新增替换消息的函数
  const replaceMessage = (message: string) => {
    dispatch(
      setEmitObjFromChat({
        type: EmitType.REPLACE, // 假设 EmitType 中有 REPLACE 类型
        content: message,
      })
    );
  };

  return (
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
          {contextHolder}
          <Bubble.List
            roles={roles}
            // style={{ maxHeight: 300 }}
            items={messages.map(({ id, message, status }, index) => ({
              key: id,
              loading: status === "loading",
              role: status === "local" ? "local" : "ai",
              content: message,
              header: "DeepSeek",
              footer: showFooter(id, status, index) && (
                <Space size={token.paddingXXS}>
                  <Tooltip title="重新生成答案">
                    <Button
                      color="default"
                      variant="text"
                      size="small"
                      icon={<SyncOutlined />}
                      // 添加点击事件处理函数，重新生成答案
                      onClick={() => {
                        const lastMessage = messages[messages.length - 1];
                        if (lastMessage && lastMessage.status === "success") {
                          const userMessage = messages.find(
                            (msg) => msg.status === "local"
                          );
                          // 删除原来的问答
                          messages.pop();

                          if (userMessage) {
                            onRequest(userMessage.message);
                          }
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="复制消息">
                    <Button
                      color="default"
                      variant="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyMessage(message)} // 添加点击事件处理函数
                    />
                  </Tooltip>
                  <Tooltip title="插入消息">
                    <Button
                      color="default"
                      variant="text"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => insertMessage(message)} // 添加插入消息功能
                    />
                  </Tooltip>
                  {/* 新增替换按钮 */}
                  <Tooltip title="替换消息">
                    <Button
                      color="default"
                      variant="text"
                      size="small"
                      icon={<DiffOutlined />} // 假设使用一个替换图标
                      onClick={() => replaceMessage(message)} // 点击触发替换操作
                    />
                  </Tooltip>
                </Space>
              ),
            }))}
          ></Bubble.List>
        </div>

        <Prompts> </Prompts>
        {/* 输入框 */}
        <Sender
          loading={agent.isRequesting()}
          value={content}
          onChange={setContent}
          onSubmit={onSubmit}
        ></Sender>
      </div>
    </>
  );
};

export default App;
