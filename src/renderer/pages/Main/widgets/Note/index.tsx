import "@blocknote/react/style.css";
import "@blocknote/mantine/style.css";
import {
  getDirTree,
  getKnowledgeContentById,
  updateKnowledgeContentById,
} from "@/service/api/knowledage";
import { Box, Input } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
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
  setSelectedId,
} from "@/renderer/redux/knowledgeSlice";
import { findPath } from "./utils";
import { Breadcrumb } from "antd";
const Note = () => {
  const selectedKnowledgeId = useSelector(
    (state: any) => state.knowledge.selectedId
  );
  const editor = useCreateBlockNote();
  const [content, setContent] = useState<string>("defaultContent");
  const [title, setTitle] = useState<string>("defaultTitle");
  const treedata = useSelector((state: any) => state.knowledge.treeData);
  const dispatch = useDispatch();
  useEffect(() => {
    // 初始化页面内容
    async function loadInitialHTML() {
      const blocks = await editor.tryParseHTMLToBlocks(content);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [content]);

  useEffect(() => {
    // 切换页面内容
    if (!selectedKnowledgeId) {
      return;
    }
    const fetchContent = async () => {
      const data = await getKnowledgeContentById(`${selectedKnowledgeId}`);
      console.log("获取内容成功:", data);
      setContent(data?.content || "");
      setTitle(data?.title || "");
    };
    fetchContent();
  }, [selectedKnowledgeId]);

  // 监听内容变化
  async function contentChangeHandler() {
    try {
      // if (!isLogin) return;
      const HTMLFromBlocks = await editor.blocksToHTMLLossy();
      // dispatch(setActivePageContent(HTMLFromBlocks));
      console.log("change html", HTMLFromBlocks);
      updateKnowledgeContentById(`${selectedKnowledgeId}`, {
        content: HTMLFromBlocks,
      }).then(() => {});
      console.log("更新内容成功", selectedKnowledgeId);
      // UpdatePageContent(curPageId, HTMLFromBlocks).then(() => {
      //   console.log("更新page内容", curPageId);
      // });
    } catch (error) {
      console.log(error);
    }
  }

  // 监听标题变化
  async function tilteChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const title = e.target.value;
      // if (!isLogin) return;
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
    dispatch(setSelectedId(pathPart.id));
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={4}
        bg="white"
        // 高度
        w={"100%"}
        h={20}
        pos={"fixed"}
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
        </Box>
      </Box>
      <Box mt={20}>
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

export default Note;
