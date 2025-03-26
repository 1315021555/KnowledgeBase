import { configureStore } from "@reduxjs/toolkit";

import knowledgeReducer from "./knowledgeSlice";
import chatReducer from "./chatSlice";
import editorSlice from "./editorSlice";
export const store = configureStore({
  reducer: {
    knowledge: knowledgeReducer,
    chat: chatReducer,
    editor:editorSlice
  },
});
