import { configureStore } from "@reduxjs/toolkit";

import knowledgeReducer from "./knowledgeSlice.js";

export const store = configureStore({
  reducer: {
    knowledge: knowledgeReducer,
  },
});
