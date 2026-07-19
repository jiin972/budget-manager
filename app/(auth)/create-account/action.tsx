"use server";

import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import z from "zod";

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "필수 입력입니다.")
      .min(5, "5자 이상으로 입력합니다.")
      .trim(),
    email: z.email("이메일 형식이 아닙니다.").toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH, "5자 이상으로 입력합니다."),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "5자 이상으로 입력합니다."),
  })
  .superRefine(async ({ username, email, password, confirmPassword }, ctx) => {
    const usernameExists = await db.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });
    if (usernameExists) {
      ctx.addIssue({
        code: "custom",
        message: "해당 Username은 이미 존재합니다.",
        path: ["username"], //에러 표시할 경로
      });
    }
    const emailExists = await db.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
    if (emailExists) {
      ctx.addIssue({
        code: "custom",
        message: "해당 Email은 이미 존재합니다.",
        path: ["email"],
      });
      return z.NEVER;
    }
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
      });
    }
  });

export async function createAccount(prevState: any, formData: FormData) {
  //formdata 파싱
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return {
      flattenError: flatten.fieldErrors,
      //보안을 위해 payload에서 비밀번호제외
      payload: {
        username: data.username,
        email: data.email,
      },
    };
  } else {
    // zod검증 성공했을 경우 비밀번호 해싱(promise타입)
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    //save User on DB
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true, //세션(쿠키)구울 때, id만 반환 받음
      },
    });
    const session = await getSession();
    // add to data in Session from Prisma(data = id)
    session.id = user.id; // 세션 객체에 user의 데이터 기록(쿠키 미전달)
    await session.save(); // 호출 시, 브라우저에 쿠키 전달

    redirect("/home");
  }
}
