"use client";

import AuthInput from "@/components/auth_input";
import { useActionState } from "react";
import { createAccount } from "./action";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [state, formAction, isPending] = useActionState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6 ">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the Form below to join!</h2>
      </div>
      <form action={formAction} className="flex flex-col gap-2 ">
        <AuthInput
          name="username"
          required
          type="text"
          placeholder="Username"
          minLength={3}
          errors={state?.flattenError.username}
          defaultValue={state?.payload.username?.toString() ?? ""}
        />
        <AuthInput
          name="email"
          required
          type="email"
          placeholder="Email"
          errors={state?.flattenError.email}
          defaultValue={state?.payload.email?.toString() ?? ""}
        />
        <AuthInput
          name="password"
          required
          type="password"
          placeholder="Password"
          errors={state?.flattenError.password}
          defaultValue={state?.payload.password?.toString() ?? ""}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <AuthInput
          name="confirmPassword"
          required
          type="password"
          placeholder="Confirm password"
          errors={state?.flattenError.confirmPassword}
          defaultValue={state?.payload.confirmPassword?.toString() ?? ""}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <button
          type="submit"
          disabled={isPending}
          className="mt-5 rounded-lg bg-emerald-400 px-4 py-2 hover:bg-emerald-500 text-white fontfont-semibold transition-colors disabled:bg-gray-500 disabled:cousor-not-allowed"
        >
          {isPending ? "저장 중..." : "가입완료"}
        </button>
      </form>
    </div>
  );
}
