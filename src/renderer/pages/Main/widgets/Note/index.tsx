import BlockNote from "@/renderer/components/blocknote";
import { Box, Input } from "@chakra-ui/react";

const Note = () => {
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
        字数：xxxx
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
          />
        </Box>
        <Box mt={3}>
          <BlockNote></BlockNote>
        </Box>
      </Box>
    </>
  );
};

export default Note;
