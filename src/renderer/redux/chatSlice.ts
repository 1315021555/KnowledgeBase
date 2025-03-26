import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    /** 当前选中的内容 */
    selectedText: "",
  },
  reducers: {
    setSelectedText: (state, action) => {
      if (action.payload == "") {
        return;
      }
      console.log("set setSelectedText", action.payload);
      state.selectedText = action.payload;
    },
  },
});

export const { setSelectedText } = chatSlice.actions;
export default chatSlice.reducer;
