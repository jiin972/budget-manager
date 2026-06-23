export default function Home() {
  return (
    <main className="min-h-screen p-5 flex flex-col items-center justify-center">
      <div className="bg-card-dark p-5 rounded-2xl shadow-xl max-w-md w-full border border-slate-600/80">
        <h1 className="text-2xl font-semibold text-primary mb-2">
          Budget Manager
        </h1>
        <p className="text-text-muted mb-5">
          자연어로 입력하는 AI 지출 관리 서비스
        </p>
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-600/80 mb-4">
          <p className="text-sm text-text-muted">테스트 입력기</p>
          <p className="text-sm italic mt-1">
            "오늘 카페에서 아메리카노 5000원 씀"
          </p>
        </div>
        <button className="w-full bg-primary rounded-xl hover:bg-emerald-600 text-bg-dark font-semibold py-2 px-4 transition-colors ">
          시작하기
        </button>
      </div>
    </main>
  );
}
