import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const DEFAULT_COOKIE_FLAGS: Partial<ResponseCookie> = {
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};
