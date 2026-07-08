"use server";

import { z } from "zod";
import db from "../lib/db";
import { revalidatePath } from "next/cache";

//LLM API fetcher
//인자를 추가로 받으려면 formData앞에 배치해야 함

const ollamaUrl = process.env.OLLAMA_API_URL;

export async function getOllamaData(prevState: any, formData: FormData) {
  const prompt = formData.get("prompt") as string;
  const todayStr = new Date().toISOString().split("T")[0];
  const systemInstruction = `
    너는 가계부 기록 봇이야. 유저가 지출 내역을 입력하면, 서론과 마무리는 절대 하지 말고 오직 아래의 JSON 포맷으로만 딱 한 줄로 답변해.

    [포맷]
    {"category": "카테고리", "amount": 금액, "content": "내역", "createdAt":"사용일"}

    [예시]
    유저: 오늘 마트에서 고기 삼만원
    답변: {"category": "식비", "amount": 30000, "content": "마트 고기", "createdAt:"2026.05.15"}

    [절대 규칙]
    1. "밥먹었어", "안녕"처럼 금액(숫자)이나 명확한 지출 행위가 없는 문장이 들어오면, 위의 포맷을 절대 만들지 마.
    2. 금액이나 지출 내역을 추정할 수 없다면, 무조건 아래의 에러 JSON 포맷 딱 하나만 반환해. 다른 말은 절대 하지 마.
    {
      "error": "금액이나 명확한 지출 내역을 찾을 수 없습니다."
    }
    `;
  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma4:e4b",
        prompt: `${systemInstruction}\n\n[참고] 오늘의 날짜는 ${todayStr} 입니다. 유저입력 ${prompt}`, //input으로 받은 값
        stream: false,
        options: { keep_alive: -1 },
      }),
    });
    if (!response.ok) throw new Error("Ollama서버 응답 실패"); //서버에러캐치
    const data = await response.json();
    //ollama가 보낸 텍스트 구조, 객체 파싱
    const parseResult = JSON.parse(data.response.trim());
    return { success: true, result: data.response, data: parseResult };
  } catch (e) {
    console.log("Ai분석실패", e);
    return { success: false, e: "AI 분석 실패" };
  }
}

// 입력값 검증담당
export async function checkInputData(formData: FormData) {
  const expenseSchema = z.object({
    amount: z.coerce.number().min(1),
    category: z.string().min(1, "사용처를 입력 해야 합니다.."),
    content: z.string().min(1, "사용내역을 입력 해야 합니다."),
    createdAt: z.coerce.date().min(1), //스트링타입을 date타입으로 변환환
  });
  const data = {
    amount: formData.get("amount"),
    category: formData.get("category"),
    content: formData.get("content"),
    createdAt: formData.get("createdAt") || new Date(),
  };
  const result = expenseSchema.safeParse(data);

  return result;
}

//db 생성
export async function addExpense(prevState: any, formData: FormData) {
  const result = await checkInputData(formData);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    console.log("검증실패", flatten.fieldErrors);
    return { success: false, errors: flatten.fieldErrors };
  }
  const { amount, category, content, createdAt } = result.data;

  await db.expense.create({
    data: {
      amount,
      category,
      content,
      createdAt,
    },
  });
  // DB변경  화면 새로 고침
  // data리턴 보다 revalidatePath가 적절함
  console.log("DB저장완료:", { amount, category, content, createdAt });
  revalidatePath("/");
  return { success: true };
}
