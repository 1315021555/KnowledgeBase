import { createSlice } from "@reduxjs/toolkit";

const knowledgeSlice = createSlice({
  name: "knowledge",
  initialState: {
    selectedId: null,
  },
  reducers: {
    setSelectedId: (state, action) => {
      console.log("set", action.payload);
      state.selectedId = action.payload;
    },
  },
});

export const { setSelectedId } = knowledgeSlice.actions;
export default knowledgeSlice.reducer;
