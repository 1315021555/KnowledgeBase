import {
  Attachments,
  Bubble,
  BubbleProps,
  Conversations,
  ConversationsProps,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import { createStyles } from "antd-style";
import React, { useCallback, useEffect } from "react";

import {
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  type GetProp,
  Input,
  message,
  Modal,
  Space,
  theme,
  Typography,
} from "antd";
import {
  createChatSession,
  deleteChatSession,
  getChatHistoryBySessionId,
  getSessionList,
  sessionChat,
  streamKnowledgeChat,
  streamRagChat,
  updateChatSession,
} from "@/service/api/chat";
import markdownit from "markdown-it";
import {
  ChatHistoryMessage,
  formatMessage,
} from "@/renderer/utils/formatMessage";

const md = markdownit({ html: true, breaks: true });

const renderMarkdown: BubbleProps["messageRender"] = (content) => (
  <Typography>
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const defaultConversationsItems = [
  {
    key: "0",
    label: "What is Ant Design X?",
  },
];

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 950px;
      height: 600px;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 200px;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    conversations: css`
      padding: 0 12px;
      flex: 1;
      overflow-y: auto;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
  };
});

const placeholderPromptsItems: GetProp<typeof Prompts, "items"> = [
  {
    key: "1",
    label: renderTitle(
      <FireOutlined style={{ color: "#FF4D4F" }} />,
      "Hot Topics"
    ),
    description: "What are you interested in?",
    children: [
      {
        key: "1-1",
        description: `What's new in X?`,
      },
      {
        key: "1-2",
        description: `What's AGI?`,
      },
      {
        key: "1-3",
        description: `Where is the doc?`,
      },
    ],
  },
  {
    key: "2",
    label: renderTitle(
      <ReadOutlined style={{ color: "#1890FF" }} />,
      "Design Guide"
    ),
    description: "How to design a good product?",
    children: [
      {
        key: "2-1",
        icon: <HeartOutlined />,
        description: `Know the well`,
      },
      {
        key: "2-2",
        icon: <SmileOutlined />,
        description: `Set the AI role`,
      },
      {
        key: "2-3",
        icon: <CommentOutlined />,
        description: `Express the feeling`,
      },
    ],
  },
];

const senderPromptsItems: GetProp<typeof Prompts, "items"> = [
  {
    key: "1",
    description: "Hot Topics",
    icon: <FireOutlined style={{ color: "#FF4D4F" }} />,
  },
  {
    key: "2",
    description: "Design Guide",
    icon: <ReadOutlined style={{ color: "#1890FF" }} />,
  },
];

const roles: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
    placement: "start",
    // typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: "end",
    variant: "shadow",
  },
};

