import Link from "next/link";
import "@/lib/db";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="my-auto flex flex-col items-center gap-5 text-center max-w-lg">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          AI 지출 분석
        </span>
        <h1 className="text-4xl font-bold text-white leading-tight">
          AI와 함께하는
          <br />
          똑똑한 주간 지출 내역서
        </h1>
        <p className="text-xl text-gray-200 font-medium mt-4">
          반가워요! 오늘의 소비는 어땠나요?
        </p>
        <p className="text-base text-gray-400 leading-relaxed">
          지금 로그인하고 이번 주 소비 피드백을 확인해 보세요.
        </p>
      </div>
      <div className="w-full max-w-xs flex flex-col items-center gap-4 mb-4">
        <Link
          href="/create-account"
          className="w-full text-center bg-primary rounded-xl px-3 py-1 text-lg font-semibold hover:bg-emerald-700 transition-colors hover:no-underline"
        >
          시작하기
        </Link>
        <div className="flex gap-2 text-sm text-gray-400">
          <span>이미 계정이 있나요?</span>
          <Link
            href="/login"
            className="text-primary hover:underline font-semibold"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
