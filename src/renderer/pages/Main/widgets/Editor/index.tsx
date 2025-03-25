import "@blocknote/react/style.css";
import "@blocknote/mantine/style.css";
import {
  getDirTree,
  getKnowledgeContentById,
  updateKnowledgeContentById,
} from "@/service/api/knowledage";
import { Box, Input } from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateBlockNote,
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { ExpendButton } from "./components/ExpendButton";
import { ModifyButton } from "./components/ModifyButton";
import {
  fetchAndUpdateTreeData,
  setCurKnowledgeContent,
  setCurKnowledgeSyncStatus,
  setCurrentPageIsEdit,
} from "@/renderer/redux/knowledgeSlice";
import { findPath } from "./utils";
import { debounce } from "@/common/utils";
import { useCallback } from "react";
import { useSetKnowledgeId } from "@/renderer/hooks/useSetKnowledgeId";
import { ConfigProvider, Flex, Progress } from "antd";
const Editor = () => {
  const selectedKnowledgeId = useSelector(
    (state: any) => state.knowledge.selectedId
  );
  const editor = useCreateBlockNote();
  const [title, setTitle] = useState<string>("defaultTitle");
  const currentKnowledgeSyncStatus = useSelector(
    (state: any) => state.knowledge.currentKnowledgeSyncStatus
  );
  const [progress, setProgress] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const treedata = useSelector((state: any) => state.knowledge.treeData);
  const dispatch = useDispatch();
  const setKnowledgeId = useSetKnowledgeId();
  const prevSelectedKnowledgeId = useRef<string | null>(null);

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      clearProgressTimer();
    };
  }, []);

  useEffect(() => {
    // 切换页面内容
    if (!selectedKnowledgeId) {
      return;
    }

    const fetchContent = async () => {
      const data = await getKnowledgeContentById(`${selectedKnowledgeId}`);
      console.log("获取内容成功:", data);
      setTitle(data?.title || "");
      const blocks = await editor.tryParseMarkdownToBlocks(data.content);
      editor.replaceBlocks(editor.document, blocks);
      // 设置同步状态为true
      dispatch(setCurKnowledgeSyncStatus(true));
      // 设置进度为100
      setProgress(100);
    };
    fetchContent();
  }, [selectedKnowledgeId]);

  // 使用 useCallback 确保每次调用时使用的是同一个防抖函数实例
  const debouncedAsyncContentChange = useCallback(
    debounce(
      (MarkdownFromBlocks: string) => asyncContentChange(MarkdownFromBlocks),
      2000
    ),
    [selectedKnowledgeId] // 依赖项数组为空
  );
  // 清除定时器
  const clearProgressTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  // 监听内容变化
  // 1. 页面切换 2. 编辑当前页面内容
  async function contentChangeHandler() {
    try {
      dispatch(setCurrentPageIsEdit(true));
      setProgress(0);
      // 清除之前的定时器，要用函数调用的方式
      clearProgressTimer();
      // 启动新定时器
      timer.current = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev)); // 更新进度
      }, 200);

      dispatch(setCurKnowledgeSyncStatus(false));
      const MarkdownFromBlocks = await editor.blocksToMarkdownLossy();
      if (MarkdownFromBlocks === null) {
        console.log("MarkdownFromBlocks is null");
        return;
      }

      console.log("change markdown", MarkdownFromBlocks);
      dispatch(setCurKnowledgeContent(MarkdownFromBlocks));
      // 如果是页面切换，跳过更新后端
      if (prevSelectedKnowledgeId.current !== selectedKnowledgeId) {
        console.log("页面切换，跳过更新后端");
        prevSelectedKnowledgeId.current = selectedKnowledgeId;
        dispatch(setCurrentPageIsEdit(false));
        return;
      }
      // 防抖更新后端
      debouncedAsyncContentChange(MarkdownFromBlocks);
    } catch (error) {
      console.log("Error getting Markdown from blocks:", error);
    }
  }

  function asyncContentChange(MarkdownFromBlocks: string) {
    updateKnowledgeContentById(`${selectedKnowledgeId}`, {
      content: MarkdownFromBlocks,
    })
      .then(() => {
        console.log(
          "更新后台内容成功",
          selectedKnowledgeId,
          MarkdownFromBlocks
        );
        dispatch(setCurKnowledgeSyncStatus(true));
        setProgress(100);
        clearProgressTimer();
      })
      .catch((error) => {
        console.log("更新后台内容失败", error);
        dispatch(setCurKnowledgeSyncStatus(false));
        clearProgressTimer();
      });
  }

  // 监听标题变化
  async function tilteChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const title = e.target.value;
      setTitle(title);
      updateKnowledgeContentById(`${selectedKnowledgeId}`, {
        title: title,
      }).then(() => {
        dispatch(fetchAndUpdateTreeData() as any);
        console.log("更新标题成功", selectedKnowledgeId);
        // 更新Tree
      });
    } catch (error) {
      console.log(error);
    }
  }

  // 监听面包屑目录变化
  const handleBreadcrumbClick = (pathPart: any) => {
    console.log("点击面包屑目录", pathPart);
    // dispatch(setSelectedId(pathPart.id));
    setKnowledgeId(pathPart.id);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={4}
        bg="white"
        w={"100%"}
        // h={10}
        position={"sticky"}
        top={0}
        zIndex={1000}
      >
        {/* 面包屑目录 */}
        <Box
          display="flex"
          alignItems="center"
          color="gray.500" // 设置面包屑文字颜色
        >
          {findPath(treedata, selectedKnowledgeId).map(
            (pathPart: any, index) => (
              <Fragment key={index}>
                {index > 0 && "  /  "}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "gray.500",
                    cursor: "pointer",
                    padding: "5px",
                  }}
                  onClick={() => handleBreadcrumbClick(pathPart)}
                >
                  {pathPart.title}
                </button>
              </Fragment>
            )
          )}
          {/* 新增同步状态标识 */}
          <Flex
            align="center"
            gap="small"
            style={{
              marginLeft: "10px",
            }}
          >
            <ConfigProvider
              theme={{
                components: {
                  Progress: {
                    /* 这里是你的组件 token */
                    circleIconFontSize: "1.2em",
                  },
                },
              }}
            >
              <Progress
                type="dashboard"
                trailColor="#e6f4ff"
                percent={progress}
                gapDegree={0}
                // strokeWidth={20}
                strokeWidth={8}
                size={22}
              />
              <span>{progress === 100 ? "已自动同步" : `同步中`}</span>
            </ConfigProvider>
          </Flex>
        </Box>
      </Box>
      <Box mt={0}>
        {/* 标题 */}
        <Box ml={50}>
          <Input
            variant="unstyled"
            fontSize="3xl"
            fontWeight="bold"
            placeholder="请输入标题"
            _placeholder={{ opacity: 0.5, color: "gray.500" }}
            value={title}
            // Add onChange handler
            onChange={tilteChangeHandler}
          />
        </Box>
        <Box mt={5}>
          <BlockNoteView
            editor={editor}
            formattingToolbar={false}
            // onChange={debounce(contentChangeHandler, 2000)}
            onChange={contentChangeHandler}
          >
            <FormattingToolbarController
              formattingToolbar={() => (
                <FormattingToolbar>
                  <BlockTypeSelect key={"blockTypeSelect"} />

                  {/* Extra button to toggle blue text & background */}
                  <ExpendButton key={"customButton"} />
                  <ModifyButton key={"modifyButton"} />
                  {/* <ImageCaptionButton key={"imageCaptionButton"} />
            <ReplaceImageButton key={"replaceImageButton"} /> */}

                  <BasicTextStyleButton
                    basicTextStyle={"bold"}
                    key={"boldStyleButton"}
                  />
                  <BasicTextStyleButton
                    basicTextStyle={"italic"}
                    key={"italicStyleButton"}
                  />
                  <BasicTextStyleButton
                    basicTextStyle={"underline"}
                    key={"underlineStyleButton"}
                  />
                  <BasicTextStyleButton
                    basicTextStyle={"strike"}
                    key={"strikeStyleButton"}
                  />
                  {/* Extra button to toggle code styles */}
                  <BasicTextStyleButton
                    key={"codeStyleButton"}
                    basicTextStyle={"code"}
                  />

                  <TextAlignButton
                    textAlignment={"left"}
                    key={"textAlignLeftButton"}
                  />
                  <TextAlignButton
                    textAlignment={"center"}
                    key={"textAlignCenterButton"}
                  />
                  <TextAlignButton
                    textAlignment={"right"}
                    key={"textAlignRightButton"}
                  />

                  <ColorStyleButton key={"colorStyleButton"} />

                  <NestBlockButton key={"nestBlockButton"} />
                  <UnnestBlockButton key={"unnestBlockButton"} />

                  <CreateLinkButton key={"createLinkButton"} />
                </FormattingToolbar>
              )}
            />
          </BlockNoteView>
        </Box>
      </Box>
    </>
  );
};

export default Editor;
