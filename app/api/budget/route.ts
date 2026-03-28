import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { user_id, month, year, total_budget } = await req.json();

    await db.query(
      `INSERT INTO Budgets (user_id, month, year, total_budget)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE total_budget = ?`,
      [user_id, month, year, total_budget, total_budget]
    );

    return NextResponse.json({
      success: true,
      message: "Budget saved",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const [rows] = await db.query<any>(
      `
      SELECT 
        b.total_budget,
        IFNULL(SUM(e.amount), 0) AS spent
      FROM Budgets b
      LEFT JOIN Expenses e 
        ON b.user_id = e.user_id 
        AND MONTH(e.expense_date) = ?
        AND YEAR(e.expense_date) = ?
      WHERE b.user_id = ?
      GROUP BY b.total_budget
      `,
      [month, year, user_id]
    );

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}