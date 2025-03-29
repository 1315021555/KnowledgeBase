import React, { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
import { Popover, Typography, Spin, Tooltip, Badge } from "antd";
import { getKnowledgeContentById } from "@/service/api/knowledage";
import { useSetKnowledgeId } from "../hooks/useSetKnowledgeId";
import { useNavigate } from "react-router-dom";

// 模拟异步获取引用内容
const getReferencePreview = async (id: string) => {
  return await getKnowledgeContentById(id);
};

const { Text, Paragraph } = Typography;

interface PreviewData {
  title: string;
  content: string;
}

const referencePattern = /\{\{来源id:\d+\}\}/g; // 匹配 {{来源id:xxx}} 格式的引用

const ReferencePreview = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PreviewData | null>(null);

  React.useEffect(() => {
    getReferencePreview(id).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Spin size="small" />;

  return (
    <Tooltip>
      <div style={{ maxWidth: 250, cursor: "pointer" }}>
        <Paragraph
          strong
          ellipsis={{ rows: 1 }}
          style={{ marginBottom: 4, fontSize: 14 }}
        >
          {data?.title}
        </Paragraph>
        <Paragraph
          type="secondary"
          ellipsis={{ rows: 2 }}
          style={{ margin: 0, fontSize: 12 }}
        >
          {data?.content}
        </Paragraph>
      </div>
    </Tooltip>
  );
};

// 1️⃣ **先用 markdown-it 解析 Markdown，输出 HTML**
const md = new MarkdownIt();
const renderMarkdown = (content: string) => md.render(content);

// 2️⃣ **在 React 组件里，把 `[[来源id:xxx]]` 转换成 `Popover`**
export const MarkdownRenderer = ({ content }: { content: string }) => {
  const html = renderMarkdown(content);
  const setKnowledgeId = useSetKnowledgeId();
  const navigate = useNavigate();

  // ✅ 每次 `content` 变化时，重新计算引用编号
  const referenceNumbers = React.useMemo(() => {
    let count = 1;
    const referenceMap = new Map<string, number>();

    // 遍历 `content` 中的 `[[来源id:xxx]]`，按顺序编号
    (content.match(referencePattern) || []).forEach((match) => {
      if (!referenceMap.has(match)) {
        referenceMap.set(match, count++);
      }
    });

    return referenceMap;
  }, [content]);

  return (
    <Typography>
      {html.split(/(\{\{来源id:\d+\}\})/g).map((part, index) => {
        const match = part.match(/\{\{来源id:(\d+)\}\}/); // ❌ 不要加 `/g`
        if (match) {
          const id = match[1]; // ✅ 提取 ID
          console.log("match", match);

          const referenceNumber = referenceNumbers.get(match[0]) || 1; // ✅ 获取编号

          return (
            <Popover
              key={index}
              content={<ReferencePreview id={id} />}
              trigger="hover"
            >
              <Text
                underline
                style={{ color: "#1890ff", cursor: "pointer" }}
                onClick={() => {
                  console.log("点击了引用", id);
                  navigate(`/knowledge`);
                  setKnowledgeId(id);
                }}
              >
                <Badge count={referenceNumber} color="grey" size="small" />
              </Text>
            </Popover>
          );
        }

        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </Typography>
  );
};
