import { NextRequest, NextResponse } from "next/server";

export const POST = (request: NextRequest) => {
  const body = request.body;
  console.log(body);

  return NextResponse.json({ success: true });
};
