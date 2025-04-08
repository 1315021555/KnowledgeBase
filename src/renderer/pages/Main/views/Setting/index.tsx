import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Select,
  VStack,
  HStack,
  Divider,
  Heading,
  Badge,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { AppConfig, DEFAULT_CONFIG } from "@/renderer/hooks/useAppConfig";
import { FiInfo } from "react-icons/fi";

interface SettingSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  description,
  children,
}) => (
  <Box mb={8}>
    <VStack align="stretch" spacing={2}>
      <Heading as="h3" size="md" fontWeight="semibold">
        {title}
      </Heading>
      {description && (
        <Text color="gray.500" fontSize="sm">
          {description}
        </Text>
      )}
      <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
        {children}
      </Box>
    </VStack>
  </Box>
);

const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const toast = useToast();

  // 从本地存储加载配置
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem("appConfig");
        if (savedConfig) {
          setConfig(JSON.parse(savedConfig));
        }
      } catch (error) {
        console.error("Failed to load config:", error);
      }
    };

    loadConfig();
  }, []);

  // 保存配置到本地存储
  const saveConfig = async (newConfig: AppConfig) => {
    setIsLoading(true);
    try {
      localStorage.setItem("appConfig", JSON.stringify(newConfig));
      setConfig(newConfig);
      setIsDirty(false);
      toast({
        title: "设置已保存",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to save config:", error);
      toast({
        title: "保存失败",
        description: "无法保存设置到本地存储",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = <T extends keyof AppConfig>(
    key: T,
    value: AppConfig[T]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
    setIsDirty(true);
  };

  return (
    <Box p={8} maxW="800px" mx="auto">
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading as="h2" size="xl" fontWeight="bold" mb={2}>
            应用设置
          </Heading>
          <Text color="gray.500">自定义您的应用体验</Text>
        </Box>

        <Divider />

        <SettingSection title="问答设置" description="配置问答系统的行为方式">
          <VStack align="stretch" spacing={6}>
            <FormControl display="flex" alignItems="center">
              <Switch
                id="use-knowledge-base"
                isChecked={config.useKnowledgeBase}
                onChange={(e) =>
                  handleConfigChange("useKnowledgeBase", e.target.checked)
                }
                colorScheme="teal"
                size="lg"
              />
              <FormLabel htmlFor="use-knowledge-base" ml={4} mb={0}>
                <HStack>
                  <Text>基于知识库内容</Text>
                  <Tooltip
                    label="启用后，问答将优先使用知识库中的内容作为回答依据"
                    placement="top"
                    hasArrow
                  >
                    <Box>
                      <Icon as={FiInfo} color="gray.400" />
                    </Box>
                  </Tooltip>
                </HStack>
              </FormLabel>
            </FormControl>

            <FormControl>
              <FormLabel>
                <HStack>
                  <Text>默认模型</Text>
                  <Tooltip
                    label="选择系统默认使用的AI模型"
                    placement="top"
                    hasArrow
                  >
                    <Box>
                      <Icon as={FiInfo} color="gray.400" />
                    </Box>
                  </Tooltip>
                </HStack>
              </FormLabel>
              <Select
                value={config.defaultModel}
                onChange={(e) =>
                  handleConfigChange("defaultModel", e.target.value)
                }
                placeholder="选择模型"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-2">Claude 2</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>
                <HStack>
                  <Text>回答风格</Text>
                  <Tooltip
                    label="控制回答的详细程度和风格"
                    placement="top"
                    hasArrow
                  >
                    <Box>
                      <Icon as={FiInfo} color="gray.400" />
                    </Box>
                  </Tooltip>
                </HStack>
              </FormLabel>
              <Select
                value={config.responseStyle}
                onChange={(e) =>
                  handleConfigChange(
                    "responseStyle",
                    e.target.value as "concise" | "detailed"
                  )
                }
              >
                <option value="concise">简洁</option>
                <option value="detailed">详细</option>
              </Select>
            </FormControl>
          </VStack>
        </SettingSection>

        <SettingSection title="高级设置" description="配置应用的高级功能">
          <VStack align="stretch" spacing={6}>
            <FormControl display="flex" alignItems="center">
              <Switch
                id="enable-history"
                isChecked={config.enableHistory}
                onChange={(e) =>
                  handleConfigChange("enableHistory", e.target.checked)
                }
                colorScheme="teal"
                size="lg"
              />
              <FormLabel htmlFor="enable-history" ml={4} mb={0}>
                <HStack>
                  <Text>启用对话历史</Text>
                  <Tooltip
                    label="启用后，系统会保存您的对话历史以便后续参考"
                    placement="top"
                    hasArrow
                  >
                    <Box>
                      <Icon as={FiInfo} color="gray.400" />
                    </Box>
                  </Tooltip>
                </HStack>
              </FormLabel>
            </FormControl>

            <FormControl>
              <FormLabel>
                <HStack>
                  <Text>最大历史记录</Text>
                  <Tooltip
                    label="设置系统保留的最大对话历史数量"
                    placement="top"
                    hasArrow
                  >
                    <Box>
                      <Icon as={FiInfo} color="gray.400" />
                    </Box>
                  </Tooltip>
                </HStack>
              </FormLabel>
              <Select
                value={config.maxHistory}
                onChange={(e) =>
                  handleConfigChange("maxHistory", parseInt(e.target.value))
                }
              >
                <option value="5">5 条</option>
                <option value="10">10 条</option>
                <option value="20">20 条</option>
                <option value="50">50 条</option>
              </Select>
            </FormControl>
          </VStack>
        </SettingSection>

        <Box
          position="sticky"
          bottom={0}
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="md"
          zIndex={1}
        >
          <HStack justify="space-between">
            <Box>
              {isDirty && (
                <Badge colorScheme="orange" variant="subtle">
                  未保存的更改
                </Badge>
              )}
            </Box>
            <HStack>
              <Button
                variant="outline"
                onClick={resetToDefault}
                isLoading={isLoading}
              >
                恢复默认
              </Button>
              <Button
                colorScheme="teal"
                onClick={() => saveConfig(config)}
                isLoading={isLoading}
                isDisabled={!isDirty}
              >
                保存设置
              </Button>
            </HStack>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default SettingsPage;
