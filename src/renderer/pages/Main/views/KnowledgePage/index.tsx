import React from "react";
import { Flex, Splitter, Typography } from "antd";
import type { SplitterProps } from "antd";
import Editor from "../../widgets/Editor";
import IndependentChat from "../AIChat";
import ChatApp from "../../widgets/SiderChat";

const CustomSplitter: React.FC<Readonly<SplitterProps>> = ({
  style,
  ...restProps
}) => (
  <Splitter style={{ ...style }} {...restProps}>
    <Splitter.Panel collapsible min="55%" max="70%">
      <Editor></Editor>
    </Splitter.Panel>
    <Splitter.Panel collapsible>
      <ChatApp></ChatApp>
    </Splitter.Panel>
  </Splitter>
);

const KnowledgePage: React.FC = () => (
  <Flex gap="middle" vertical>
    <CustomSplitter style={{ height: "96vh" }} />
  </Flex>
);

export default KnowledgePage;
