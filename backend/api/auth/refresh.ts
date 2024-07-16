import { RefreshAuthUseCase } from "@/backend/usecases/auth/refresh";
import { API } from "@/backend/api";
import { BadRequest } from "@/backend/api/server";

export const refreshAuthAPI = API.get("/api/auth/refresh", async (req) => {
    const refreshToken = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!refreshToken) {
        throw BadRequest();
    }

    return await RefreshAuthUseCase({ refreshToken });
});
