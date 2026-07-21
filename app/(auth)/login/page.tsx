"use client";

import AuthInput from "@/components/auth_input";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useActionState } from "react";
import { loginState } from "./action";

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginState, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6 min-h-screen bg-app-gradient ">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with Email and Password!</h2>
      </div>
      <form
        action={formAction}

        className="flex flex-col gap-2 "
      >
        <AuthInput
          name="email"
          type="email"
          required
          placeholder="Email"
          errors={state?.flattenErrors?.email}
          defaultValue={state?.payload?.email?.toString() ?? ""}
        />
        <AuthInput
          name="password"
          type="password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          placeholder="Password"
          errors={state?.flattenErrors?.password}
          defaultValue=""
        />
        <button>{isPending ? "wait.." : "Log in"}</button>
      </form>
    </div>
  );
}
