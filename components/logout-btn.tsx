import { logOut } from "@/app/(authenticated)/home/action";

export default function LogOutBtn() {
  return (
    <form action={logOut}>
      <button>Log Out</button>
    </form>
  );
}
