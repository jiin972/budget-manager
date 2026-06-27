"use server";

import { z } from "zod";
import db from "../lib/db";
import { revalidatePath } from "next/cache";

//LLM API fetcher
export async function askLLM(formData: FormData) {
  const prompt = formData.get("prompt") as string;
  const response = await fetch("http://100.109.28.107:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gemma4:e4b",
      prompt: prompt,
      stream: false,
    }),
  });
  const data = await response.json();
  return { result: data.response };
}

// 입력값 검증담당
export async function checkInputData(formData: FormData) {
  const expenseSchema = z.object({
    amount: z.coerce.number().min(1),
    category: z.string().min(1, "사용처를 입력 해야 합니다.."),
    description: z.string().min(1, "사용내역을 입력 해야 합니다."),
  });
  const data = {
    amount: formData.get("amount"),
    category: formData.get("category"),
    description: formData.get("description"),
  };
  const result = expenseSchema.safeParse(data);

  return result;
}

//db 생성
export async function addExpense(formData: FormData) {
  const result = await checkInputData(formData);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    console.log("검증실패", flatten.fieldErrors);
    return;
  }
  const { amount, category, description } = result.data;

  await db.expense.create({
    data: {
      amount,
      category,
      description,
    },
  });
  // DB변경  화면 새로 고침
  // data리턴 보다 revalidatePath가 적절함
  revalidatePath("/");
}
