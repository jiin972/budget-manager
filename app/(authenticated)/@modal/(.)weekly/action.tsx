"use server";

import { getWeekRange } from "@/lib/date";
import db from "@/lib/db";
import getSession from "@/lib/session";

const ollamaURL = process.env.OLLAMA_API_URL;

//주간 지출내역 AI fetch코드
export async function getWeeklyAianalysis(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session.id) {
    return { success: false, errors: { userId: ["로그인이 필요합니다."] } };
  }
  const userId = session.id;
  const { startOfWeek, endOfWeek } = getWeekRange();
  try {
    //DB조회
    const weeklyData = await db.expense.findMany({
      where: {
        userId: userId,
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
  const session = await getSession();
  if (!session.id) {
    return { success: false, errors: { userId: ["로그인이 필요합니다."] } };
  }
  const userId = session.id;
  const { startOfWeek, endOfWeek } = getWeekRange();

  try {
    // findMany는 조건에 맞는 데이터가 없으면 빈 배열([]),
    // 있으면 객체 배열([...])을 반환함
    const data = await db.expense.findMany({
      where: {
        userId: userId,
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
