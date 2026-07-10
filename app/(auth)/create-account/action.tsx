"use server";

import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import db from "@/lib/db";
import z, { flattenError } from "zod";

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

export async function CreateAccount(formData: FormData) {
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
      payload: data,
    };
  }
}
