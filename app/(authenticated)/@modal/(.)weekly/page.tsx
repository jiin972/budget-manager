import WeekReport from "@/components/week_report.";
import { getWeekly } from "./action";

export default async function WeeklyModal() {
  const days = await getWeekly();
  if (!days) return "데이터가 없습니다.";
  const totalAmonut = days.reduce((acc, day) => acc + day.amount, 0);

  return (
    <div className="fixed bg-card-dark inset-0 z-50 p-5 overflow-y-auto  grid place-items-center">
      <div className="max-w-md w-full flex flex-col gap-5 my-auto">
        <div className="bg-slate-900 p-6 rounded-2xl max-w-md w-full shadow-2xl">
          <h2 className="text-primary text-3xl font font-semibold p-5 text-center">
            주간지출내역서
          </h2>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[50vh] pr-1 text-sm">
            {days.map((day) => (
              <div
                key={day.id}
                className=" w-full grid grid-cols-4 items-center gap-3 text-center shrink-0 border-b border-gray-700/40 py-2"
              >
                <div className="text-left text-gray-400">
                  {day.createdAt.toLocaleDateString()}
                </div>
                <div className="text-gray-300 font-medium truncate">
                  {day.category}
                </div>
                <div
                  className="text-gray-400 truncate cursor-help "
                  title={day.content}
                >
                  {day.content}
                </div>
                <div className="text-right font-semibold text-primary">{`${day.amount.toLocaleString()}원`}</div>
              </div>
            ))}
            <div className="text-right font-semibold">{`${totalAmonut.toLocaleString()} 원`}</div>
          </div>
        </div>
        <div className="mt-5 flex justify-center">
          <WeekReport />
        </div>
      </div>
    </div>
  );
}
