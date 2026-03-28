import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query<any>(`
      SELECT 
        e.expense_id,
        e.amount,
        e.expense_date,
        e.notes,
        c.name AS category,
        u.name AS user
      FROM Expenses e
      JOIN Categories c ON e.category_id = c.category_id
      JOIN Users u ON e.user_id = u.user_id
      ORDER BY e.expense_date DESC
    `);

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_id, category_id, amount, expense_date, notes } = body;

    if (!user_id || !category_id || !amount || !expense_date) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields",
      });
    }

    await db.query(
      `INSERT INTO Expenses (user_id, category_id, amount, expense_date, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, category_id, amount, expense_date, notes || null]
    );

    return NextResponse.json({
      success: true,
      message: "Expense added successfully",
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
};

export async function DELETE(req: Request) {
  try {
    const { expense_id } = await req.json();

    if (!expense_id) {
      return NextResponse.json({
        success: false,
        error: "Expense ID required",
      });
    }

    await db.query(
      "DELETE FROM Expenses WHERE expense_id = ?",
      [expense_id]
    );

    return NextResponse.json({
      success: true,
      message: "Expense deleted",
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
};

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { expense_id, amount, category_id, expense_date, notes } = body;

    if (!expense_id) {
      return NextResponse.json({
        success: false,
        error: "Expense ID required",
      });
    }

    await db.query(
      `UPDATE Expenses
       SET amount = ?, category_id = ?, expense_date = ?, notes = ?
       WHERE expense_id = ?`,
      [amount, category_id, expense_date, notes, expense_id]
    );

    return NextResponse.json({
      success: true,
      message: "Expense updated",
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
};