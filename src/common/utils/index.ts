// 定义防抖函数
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, delay);
  };
};
