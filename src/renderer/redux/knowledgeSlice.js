import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDirTree } from "@/service/api/knowledage";

// 创建一个异步 thunk 函数
export const fetchAndUpdateTreeData = createAsyncThunk(
  "knowledge/fetchAndUpdateTreeData",
  async () => {
    const treeData = await getDirTree(); // 调用 API 获取 treeData
    console.log("fetchAndUpdateTreeData", treeData);
    return treeData; // 返回获取到的数据
  }
);

const knowledgeSlice = createSlice({
  name: "knowledge",
  initialState: {
    /** 当前选中的知识节点 ID */
    selectedId: null,
    /** 当前知识节点内容 */
    currentKnowledgeContent: "",
    /** 当前知识同步状态 */
    currentKnowledgeSyncStatus: true,
    /** 知识目录结构 */
    treeData: [],
  },
  reducers: {
    setSelectedId: (state, action) => {
      console.log("set setSelectedId", action.payload);
      state.selectedId = action.payload;
    },
    setTreeData: (state, action) => {
      console.log("set treedata", action.payload);
      state.treeData = action.payload;
    },
    setCurKnowledgeContent: (state, action) => {
      console.log("setCurKnowledge", action.payload);
      state.currentKnowledgeContent = action.payload;
    },
    setCurKnowledgeSyncStatus: (state, action) => {
      console.log("setCurKnowledgeSyncStatus", action.payload);
      state.currentKnowledgeSyncStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 处理异步 thunk 的 pending 状态
    builder.addCase(fetchAndUpdateTreeData.pending, (state) => {
      // 可以在这里添加加载状态的处理
    });
    // 处理异步 thunk 的 fulfilled 状态
    builder.addCase(fetchAndUpdateTreeData.fulfilled, (state, action) => {
      state.treeData = action.payload; // 更新 treeData
    });
    // 处理异步 thunk 的 rejected 状态
    builder.addCase(fetchAndUpdateTreeData.rejected, (state, action) => {
      console.error("获取 treeData 失败:", action.error);
    });
  },
});

export const {
  setSelectedId,
  setTreeData,
  setCurKnowledgeContent,
  setCurKnowledgeSyncStatus,
} = knowledgeSlice.actions;
export default knowledgeSlice.reducer;
