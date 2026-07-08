"use server";

import db from "@/lib/db";

const ollamaURL = process.env.OLLAMA_API_URL;

//주간 지출내역 AI fetch코드
export async function getWeeklyAianalysis(prevState: any, formData: FormData) {
  const today = new Date();

  //이번 주 월요일 구하기
  const day = today.getDay();
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
  //이번주 일요일 구하기
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  try {
    //DB조회
    const weeklyData = await db.expense.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    if (!weeklyData || weeklyData.length === 0) {
      return { success: true, analysis: "이번주 지출 내역이 없습니다." };
    }
    //AI를 위한 텍스트 가공
    const expenseSummary = weeklyData
      .map((e) => `[${e.category}] ${e.content} ${e.amount}원`)
      .join("\n");
    const systemInstruction = `너는 자산관리 전문가야. 유저의 일주일 지출 내역을 보고,
     어떤 카테고리에서 과소비를 했는지, 어디를 줄여야 하는지 친근하고 편안한 말투로 2줄 핵심만
    요약해서 피드백 해줘 `;

    // Ollama API호출
    const response = await fetch(`${ollamaURL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma4:e4b",
        prompt: `${systemInstruction}\n\n[이번 주 지출 내역]\n${expenseSummary}`,
        stream: false,
        options: { keep_alive: -1 },
      }),
    });
    if (!response.ok) throw new Error("Ollama서버 응답 실패"); //서버에러 캐치
    const data = await response.json();
    return { success: true, analysis: data.response.trim() };
  } catch (e) {
    //네트워크 에러 캐치
    console.log("진짜에러 원인:", e);
    return { success: false, analysis: "AI 주간 분석을 가져오지 못했습니다." };
  }
}

//주간 지출내역 가져오기
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
