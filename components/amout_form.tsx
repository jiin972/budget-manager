"use client";

import { getOllamaData } from "@/app/action";
import { useState } from "react";

export default function AmountForm() {
  //입력창 상태 관리
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  //상태 제어용 변수
  const [isPending, setIsPending] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleAiAnalysis = async (formData: FormData) => {
    setIsPending(true);

    const result = await getOllamaData(null, formData);
    if (result && result.success && result.data) {
      setAmount(result.data.amount + "");
      setCategory(result.data.category);
      setContent(result.data.content);
      setConfirm(true);
    }
    setIsPending(false);
  };
  return (
    <>
      <form action={handleAiAnalysis}>
        <input
          className="w-full text-sm text-text-muted py-3"
          name="prompt"
          placeholder="사용내역을 입력해 주세요"
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2  bg-primary rounded-xl hover:bg-emerald-600 text-bg-dark font-semibold py-2 px-4 transition-colors "
        >
          {isPending ? "분석중" : "시작하기"}
        </button>
      </form>
      {isPending ? (
        <div className="text-sm text-text-muted mt-4">
          <span> AI 분석 중..잠시만 기다려 주세요.</span>
        </div>
      ) : (
        confirm && (
          <div className="p-4">
            <form className="flex flex-col gap-5 text-white">
              <div>
                <input
                  name="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm p-4 py-2 border border-text-muted rounded-xl"
                />
              </div>
              <input
                name="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <input
                name="content"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </form>
          </div>
        )
      )}
    </>
  );
}
