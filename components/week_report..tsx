"use client";

import { getWeeklyAianalysis } from "@/app/@modal/(.)weekly/action";
import { useActionState } from "react";

export default function WeekReport() {
  const [state, formaction, isPending] = useActionState(getWeeklyAianalysis, {
    success: false,
    analysis: "",
  });
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <form action={formaction}>
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary hover:bg-emerald-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isPending ? "분석중..." : "분석하기"}
        </button>
      </form>
      {!isPending && state.analysis && (
        <div className="mt-6 w-full">
          {state.success ? (
            <div className="p-4 rounded-xl bg-slate-600 border border-emerald-500/30 ">
              <h3 className="font-bold mb-2 flex items-center justify-center gap-2 text-primary">
                이번 주 AI지출내역 피드백
              </h3>
              <p className="whitespace-break-spaces leading-relaxed text-gray-200">
                {state.analysis}
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              {state.analysis}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
