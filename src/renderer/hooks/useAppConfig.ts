import { useEffect, useState } from "react";

export interface AppConfig {
  // 问答设置
  useKnowledgeBase: boolean;
  defaultModel: string;
  responseStyle: "concise" | "detailed";

  // 高级设置
  enableHistory: boolean;
  maxHistory: number;
}

export const DEFAULT_CONFIG: AppConfig = {
  useKnowledgeBase: true,
  defaultModel: "gpt-4",
  responseStyle: "detailed",
  enableHistory: true,
  maxHistory: 10,
};
// 获取配置的hook
export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const savedConfig = localStorage.getItem("appConfig");
    if (savedConfig) {
      console.log("savedConfig", savedConfig); // 这里的savedConfig是一个字符串，需要使用JSON.parse解析为对象，否则会报错：TypeError: Cannot convert object to primitive value
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  return config;
}
