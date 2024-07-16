import { NextResponse } from "next/server";

export function ExceptionResponse(status: number, message: string) {
    return new NextResponse(JSON.stringify({ message }), {
        status,
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });
}

export function BadRequest(message = "Bad Request") {
    return ExceptionResponse(400, message);
}

export function Unauthorized(message = "Unauthorized") {
    return ExceptionResponse(401, message);
}

export function Forbidden(message = "Forbidden") {
    return ExceptionResponse(403, message);
}

export function NotFound(message = "Not Found") {
    return ExceptionResponse(404, message);
}

export function InternalServerError(message = "Internal Server Error") {
    return ExceptionResponse(500, message);
}
