/**
 * 根据 id 查找路径
 * @param {Array} tree - 树形数据
 * @param {number} id - 目标节点的 id
 * @returns {Array} - 拼接后的路径
 */
export function findPath(tree: any[], id: number) {
  // 递归遍历树
  function traverse(node: any, nodePath: string[]): string[] {
    if (node.id === id) {
      // 找到目标节点，返回路径数组
      return [...nodePath, node];
    }
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const result = traverse(child, [...nodePath, node]);
        if (result.length > 0) {
          return result;
        }
      }
    }
    return [];
  }

  for (const node of tree) {
    const result = traverse(node, []);
    if (result.length > 0) {
      return result;
    }
  }
  return ["未找到路径"];
}

// 找到id对应的父节点
export function getParentId(tree: any[], id: number) {
  // 递归遍历树
  function traverse(node: any): any {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        if (child.id === id) {
          return node; // 找到目标节点，返回父节点
        }
        const result = traverse(child);
        if (result) {
          return result; // 如果找到目标节点，返回父节点
        }
      }
    }
    return null; // 未找到目标节点
  } // 遍历整个树

  for (const node of tree) {
    const result = traverse(node);
    if (result) {
      return result;
    }
  }
}
