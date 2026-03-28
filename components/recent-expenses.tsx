'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export function RecentExpenses({ userId }: { userId: number }) {
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetchExpenses();
  }, [userId]);

  const fetchExpenses = async () => {
    const res = await fetch("/api/expenses");
    const data = await res.json();

    if (data.success) {
      const filtered = data.data.filter((e: any) => e.user_id === userId);
      setExpenses(filtered.slice(0, 5));
    }
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/expenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expense_id: id }),
    });

    fetchExpenses();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Expenses</h3>
        <Link href="/expenses">
          <Button variant="outline" size="sm">
            View all
          </Button>
        </Link>
      </div>

      {expenses.length > 0 ? (
        <div className="space-y-3">
          {expenses.map((expense: any) => (
            <div
              key={expense.expense_id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{expense.notes || "Expense"}</p>

                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(expense.expense_date), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-semibold text-lg">
                  ₹{Number(expense.amount).toFixed(2)}
                </p>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(expense.expense_id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No expenses yet.{" "}
          <Link href="/add-expense" className="text-primary font-medium">
            Add one now
          </Link>
        </div>
      )}
    </Card>
  );
}