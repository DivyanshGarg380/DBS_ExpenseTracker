import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const [rows] = await db.query<any>(
      "SELECT * FROM Users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Invalid credentials",
      });
    }

    return NextResponse.json({
      success: true,
      user: rows[0],
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}


export async function PUT(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const [existing] = await db.query<any>(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        error: "User already exists",
      });
    }

    const [result]: any = await db.query(
      "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    return NextResponse.json({
      success: true,
      user: {
        user_id: result.insertId,
        name,
        email,
      },
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}