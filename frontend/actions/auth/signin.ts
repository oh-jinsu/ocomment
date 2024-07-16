"use server";

import { SignInUseCase } from "@/backend/usecases/auth/signin";
import { ServerAction } from "../action";
import { cookies } from "next/headers";
import { DEFAULT_COOKIE_FLAGS } from "@/lib/cookie";
import { redirect } from "next/navigation";
import { decodeJwt } from "jose";

export const SignInServerAction = ServerAction(async (formData: FormData) => {
    const username = formData.get("username");

    const password = formData.get("password");

    const redirectUrl = formData.get("redirectUrl");

    if (typeof username !== "string") {
        throw new Error("아이디를 입력해 주세요.");
    }

    if (typeof password !== "string") {
        throw new Error("비밀번호를 입력해 주세요.");
    }

    if (redirectUrl && typeof redirectUrl !== "string") {
        throw new Error("경로가 올바르지 않아요.");
    }

    const { accessToken, refreshToken } = await SignInUseCase({ username, password });

    cookies().set("accessToken", accessToken, DEFAULT_COOKIE_FLAGS);

    cookies().set("refreshToken", refreshToken, DEFAULT_COOKIE_FLAGS);

    redirect(redirectUrl || "/");
});
