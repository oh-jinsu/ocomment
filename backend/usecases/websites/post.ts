import { UseCase } from "@/backend/usecase";

type Params = {
    name: string;
};

type Result = {
    id: string;
};

export const PostWebSiteUseCase: UseCase<Params, Result> = async (params) => {
    return { id: "123" };
};
