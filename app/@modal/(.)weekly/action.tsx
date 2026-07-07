"use server";

import db from "@/lib/db";

export async function getWeekly() {
  const today = new Date();

  //이번 주 월요일 구하기(원본은 유지)
  const day = today.getDay(); // 0(일)~6(토)
  const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
  // const startOfWeek = new Date(today.setDate(diffToMonday));
  // startOfWeek.setHours(0, 0, 0, 0); //월요일 시작 시간 설정
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
  endOfWeek.setHours(23, 59, 59, 999); //일요일 종료시간 설정

  try {
    // findMany는 조건에 맞는 데이터가 없으면 빈 배열([]),
    // 있으면 객체 배열([...])을 반환함
    const data = await db.expense.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: {
        createdAt: "desc", // 최신순 정렬
      },
    });
    return data;
  } catch (e) {
    console.log("에러발생:", e);
    return []; // 없을 경우 빈 배열 반환
  }
}
