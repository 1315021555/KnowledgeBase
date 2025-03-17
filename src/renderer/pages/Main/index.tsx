import BlockNote from "@/renderer/components/blocknote";
import MySidebar from "./widgets/Sidebar";

import { Box } from "@chakra-ui/react";
import { AppShell } from "@saas-ui/react";
import { Outlet } from "react-router-dom";
export default function Page() {
  return (
    <AppShell sidebar={MySidebar()}>
      {/* 右侧内容 */}
      <Box p={5}>
        {/* 二级路由出口 */}
        <Outlet></Outlet>
      </Box>
    </AppShell>
  );
}
