import React, { useEffect, useMemo } from "react";
import {
  CopyOutlined,
  DiffOutlined,
  PlusOutlined,
  SyncOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  GetProp,
  message,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import {
  Bubble,
  BubbleProps,
  Prompts,
  Sender,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import { RiAiGenerate2 } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { EmitType, setEmitObjFromChat } from "@/renderer/redux/editorSlice";
import { Tooltip } from "antd"; // 引入 Tooltip 组件
import {
  getChatHistoryByKnowledgeId,
  streamKnowledgeChat,
} from "@/service/api/chat";
import markdownit from "markdown-it";
import { DefaultMessageInfo, MessageInfo } from "@ant-design/x/es/use-x-chat";
import { formatMessage } from "@/renderer/utils/formatMessage";

const defaultMessages: DefaultMessageInfo<string>[] = [
  {
    id: "init",
    message: "你好,请问有什么可以帮您的？",
    status: "success",
  },
];

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
const md = markdownit({ html: true, breaks: true });

const renderMarkdown: BubbleProps["messageRender"] = (content) => (
  <Typography>
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);

const App: React.FC = () => {
  // 代理请求
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onUpdate, onError }) => {
      if (!message) return;
      let curMsg = "";
      try {
        console.log("请求消息:", message);
        setLoading(true);
        const eventSource = await streamKnowledgeChat({
          question: message,
          knowledgeId: selectedKnowledgeId,
        });
        // 监听消息事件
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data); // 解析流式数据
            console.log("收到消息:", data);
            curMsg += data.message;
            setLoading(false);
            setFinished(false);
            onUpdate(curMsg); // 调用 onUpdate 更新消息
          } catch (error) {
            console.error("解析消息失败:", error);
          }
        };

        // 监听错误事件
        eventSource.onerror = (error) => {
          console.error("流式响应错误或者结束:", error);
          setFinished(true);
          eventSource.close(); // 关闭连接
          onSuccess(curMsg); // 通知 agent 流式响应已结束
        };
        // await sleep();
      } catch (error) {
        onError(new Error("Mock request failed"));
        console.error("请求失败:", error);
      }
    },
  });

  // 数据管理
  const { onRequest, messages } = useXChat({
    agent,
    defaultMessages: defaultMessages,
    requestPlaceholder: "请输入您的问题",
    requestFallback: "请求失败，请稍后再试",
  });

  // 聊天记录相关
  const selectedKnowledgeId = useSelector(
    (state: any) => state.knowledge.selectedId
  );
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(false);
  const [chatHistory, setChatHistory] = React.useState<any[]>([]);
  const chatHistoryMessages: MessageInfo<string>[] | null = useMemo(() => {
    const res = formatMessage(chatHistory);
    if (res.length > 0) {
      // 清空message
      messages.splice(0, messages.length);
      messages.push(...res);
    } else {
      messages.splice(0, messages.length);
      messages.push(...(defaultMessages as any));
    }
    console.log("历史记录", res);
    return res;
  }, [chatHistory]);
  useEffect(() => {
    console.log("当前Messages", messages);
    const fetchData = async () => {
      setIsLoadingHistory(true);
      const chatHistory: any = await getChatHistoryByKnowledgeId(
        selectedKnowledgeId
      );

      console.log("chatHistory", chatHistory);
      setChatHistory(chatHistory);
      setIsLoadingHistory(false);
    };
    fetchData();
  }, [selectedKnowledgeId]);
  const selectedText = useSelector((state: any) => state.chat.selectedText);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!selectedText) return;
    onSubmit(selectedText);
  }, [selectedText]);
  const [content, setContent] = React.useState<string>("");

  // UI
  const [loading, setLoading] = React.useState(false);
  const [isFinished, setFinished] = React.useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const showFooter = (id: string | number, status: string, index: number) => {
    const isLast = index === messages.length - 1;
    if (isLast) {
      const isInit = id === "init";
      return isFinished && !loading && !isInit;
    }
    const isInit = id === "init";
    const isLocal = status === "local";

    return !isInit && !isLocal;
  };

  // handler
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
          {isLoadingHistory ? (
            <Skeleton />
          ) : (
            <Bubble.List
              roles={roles}
              // style={{ maxHeight: 300 }}
              items={messages.map(({ id, message, status }, index) => ({
                key: id,
                loading: status === "loading" && loading,
                role: status === "local" ? "local" : "ai",
                content: message,
                header: status === "local" ? "" : "DeepSeek",
                messageRender: renderMarkdown,
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
          )}
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
