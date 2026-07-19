export function getWeekRange() {
  const today = new Date();
  //이번 주 월요일 구하기
  const day = today.getDay(); //배열숫자 반환
  const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    diffToMonday,
    0,
    0,
    0,
    0,
  );
  //이번 주 일요일 구하기
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return { startOfWeek, endOfWeek };
}
