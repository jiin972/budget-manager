"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import z from "zod";

// //DB 내 email존재유무 체크
// const checkEmailExist = async (email: string) => {
//   const user = await db.user.findUnique({
//     where: {
//       email: email,
//     },
//     select: {
//       id: true,
//     },
//   });
//   return Boolean(user); //return user? true : false;
// };

const formSchema = z
  .object({
    email: z.email("이메일 형식이 아닙니다.").toLowerCase(),
    // .refine(checkEmailExist, "이메일 또는 비밀번호가 일치하지 않습니다."), //보안 향상을 위해 해당 메시지로 통일
    password:
      // z.string({
      //   error: (issue) =>
      //     issue.input === undefined ? "field required" : "invalid input", //형식 에러만 검증(실제 비밀번호 일치와 무관)
      // })
      z.string().min(1, "비밀번호를 입력해주세요."),
  })
  .superRefine(async ({ email, password }, ctx) => {
    //DB접근이 필요하므로, async처리
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true, //validate후 세션에 저장할 값
        password: true,
      },
    });
    if (!user) {
      ctx.addIssue({
        code: "custom",
        message: "이메일 또는 아이디가 일치하지 않습니다.",
        path: ["email"],
      });
      return z.NEVER;
    }
    //password 일치여부 확인,bcrypt
    const ok = await bcrypt.compare(password, user!.password);

    if (!ok) {
      ctx.addIssue({
        code: "custom",
        message: "이메일 또는 아이디가 일치하지 않습니다.",
        path: ["email"], //보안을 위해 email로 통일
      });
    }
  });

export async function loginState(prevState: any, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      flattenErrors: flatten.fieldErrors,
      payload: {
        email: data.email, //보안을 위해 password 제외
      },
    };
  } else {
    // 검증 성공 시, 세션생성
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession();
    session.id = user!.id;
    await session.save();
    redirect("/home");
  }
}
