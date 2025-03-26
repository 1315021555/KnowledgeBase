import { setSelectedText } from "@/renderer/redux/chatSlice";
import {
  useBlockNoteEditor,
  useComponentsContext,
  // useEditorContentOrSelectionChange,
} from "@blocknote/react";
// import '@blocknote/mantine/style.css'
// import { useState } from 'react'
// import { setSelectedText } from "../../../../redux/chat";
import { useDispatch } from "react-redux";

// Custom Formatting Toolbar Button to toggle blue text & background color.
export function ExpendButton() {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;
  const dispatch = useDispatch();

  return (
    // eslint-disable-next-line
    <Components.FormattingToolbar.Button
      mainTooltip={"扩写选中文本"}
      onClick={() => {
        const selectedText = editor.getSelectedText();
        // console.log("selectedText", selectedText);
        dispatch(setSelectedText("扩写: " + selectedText));
        // editor.toggleStyles({
        //   textColor: "blue",
        //   backgroundColor: "blue",
        // });
      }}
      // isSelected={isSelected}
    >
      扩写
    </Components.FormattingToolbar.Button>
  );
}
