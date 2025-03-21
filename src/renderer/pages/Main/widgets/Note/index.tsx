import "@blocknote/react/style.css";
import "@blocknote/mantine/style.css";
import {
  getKnowledgeContentById,
  updateKnowledgeContentById,
} from "@/service/api/knowledage";
import { Box, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
const Note = () => {
  const selectedKnowledgeId = useSelector(
    (state: any) => state.knowledge.selectedId
  );
  const editor = useCreateBlockNote();
  const [content, setContent] = useState<string>("defaultContent");
  const [title, setTitle] = useState<string>("defaultTitle");
  useEffect(() => {
    // 初始化页面内容
    async function loadInitialHTML() {
      const blocks = await editor.tryParseHTMLToBlocks(content);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [content]);
  useEffect(() => {
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
      }).then(() => {
        console.log("更新内容成功", selectedKnowledgeId);
      });
      // UpdatePageContent(curPageId, HTMLFromBlocks).then(() => {
      //   console.log("更新page内容", curPageId);
      // });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={4}
        bg="gray.100"
        // 高度
        w={"100%"}
        h={10}
      >
        字数：{content.length}
      </Box>
      <Box mt={10}>
        {/* 添加一个标题 */}
        <Box ml={50}>
          <Input
            variant="unstyled"
            fontSize="3xl"
            fontWeight="bold"
            placeholder="请输入标题"
            _placeholder={{ opacity: 0.5, color: "gray.500" }}
            value={title}
            // Add onChange handler
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>
        <Box mt={3}>
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
