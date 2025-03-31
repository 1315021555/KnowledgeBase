import React, { useEffect, useMemo, useState } from "react";
import { Box, Text, HStack } from "@chakra-ui/react";
import { Card, Input, List } from "antd";
import {
  getRecentlyAccessedKnowledge,
  searchKnowledge,
} from "@/service/api/knowledage";
import { formatWithWeekday } from "@/renderer/utils/formatDateTime";
import { useNavigate } from "react-router-dom";
import { useSetKnowledgeId } from "@/renderer/hooks/useSetKnowledgeId";
import { AutoComplete } from "antd";
import debounce from "lodash.debounce";

const MAX_RECENT_ITEMS = 10;

const App = React.memo(function App() {
  const [recentlyVisited, setRecentlyVisited] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setKnowledgeId = useSetKnowledgeId();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchRecentVisited = async () => {
      try {
        const res = await getRecentlyAccessedKnowledge();
        setRecentlyVisited(res || []);
      } catch (error) {
        console.error("获取最近访问失败：", error);
      }
    };
    fetchRecentVisited();
  }, []);

  // 添加防抖函数
  const debouncedSearch = useMemo(() => {
    const search = async (value: string) => {
      if (!value) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await searchKnowledge(value);
        setSearchResults(
          res?.length
            ? res
            : [
                {
                  title: "无匹配结果",
                  id: "no-results",
                },
              ]
        );
      } catch (error) {
        setSearchResults([
          {
            title: "搜索服务不可用",
            id: "service-error",
          },
        ]);
        console.error("搜索失败：", error);
      } finally {
        setLoading(false);
      }
    };
    return debounce(search, 300);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <Box p={8} bg="white" minH="100vh">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Good evening, ZhiChao Lin
      </Text>

      {/* 搜索框 */}
      {/* 替换原来的Search组件 */}
      <AutoComplete
        dropdownStyle={{ marginTop: 16 }}
        value={searchValue}
        options={searchResults.map((item) => ({
          value: item.title,
          label: item.title,
          id: item.id,
          disabled: item.id === "no-results" || item.id === "service-error", // 禁用无效选项
        }))}
        onChange={handleSearchChange}
        onSelect={(value, option) => {
          // 如果是无效选项，不执行导航
          if (option.id === "no-results" || option.id === "service-error") {
            return;
          }
          setKnowledgeId(option.id);
          navigate(`/knowledge`);
        }}
        placeholder="搜索知识库..."
        style={{ width: 400, marginBottom: 16 }}
      >
        <Input.Search enterButton="搜索" size="large" loading={loading} />
      </AutoComplete>

      <Text fontSize="lg" fontWeight="semibold" m={4}>
        Recently visited{" "}
        {recentlyVisited.length > MAX_RECENT_ITEMS &&
          `(显示最新 ${MAX_RECENT_ITEMS} 条)`}
      </Text>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 3,
        }}
        dataSource={recentlyVisited}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={item.title}
              // 可点击
              style={{ cursor: "pointer" }}
              onClick={() => {
                setKnowledgeId(item.id);
                navigate(`/knowledge`);
              }}
            >
              {formatWithWeekday(item.lastAccessedAt)}
            </Card>
          </List.Item>
        )}
      />
    </Box>
  );
});

export default App;
