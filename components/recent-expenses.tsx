'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-amber-500/10 text-amber-400',
  Transport: 'bg-blue-500/10 text-blue-400',
  Education: 'bg-purple-500/10 text-purple-400',
  Entertainment: 'bg-pink-500/10 text-pink-400',
  Health: 'bg-red-500/10 text-red-400',
  Shopping: 'bg-cyan-500/10 text-cyan-400',
};

export function RecentExpenses({ userId }: { userId: number }) {
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetchExpenses();
  }, [userId]);

  const fetchExpenses = async () => {
    const res = await fetch('/api/expenses');
    const data = await res.json();

    if (data.success && Array.isArray(data.data)) {
      const filtered = data.data.filter((e: any) => e.user_id === userId);
      setExpenses(filtered.slice(0, 5));
    } else {
      setExpenses([]);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/expenses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expense_id: id }),
    });
    fetchExpenses();
  };

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">History</p>
          <h3 className="text-lg font-semibold text-white">Recent Expenses</h3>
        </div>
        <Link href="/expenses">
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs"
          >
            View all
          </Button>
        </Link>
      </div>

      {expenses.length > 0 ? (
        <div className="space-y-2">
          {expenses.map((expense: any) => {
            const colorClass = CATEGORY_COLORS[expense.category] ?? 'bg-zinc-800 text-zinc-400';
            return (
              <div
                key={expense.expense_id}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md shrink-0 ${colorClass}`}>
                    {expense.category}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">
                      {expense.notes || 'Expense'}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {expense.expense_date
                        ? formatDistanceToNow(new Date(expense.expense_date), { addSuffix: true })
                        : 'Unknown date'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <p className="text-sm font-semibold text-white">
                    ₹{Number(expense.amount || 0).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDelete(expense.expense_id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-56 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600 text-xl">₹</span>
          </div>
          <p className="text-zinc-500 text-sm">No expenses yet.</p>
          <Link href="/add-expense" className="text-emerald-400 text-xs font-medium hover:text-emerald-300">
            Add one now →
          </Link>
        </div>
      )}
    </Card>
  );
}