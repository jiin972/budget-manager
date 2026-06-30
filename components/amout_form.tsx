"use client";

import { addExpense, getOllamaData } from "@/app/action";
import { useActionState, useState } from "react";

export default function AmountForm() {
  const [state, formaction, isSaving] = useActionState(addExpense, null);
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
      <form
        onSubmit={(e) => {
          e.preventDefault(); //화면새로고침막음
          handleAiAnalysis(new FormData(e.currentTarget));
        }}
      >
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
        <div className="text-sm text-emerald-400 mt-4">
          <span> AI 분석 중..잠시만 기다려 주세요.</span>
        </div>
      ) : (
        confirm && (
          <div className="p-4">
            <form
              action={formaction}
              id="budget-form"
              className="flex flex-col gap-5 text-white"
            >
              <div className="flex gap-4 w-full items-center">
                <span className="w-16 shrink-0 text-center text-sm">
                  지출액
                </span>
                <input
                  name="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-sm p-4 py-2 border border-text-muted rounded-xl"
                />
                {state?.errors?.amount && (
                  <p className="text-red-400 text-xs">
                    {state.errors.amount[0]}
                  </p>
                )}
                <span className="w-5 shrink-0">원</span>
              </div>
              <div className="flex gap-4 w-full items-center">
                <span className="w-16 shrink-0 text-center text-sm">분류</span>
                <input
                  name="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm p-4 py-2 border border-text-muted rounded-xl"
                />
              </div>
              {state?.errors?.category && (
                <p className="text-red-400 text-xs">
                  {state.errors.category[0]}
                </p>
              )}
              <div className="flex gap-4 w-full items-center">
                <span className="w-16 shrink-0 text-center text-sm">
                  상세내용
                </span>
                <input
                  name="content"
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-sm p-4 py-2 border border-text-muted rounded-xl"
                />
              </div>
              {state?.errors?.content && (
                <p className="text-red-400 text-xs">
                  {state.errors.content[0]}
                </p>
              )}
            </form>
            <div className="w-full mt-8 flex justify-center">
              <button
                type="submit"
                form="budget-form"
                className="text-lg font-semibold px-5 py-2 rounded-xl bg-text-muted text-black shadow-xl hover:cursor-pointer"
              >
                {isSaving ? "저장중..." : "저장하기"}
              </button>
            </div>
          </div>
        )
      )}
    </>
  );
}
