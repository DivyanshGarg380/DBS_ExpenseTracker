'use client';

import { useExpenses } from '@/app/context/expenses';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

export function CategoryBreakdown() {
  const { expenses, budgets } = useExpenses();

  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: Math.round(amount * 100) / 100,
    }));
  }, [expenses]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Spending by Category</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No expenses yet. Add your first expense to see the breakdown.
        </div>
      )}
    </Card>
  );
}
