import { setSelectedText } from "@/renderer/redux/chatSlice";
import { useBlockNoteEditor, useComponentsContext } from "@blocknote/react";
import { useDispatch } from "react-redux";
import { Popover, Input, Form, Button, Space, message } from "antd";
import { useState } from "react";

const QUICK_ACTIONS = [
  { label: "扩写", value: "扩写这段内容" },
  { label: "总结", value: "总结这段内容" },
  { label: "翻译", value: "翻译成英文" },
  { label: "优化", value: "优化这段文字" },
  { label: "解释", value: "解释这段内容" },
];

export function AskAIButton() {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const showPopover = () => {
    const text = editor.getSelectedText();
    if (!text.trim()) {
      message.warning("请先选中一些文本");
      return;
    }
    setOpen(true);
  };

  const handleQuickAction = (action: string) => {
    const text = editor.getSelectedText();
    dispatch(setSelectedText(`${action}: ${text}`));
    setOpen(false);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const text = editor.getSelectedText();
      dispatch(setSelectedText(`${values.question}: ${text}`));
      setOpen(false);
      form.resetFields();
    });
  };

  const popoverContent = (
    <div style={{ width: 280 }}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="question"
          label="你想让AI做什么？"
          rules={[{ message: "请输入指令" }]}
        >
          <Input placeholder="例如：扩写、总结、翻译等" />
        </Form.Item>

        <div style={{ marginBottom: 12 }}>
          <p style={{ marginBottom: 8, fontSize: 13, color: "#666" }}>
            快捷操作：
          </p>
          <Space wrap>
            {QUICK_ACTIONS.map((action) => (
              <Button
                key={action.value}
                size="small"
                onClick={() => handleQuickAction(action.value)}
              >
                {action.label}
              </Button>
            ))}
          </Space>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button size="small" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button size="small" type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </div>
      </Form>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottom"
      overlayStyle={{ paddingTop: 4 }}
      destroyTooltipOnHide
    >
      <Components.FormattingToolbar.Button
        mainTooltip={"问问AI关于这段文本的问题"}
        onClick={showPopover}
      >
        AskAI
      </Components.FormattingToolbar.Button>
    </Popover>
  );
}
