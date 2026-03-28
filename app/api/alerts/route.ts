import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    const [rows] = await db.query<any>(
      `SELECT * FROM Alerts WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}