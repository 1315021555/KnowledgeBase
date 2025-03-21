import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice.js";
import knowledgeReducer from "./knowledgeSlice.js";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    knowledge: knowledgeReducer,
  },
});
