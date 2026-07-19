import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface SessionContent {
  id?: number;
}

//common cookie options
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
//iron session init
export default async function getSession() {
  return getIronSession<SessionContent>(await cookies(), getCookieOptions());
}

//추가-Proxy(미들웨어) only - session 유무만 확인
export async function getProxySession(request: NextRequest) {
  return getIronSession<SessionContent>(
    request as unknown as Request, //브라우저가 보낸 쿠키를 읽음, 타입 강제로 우회
    new Response(), //session.save()안 쓰므로, 실제로는 사용안되는 빈 응답 객체
    getCookieOptions(), //미들웨어에서도 배포환경에 맞게 scure옵션 켬
  );
}
