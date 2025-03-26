import { createSlice } from "@reduxjs/toolkit";

// 定义 EmitType 类型
export const EmitType = {
  REPLACE: "REPLACE",
  INSERT: "INSERT",
};

// 定义 EmitType 类型的联合类型
type EmitTypeValue = (typeof EmitType)[keyof typeof EmitType];

// 定义 emitObjFromChat 的接口
export interface EmitObjFromChat {
  content: string;
  type: EmitTypeValue;
}

const editorSlice = createSlice({
  name: "editor",
  initialState: {
    /** chat来的内容 */
    emitObjFromChat: {
      content: "",
      type: EmitType.INSERT, // 可以根据实际情况初始化类型
    } as EmitObjFromChat,
  },
  reducers: {
    setEmitObjFromChat: (state, action) => {
      if (!action.payload) {
        return;
      }
      console.log("setEditor", action.payload);
      state.emitObjFromChat = action.payload;
    },
  },
});

export const { setEmitObjFromChat } = editorSlice.actions;
export default editorSlice.reducer;
