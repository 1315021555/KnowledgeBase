import { createSlice } from "@reduxjs/toolkit";

const siderBar = createSlice({
  name: "siderBar",
  initialState: {
    /** 当前选中item的index */
    activeNavItemIndex: 0,
  },
  reducers: {
    setActiveNavItemIndex(state, action) {
      console.log("setActiveNavItemIndex", action.payload);
      state.activeNavItemIndex = action.payload;
    },
  },
});

export const { setActiveNavItemIndex } = siderBar.actions;
export default siderBar.reducer;
