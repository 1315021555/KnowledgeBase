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
  NavGroup,
} from "@saas-ui/react";
import { FiHome, FiActivity, FiBook, FiSettings } from "react-icons/fi";
import { RiAiGenerate2 } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import DirTree from "../DirTree";
import { useDispatch, useSelector } from "react-redux";
import { setActiveNavItemIndex } from "@/renderer/redux/siderBar";

const SidebarComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeNavItemIndex = useSelector(
    (state: any) => state.siderBar.activeNavItemIndex
  );
  // const [activeNavItemIndex, setactiveNavItemIndex] = useState<number>(0);
  const navItems = [
    { label: "Home", icon: <FiHome />, path: "/" },
    { label: "AI", icon: <RiAiGenerate2 />, path: "/chat" },
    { label: "设置", icon: <FiSettings />, path: "/" }, // 假设的路径，根据实际情况修改
  ];

  const handleNavItemClick = (index: number, path: string) => {
    dispatch(setActiveNavItemIndex(index));
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
            isActive={index === activeNavItemIndex}
            onClick={() => handleNavItemClick(index, item.path)}
          >
            {item.label}
          </NavItem>
        ))}

        <NavGroup title="知识库" isCollapsible>
          {/* 树形结构 */}
          <DirTree></DirTree>
        </NavGroup>
        {/* <NavItem icon={<FiSettings />}>Settings</NavItem> */}
      </SidebarSection>
    </Sidebar>
  );
};

export default SidebarComponent;
