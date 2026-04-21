import { NextResponse } from "next/server";
export const ok = (data: unknown) => 
    NextResponse.json({ succe: true, data }, { status: 200 })

export const created = (data: unknown) =>
    NextResponse.json({ success: true, data }, { status: 201 })

export const badRequest = (message: string) =>
    NextResponse.json({ success: false, error: message }, { status: 400 })

export const notFound = (message = "Not found") =>
    NextResponse.json({ success: false, error: message }, { status: 404 })

export const serverError = (err: unknown) => {
  console.error(err); 
  let message = "Internal server error";
  if (err instanceof Error) {
    message = err.message;
  }
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(process.env.NODE_ENV !== "production" && {
        stack: err instanceof Error ? err.stack : undefined,
      }),
    },
    { status: 500 }
  );
};