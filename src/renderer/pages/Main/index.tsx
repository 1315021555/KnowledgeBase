import MySidebar from "./widgets/Sidebar";
import { Box } from "@chakra-ui/react";
import { AppShell } from "@saas-ui/react";
import { Outlet } from "react-router-dom";

export default function MainPage() {
  return (
    <AppShell sidebar={MySidebar()} h={"100vh"} overflow={"hidden"}>
      {/* 右侧内容 */}
      {/* 修改 Box 的背景颜色为灰色 */}
      <Box h="100%" padding={3}>
        {/* 二级路由出口 */}
        <Outlet></Outlet>
      </Box>
    </AppShell>
  );
}
