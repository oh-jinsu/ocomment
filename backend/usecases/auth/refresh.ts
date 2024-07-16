import { data } from "@/backend/db";
import { UseCase } from "@/backend/usecase";
import { JWT } from "@/lib/jwt";
import { compare } from "bcryptjs";
import { decodeJwt } from "jose";

export type RefreshAuthParams = {
    refreshToken: string;
};

export type RefreshAuthResult = {
    accessToken: string;
};

export const RefreshAuthUseCase: UseCase<RefreshAuthParams, RefreshAuthResult> = async ({ refreshToken }) => {
    const { userId } = decodeJwt(refreshToken);

    if (typeof userId !== "string") {
        throw Error("토큰이 올바르지 않아요.");
    }

    const user = await data.query.userTable.findFirst({
        where(t, { eq }) {
            return eq(t.id, userId);
        },
    });

    if (!user) {
        throw Error("이용자를 찾지 못했어요.");
    }

    if (!user.refreshToken) {
        throw Error("인증 정보를 찾지 못했어요.");
    }

    if (await compare(user.refreshToken, refreshToken)) {
        throw Error("토큰이 올바르지 않아요.");
    }

    const accessToken = await new JWT(process.env.ACCESS_TOKEN_SECRET).sign(
        { userId: user.id },
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "5s",
        },
    );

    return {
        accessToken,
    };
};
