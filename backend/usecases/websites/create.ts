import { data, InferSelect, websiteTable } from "@/backend/db";
import { UseCase } from "@/backend/usecase";
import { AccessToken } from "@/lib/jwt";
import { v4 } from "uuid";
import { UnauthorizedException } from "../exceptions";

type Params = {
    accessToken: string;
    name: string;
};

type Result = InferSelect<typeof websiteTable>;

export const createWebsiteUseCase: UseCase<Params, Result> = async ({ accessToken, name }) => {
    const payload = await new AccessToken().verify(accessToken);

    if (!payload) {
        throw new UnauthorizedException()
    }

    const { userId } = payload

    if (typeof userId !== "string") {
        throw new UnauthorizedException()
    }

    if (name.length === 0) {
        throw Error("웹사이트 이름을 입력해주세요.");
    }

    const user = await data.query.userTable.findFirst({
        where(t, { eq }) {
            return eq(t.id, userId);
        },
    });

    if (!user) {
        throw Error("이용자를 찾지 못했어요.");
    }

    const id = v4();

    const result = await data
        .insert(websiteTable)
        .values({
            id,
            name,
            userId: user.id,
        })
        .returning();

    return result[0]
};
