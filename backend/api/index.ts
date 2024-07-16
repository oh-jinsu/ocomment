import { NextResponse, type NextRequest } from "next/server";
import { PromiseOr } from "@/lib/promise";
import { APIException } from "./client";

export type APIRequest<RequestBody> = Omit<NextRequest, "json"> & {
    json(): Promise<RequestBody>;
};

export type APIHandler<RequestBody, ResponseBody, Context> = (
    req: APIRequest<RequestBody>,
    context: Context,
) => PromiseOr<ResponseBody>;

export type APIRequestInit<RequestBody, Context> = Omit<RequestInit, "method" | "body"> &
    (RequestBody extends void ? {} : { body: RequestBody }) &
    (Context extends void ? {} : Context);

export type APIRequestParams<RequestBody, Context> = RequestBody extends void
    ? Context extends void
        ? []
        : [init: APIRequestInit<RequestBody, Context>]
    : [init: APIRequestInit<RequestBody, Context>];

export type ClientAPIResponse<RequestBody> = RequestBody | APIException;

export class API<RequestBody, ResponseBody, Context = void> {
    readonly method: string;

    readonly endpoint: string;

    readonly handler: (req: NextRequest, context: Context) => PromiseOr<Response>;

    constructor(method: string, endpoint: string, handler: APIHandler<RequestBody, ResponseBody, Context>) {
        this.endpoint = endpoint;

        this.method = method;

        this.handler = this.createHandler(handler);
    }

    protected createHandler(fn: APIHandler<RequestBody, ResponseBody, Context>): typeof this.handler {
        return async (...args) => {
            try {
                const result = await fn(...args);

                return NextResponse.json(result, {
                    status: this.createStatus(),
                });
            } catch (e) {
                if (e instanceof Error) {
                    return NextResponse.json({ message: e.message }, { status: 500 });
                }

                if (e instanceof Response) {
                    return e;
                }

                throw e;
            }
        };
    }

    protected createStatus() {
        switch (this.method) {
            case "GET":
                return 200;
            case "POST":
                return 201;
            case "PUT":
            case "PATCH":
                return 204;
            case "DELETE":
                return 204;
        }
    }

    static get<ResponseBody, Context = void>(endpoint: string, handler: APIHandler<void, ResponseBody, Context>) {
        return new API<void, ResponseBody, Context>("GET", endpoint, handler);
    }

    static post<RequestBody, ResponseBody, Context = void>(
        endpoint: string,
        handler: APIHandler<RequestBody, ResponseBody, Context>,
    ) {
        return new API<RequestBody, ResponseBody, Context>("POST", endpoint, handler);
    }

    static put<RequestBody, ResponseBody, Context = void>(
        endpoint: string,
        handler: APIHandler<RequestBody, ResponseBody, Context>,
    ) {
        return new API<RequestBody, ResponseBody, Context>("PUT", endpoint, handler);
    }

    static patch<RequestBody, ResponseBody, Context = void>(
        endpoint: string,
        handler: APIHandler<RequestBody, ResponseBody, Context>,
    ) {
        return new API<RequestBody, ResponseBody, Context>("PATCH", endpoint, handler);
    }

    static delete<RequestBody, ResponseBody, Context = void>(
        endpoint: string,
        handler: APIHandler<RequestBody, ResponseBody, Context>,
    ) {
        return new API<RequestBody, ResponseBody, Context>("DELETE", endpoint, handler);
    }

    async fetch(...args: APIRequestParams<RequestBody, Context>): Promise<ClientAPIResponse<ResponseBody>> {
        return this.fetchInternal(this.endpoint, args[0]);
    }

    async fetchFromServer(
        req: NextRequest,
        init?: APIRequestInit<RequestBody, Context>,
    ): Promise<ClientAPIResponse<ResponseBody>> {
        return this.fetchInternal(new URL(this.endpoint, req.nextUrl.origin), init);
    }

    protected async fetchInternal(
        input: string | URL,
        init?: APIRequestInit<RequestBody, Context>,
    ): Promise<ClientAPIResponse<ResponseBody>> {
        const res = await fetch(this.buildInput(input, init), {
            ...init,
            method: this.method,
            body: (init as any)?.body ? JSON.stringify((init as any).body) : undefined,
            headers: {
                "Content-Type": "application/json",
                ...init?.headers,
            },
        } satisfies RequestInit);

        if (!res.ok) {
            const { message } = await res.json();

            return new APIException(res.status, message);
        }

        return await res.json();
    }

    protected buildInput(input: string | URL, init?: APIRequestInit<RequestBody, Context>) {
        if (!init) {
            return input;
        }

        const url = this.attachSearchParams(input, init);

        if ("params" in init && typeof init.params === "object" && init.params !== null) {
            return Object.entries(init.params).reduce(
                (url, [key, value]) => url.replace(`:${key}`, String(value)),
                url.toString(),
            );
        }

        return url;
    }

    protected attachSearchParams(input: string | URL, init?: APIRequestInit<RequestBody, Context>) {
        if (!init) {
            return input;
        }

        const searchParams = new URLSearchParams();

        if ("searchParams" in init && typeof init.searchParams === "object" && init.searchParams !== null) {
            for (const [key, value] of Object.entries(init.searchParams)) {
                searchParams.append(key, String(value));
            }
        }

        if (searchParams.size === 0) {
            return input;
        }

        if (input instanceof URL) {
            input.search = searchParams.toString();

            return input;
        }

        return input + "?" + searchParams.toString();
    }
}

export function GET<ResponseBody, Context = void>(endpoint: string, handler: APIHandler<void, ResponseBody, Context>) {
    return new API<void, ResponseBody, Context>("GET", endpoint, handler);
}