const IndependentChat: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================

  const [headerOpen, setHeaderOpen] = React.useState(false);

  const [content, setContent] = React.useState("");

  const [conversationsItems, setConversationsItems] = React.useState(
    defaultConversationsItems
  );

  const [activeKey, setActiveKey] = React.useState(
    defaultConversationsItems[0].key
  );

  const activeKeyRef = React.useRef(activeKey);

  const [attachedFiles, setAttachedFiles] = React.useState<
    GetProp<typeof Attachments, "items">
  >([]);

  // 重命名
  const [renameModalVisible, setRenameModalVisible] = React.useState(false);
  const [editingConversation, setEditingConversation] = React.useState<{
    key: string;
    label: string;
  } | null>(null);
  const [newConversationName, setNewConversationName] = React.useState("");

  // 补全rename逻辑
  const handleRename = async () => {
    console.log(editingConversation, newConversationName);
    if (!editingConversation || !newConversationName.trim()) {
      message.warning("请输入有效的会话名称");
      return;
    }

    try {
      const updateRes = await updateChatSession(+editingConversation.key, {
        name: newConversationName.trim(),
      });

      if (updateRes) {
        setConversationsItems(
          conversationsItems.map((item) =>
            item.key === editingConversation.key
              ? { ...item, label: newConversationName.trim() }
              : item
          )
        );
        message.success("会话重命名成功");
        setRenameModalVisible(false);
      }
    } catch (error) {
      console.error("重命名失败:", error);
      message.error("重命名失败");
    }
  };

  const menuConfig: ConversationsProps["menu"] = (conversation) => ({
    items: [
      {
        label: "重命名",
        key: "rename",
        icon: <EditOutlined />,
      },
      {
        label: "删除",
        key: "delete",
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: async (menuInfo) => {
      console.log(menuInfo);
      const conversationKey = conversation?.key;
      switch (menuInfo.key) {
        case "rename":
          // 补全rename逻辑
          setEditingConversation(conversation as any); // 记录当前会话信息，用于更新NAM
          setNewConversationName((conversation?.label || "") as any);
          setRenameModalVisible(true); // 弹窗编辑
          break;
        case "delete":
          const deleteRes = (await deleteChatSession(+conversationKey)) as any;
          console.log("删除会话", deleteRes);
          if (deleteRes?.affected > 0) {
            setConversationsItems(
              conversationsItems.filter((item) => item.key !== conversationKey)
            );
            setActiveKey("0");
          }
          break;
      }
    },
  });

  useEffect(() => {
    // 获取会话列表
    const fetchSessionList = async () => {
      try {
        const res = await getSessionList();
        console.log("会话列表", res);
        if (Array.isArray(res) && res.length > 0) {
          setConversationsItems(
            res.map((item) => ({ key: item.id, label: item.name }))
          );
        }
      } catch (error) {
        console.error("获取会话列表失败:", error);
      }
    };
    fetchSessionList();
  }, []);

  useEffect(() => {
    activeKeyRef.current = activeKey;
    console.log("activeKeyRef.current", activeKeyRef.current);
    // 聊天记录更新
    const fetchChatHistory = async () => {
      const sessionHistory: ChatHistoryMessage[] =
        await getChatHistoryBySessionId(+activeKey);
      const messages = formatMessage(sessionHistory);
      if (messages.length > 0) {
        setMessages(messages); // 更新消息状态，触发重新渲染 Bubble
      }
      if (activeKey === "0") {
        setMessages([]); // 清空消息状态，触发重新渲染 Bubble
      }
      console.log("fetchChatHistory", sessionHistory, messages, activeKey);
    };
    fetchChatHistory();
  }, [activeKey]);

  // ==================== Runtime ====================
  const requestHandler = useCallback(
    async (
      { message }: { message: string },
      {
        onSuccess,
        onUpdate,
      }: {
        onSuccess: (message: string) => void;
        onUpdate: (message: string) => void;
      }
    ) => {
      if (!message) return;
      let curMsg = "";
      try {
        console.log("开始请求", activeKeyRef.current);
        // 调用 streamChat 方法，获取 EventSource
        const eventSource = await sessionChat({
          question: message,
          // TODO：暂时写1
          sessionId: +activeKeyRef.current,
          isRag: false,
        });

        // 监听消息事件
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data); // 解析流式数据
            console.log("收到消息:", data);
            curMsg += data.message;
            onUpdate(curMsg); // 调用 onUpdate 更新消息
          } catch (error) {
            console.error("解析消息失败:", error);
          }
        };

        // 监听错误事件
        eventSource.onerror = (error) => {
          console.error("流式响应错误或者结束:", error);
          eventSource.close(); // 关闭连接
          onSuccess(curMsg); // 通知 agent 流式响应已结束
        };
      } catch (error) {
        console.error("请求失败:", error);
        onSuccess("请求失败"); // 通知 agent 请求失败
      }
    },
    [activeKey] // 依赖 activeKey
  );

  const [agent] = useXAgent({
    request: requestHandler as any,
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  // ==================== Event ====================
  const onSubmit = async (nextContent: string) => {
    if (!nextContent) return;
    // 如果是新的会话，添加会话
    if (activeKey === "0") {
      // TODO: 这里可以根据问题生成会话名称
      const newSession: any = await addConversation(nextContent);
      console.log("newSession", newSession);
      setActiveKey(`${newSession.id}`);
    }
    onRequest(nextContent);
    setContent("");
  };

  const onPromptsItemClick: GetProp<typeof Prompts, "onItemClick"> = (info) => {
    onRequest(info.data.description as string);
  };

  const onAddConversation = async () => {
    setActiveKey("0");
    setMessages([]);
    // const newSession: any = await createChatSession({ name: "新的会话" });
    // console.log("newSession", newSession);
    // const key = newSession.id;
    // setConversationsItems([
    //   ...conversationsItems,
    //   {
    //     key: `${key}`,
    //     label: `New Conversation ${conversationsItems.length}`,
    //   },
    // ]);
    // setActiveKey(`${key}`);
  };

  const addConversation = async (name: string) => {
    const newSession: any = await createChatSession({ name });
    console.log("newSession", newSession);
    const key = newSession.id;
    // 添加列表
    setConversationsItems([
      {
        key: `${key}`,
        label: name,
      },
      ...conversationsItems,
    ]);
    // 切换会话
    setActiveKey(`${key}`);
    activeKeyRef.current = `${key}`;
    return newSession;
  };

  const onConversationClick: GetProp<typeof Conversations, "onActiveChange"> = (
    key
  ) => {
    setActiveKey(key);
  };

  const handleFileChange: GetProp<typeof Attachments, "onChange"> = (info) =>
    setAttachedFiles(info.fileList);

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />
      <Prompts
        title="Do you want?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: "100%",
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );
  const { token } = theme.useToken();

  const footer = (
    <Space size={token.paddingXXS}>
      <Button
        color="default"
        variant="text"
        size="small"
        icon={<SyncOutlined />}
      />
      <Button
        color="default"
        variant="text"
        size="small"
        icon={<CopyOutlined />}
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, "items"> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      // loading: status === "loading",
      role: status === "local" ? "local" : "ai",
      content: message,
      messageRender: renderMarkdown,
    })
  );

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        onClick={() => setHeaderOpen(!headerOpen)}
      />
    </Badge>
  );

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === "drop"
            ? { title: "Drop file here" }
            : {
                icon: <CloudUploadOutlined />,
                title: "Upload files",
                description: "Click or drag files to this area to upload",
              }
        }
      />
    </Sender.Header>
  );

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable={false}
        alt="logo"
      />
      <span>Ant Design X</span>
    </div>
  );

  const RenameModel = (
    <Modal
      title="重命名会话"
      open={renameModalVisible}
      onOk={handleRename}
      onCancel={() => setRenameModalVisible(false)}
      okText="确认"
      cancelText="取消"
    >
      <Input
        value={newConversationName}
        onChange={(e) => setNewConversationName(e.target.value)}
        placeholder="请输入新的会话名称"
        onPressEnter={handleRename}
      />
    </Modal>
  );

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      {RenameModel}
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        {logoNode}
        {/* 🌟 添加会话 */}
        <Button
          onClick={onAddConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          New Conversation
        </Button>
        {/* 🌟 会话管理 */}
        <Conversations
          items={conversationsItems}
          menu={menuConfig}
          className={styles.conversations}
          activeKey={activeKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <div className={styles.chat}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          items={
            items.length > 0
              ? items
              : [{ content: placeholderNode, variant: "borderless" }]
          }
          roles={roles}
          className={styles.messages}
        />
        {/* 🌟 提示词 */}
        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
        {/* 🌟 输入框 */}
        <Sender
          value={content}
          header={senderHeader}
          onSubmit={onSubmit}
          onChange={setContent}
          prefix={attachmentsNode}
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>
    </div>
  );
};

export default IndependentChat;
