import React, { useState } from "react";
import {
  Image,
  Spacer,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"; // 请替换为实际使用的UI库

import {
  Sidebar,
  SidebarSection,
  NavItem,
  PersonaAvatar,
  SidebarToggleButton,
} from "@saas-ui/react";
import { FiHome, FiActivity, FiBook } from "react-icons/fi";
import { RiAiGenerate2 } from "react-icons/ri";
import MyTree from "@/renderer/components/tree"; // 请确保路径正确
import { useNavigate } from "react-router-dom";
import DirTree from "../DirTree";

const SidebarComponent = () => {
  const [activeNavItem, setActiveNavItem] = useState<number>(0);
  const navigate = useNavigate();
  const navItems = [
    { label: "Home", icon: <FiHome />, path: "/" },
    { label: "AI", icon: <RiAiGenerate2 />, path: "/chat" },
    { label: "知识库", icon: <FiBook />, path: "/knowledge" }, // 假设的路径，根据实际情况修改
  ];

  const handleNavItemClick = (index: number, path: string) => {
    setActiveNavItem(index);
    // 这里可以添加路由跳转逻辑，例如使用 useNavigate 钩子
    navigate(path);
  };

  return (
    <Sidebar toggleBreakpoint="sm">
      <SidebarToggleButton />
      <SidebarSection direction="row">
        <Image
          src="https://saas-ui.dev/favicons/favicon-96x96.png"
          boxSize="7"
        />
        <Spacer />
        <Menu>
          <MenuButton
            as={IconButton}
            icon={
              <PersonaAvatar
                presence="online"
                size="xs"
                src="/showcase-avatar.jpg"
              />
            }
            variant="ghost"
          />
          <MenuList>
            <MenuItem>Sign out</MenuItem>
          </MenuList>
        </Menu>
      </SidebarSection>
      <SidebarSection aria-label="Main">
        {navItems.map((item, index) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            isActive={index === activeNavItem}
            onClick={() => handleNavItemClick(index, item.path)}
          >
            {item.label}
          </NavItem>
        ))}
        {/* 树形结构 */}
        <DirTree></DirTree>
        {/* <NavItem icon={<FiSettings />}>Settings</NavItem> */}
      </SidebarSection>
    </Sidebar>
  );
};

export default SidebarComponent;
