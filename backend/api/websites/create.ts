import { API } from "..";
import { NextResponse } from "next/server";
import { createWebsiteUseCase } from "@/backend/usecases/websites/create";
import { UnauthorizedException } from "@/backend/usecases/exceptions";
import { BadRequestResponse } from "../server";

export const createWebsiteAPI = API.get("/websites/create", async (req) => {
    try {
        const accessToken = req.cookies.get("accessToken")?.value;

        if (!accessToken) {
            throw new BadRequestResponse("로그인이 필요해요.")
        }   

        const name = req.nextUrl.searchParams.get("name");

        if (!name) {
            throw new BadRequestResponse("이름을 입력해 주세요.")
        }

        const website = await createWebsiteUseCase({ accessToken, name });

        return NextResponse.redirect(new URL(`/websites/${website.id}`, req.nextUrl.origin))
    } catch (e) {
        if (e instanceof UnauthorizedException || e instanceof BadRequestResponse) {
            return NextResponse.redirect(new URL(`/auth/signin?redirectUrl=${req.url}`, req.nextUrl.origin))
        }

        throw e;
    }
});
