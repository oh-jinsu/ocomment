import { JWTPayload, SignJWT, jwtVerify } from "jose";

export type JWTInput = {
    issuer?: string;
    expiresIn?: string;
}

export class JWT {
    private secret: string;

    constructor(secret?: string) {
        if (!secret) {
            throw new Error("JWT secret is required");
        }

        this.secret = secret;
    }

    async sign(
        payload: JWTPayload = {},
        {
            issuer,
            expiresIn,
        }: JWTInput = {},
    ) {
        const jwt = new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })

            .setIssuedAt();

        if (issuer) {
            jwt.setIssuer(issuer);
        }
        if (expiresIn) {
            jwt.setExpirationTime(expiresIn);
        }

        return jwt.setIssuedAt().sign(new TextEncoder().encode(this.secret));
    };

    async verify(token: string) {
        try {
            const result = await jwtVerify(token, new TextEncoder().encode(this.secret));

            return result.payload;
        } catch (e) {
            // console.warn(e);

            return;
        }
    };
}
