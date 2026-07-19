//Next.js middleWare

import { NextRequest, NextResponse } from "next/server";
import getSession, { getProxySession } from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

// 로그인되지 않은 유저가 가야하는 페이지 목록(이외에는 제한)
// 검색속도를 위해 객체생성
const publicOnlyUrls: Routes = {
  "/": true,
  "/create-account": true,
  "/login": true,
};

export async function proxy(request: NextRequest) {
  const session = await getProxySession(request); //페이지 이동마다 쿠키 호출
  const isLoggedIn = Boolean(session.id);
  const { pathname } = request.nextUrl;
  const isPublicOnly = publicOnlyUrls[pathname];

  //로그인 전 상태 -publicOnly외 차단
  if (!isLoggedIn) {
    //로그인 안했는데 보호된 경로 접근 시도 -> 로그인페이로 redirect
    if (!isPublicOnly) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  //user로그인 상태
  else {
    //로그인한 유저의 이동경로 설정(불필요한 이동은 제)
    if (isPublicOnly) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }
}

//특정 파일, url, api에서 미들웨어(proxy)제외 되도록 Regex정의
//정적파일 이외, api/public이미지 폴더 등도 미들웨어 감사에서 제외
//페이지 이동만 미들웨어가 신경쓰도록 함
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
