import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

const getCookieOptions = () => {
  return {
    cookieName: "smartest-payment",
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production", //vercel배포 환경이면 무조건 ture(https보안적용)
      httpOnly: true, //js가 쿠키를 가로채지 못하게 방어
      path: "/", //사이트 전체에 쿠키 사용
      sameSite: "lax", //다른 탭, 링크 이동 시에도 쿠키 유지
    },
  };
};

export default async function getSession() {
  return getIronSession<SessionContent>(await cookies(), getCookieOptions());
}
