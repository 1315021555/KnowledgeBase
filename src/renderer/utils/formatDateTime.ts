export function formatWithWeekday(utcString: string) {
  const weeks = ["日", "一", "二", "三", "四", "五", "六"];
  const date = new Date(utcString);

  const padZero = (num: number) => String(num).padStart(2, "0");

  return (
    `${date.getFullYear()}年${padZero(date.getMonth() + 1)}月${padZero(
      date.getDate()
    )}日\n` + // 这里添加了\n换行符
    `星期${weeks[date.getDay()]} ${padZero(date.getHours())}:${padZero(
      date.getMinutes()
    )}`
  );
}
// 输出示例：
// "2025年03月29日
// 星期六 21:34"
