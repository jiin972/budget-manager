import AmountForm from "@/components/amout_form";

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
          <AmountForm />
        </div>
      </div>
    </main>
  );
}
