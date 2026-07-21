import LogOutBtn from "@/components/logout-btn";

export default function AuthenticatedLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      <header>
        <div className="absolute top-2 right-2  bg-text-muted w-fit px-2 rounded-xl hover:bg-slate-500 transition-colors">
          <LogOutBtn />
        </div>
      </header>
      {children}
      {modal}
    </div>
  );
}
