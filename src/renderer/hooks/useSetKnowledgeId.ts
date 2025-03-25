import { useDispatch, useSelector } from "react-redux";
import {
  setCurKnowledgeSyncStatus,
  setCurrentPageIsEdit,
  setSelectedId,
} from "../redux/knowledgeSlice";
import { updateKnowledgeContentById } from "@/service/api/knowledage";
export function useSetKnowledgeId() {
  const dispatch = useDispatch();
  const selectedId = useSelector((state: any) => state.knowledge.selectedId); // 当前选中的 ID
  const currentContent = useSelector(
    (state: any) => state.knowledge.currentKnowledgeContent
  );
  const currentPageIsEdit = useSelector(
    (state: any) => state.knowledge.currentPageIsEdit
  );

  const commitAndDispatch = async (newSelectedId: string) => {
    console.log("commitAndDispatch", selectedId, newSelectedId);
    // 检查是否有未提交的更改
    if (
      selectedId !== newSelectedId &&
      selectedId !== null &&
      currentPageIsEdit
    ) {
      try {
        // 提交更新
        await updateKnowledgeContentById(selectedId, {
          content: currentContent,
        });
        console.log("切换页面前：内容已更新", currentContent);
      } catch (error) {
        console.error("提交更新失败:", error);
        dispatch(setSelectedId(newSelectedId));
        return; // 如果更新失败，不执行后续操作
      }
    }

    // 执行 dispatch(setSelectedId);
    dispatch(setCurrentPageIsEdit(false));
    dispatch(setSelectedId(newSelectedId));
  };

  return commitAndDispatch;
}
