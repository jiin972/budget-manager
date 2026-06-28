"use client";

import { getOllmaData } from "@/app/action";
import { useActionState } from "react";

export default function AmountForm() {
  const [state, formAction, isPending] = useActionState(getOllmaData, null);

  return (
    <>
      <form action={formAction}>
        <input
          className="w-full text-sm text-text-muted py-3"
          name="prompt"
          placeholder="사용내역을 입력해 주세요"
        />
        <button
          type="submit"
          className="w-full mt-2  bg-primary rounded-xl hover:bg-emerald-600 text-bg-dark font-semibold py-2 px-4 transition-colors "
        >
          시작하기
        </button>
      </form>
      {isPending ? (
        <div className="text-sm text-text-muted mt-4">
          <span>로딩 중..잠시만 기다려 주세요.</span>
        </div>
      ) : (
        state?.result && <div className="mt-4 p-4 rounded">{state.result}</div>
      )}
    </>
  );
}
``;
