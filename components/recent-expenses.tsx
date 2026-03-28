'use client';

import { useExpenses } from '@/app/context/expenses';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';

export function RecentExpenses() {
  const { expenses, deleteExpense } = useExpenses();

  const recentExpenses = useMemo(() => {
    return expenses.slice(0, 5);
  }, [expenses]);

  const handleDelete = (id: string) => {
    deleteExpense(id);
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

      {recentExpenses.length > 0 ? (
        <div className="space-y-3">
          {recentExpenses.map(expense => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium">{expense.title}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(expense.date), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-lg">${expense.amount.toFixed(2)}</p>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(expense.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No expenses yet. <Link href="/add-expense" className="text-primary font-medium">Add one now</Link>
        </div>
      )}
    </Card>
  );
}
