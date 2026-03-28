import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    const [categoryData] = await db.query<any>(
      `
      SELECT 
        c.name AS category,
        SUM(e.amount) AS total
      FROM Expenses e
      JOIN Categories c ON e.category_id = c.category_id
      WHERE e.user_id = ?
      GROUP BY c.name
      `,
      [user_id]
    );

    const [monthlyData] = await db.query<any>(
      `
      SELECT 
        MONTH(expense_date) AS month,
        YEAR(expense_date) AS year,
        SUM(amount) AS total
      FROM Expenses
      WHERE user_id = ?
      GROUP BY year, month
      ORDER BY year, month
      `,
      [user_id]
    );

    return NextResponse.json({
      success: true,
      categoryData,
      monthlyData,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}