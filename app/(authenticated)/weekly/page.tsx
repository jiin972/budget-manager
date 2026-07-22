import db from "@/lib/db";
import getSession from "@/lib/session";

export default async function WeeklyPage() {
  const session = await getSession();
  const profile = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      username: true,
    },
  });
  const expenses = await db.expense.findMany({
    where: {
      userId: session.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className="min-h-screen p-5 flex flex-col items-center justify-center relative">
      <div className="bg-card-dark p-5 rounded-2xl shadow-xl max-w-md w-full border border-slate-600/80">
        <h1 className="text-2xl font-semibold text-primary mb-2">
          {profile?.username ?? "회원"} 님의 주간 지출 내역
        </h1>
        {expenses.map((expense) => (
          <div key={expense.id} className="flex spce-y-2 mt-2 gap-4">
            <div className="text-text-muted mb-5">
              {new Date(expense.createdAt).toLocaleDateString("ko-KR")}
            </div>
            <div className="text-text-muted mb-5">{expense.content}</div>
            <div key={expense.id} className="text-text-muted mb-5">
              {expense.amount.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
