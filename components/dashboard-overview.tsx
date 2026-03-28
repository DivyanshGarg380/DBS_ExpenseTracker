'use client';

import { useExpenses } from '@/app/context/expenses';
import { Card } from '@/components/ui/card';
import { TrendingDown, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { useMemo } from 'react';

export function DashboardOverview() {
  const { expenses, budgets } = useExpenses();

  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const budgetRemaining = totalBudget - totalSpent;
    const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Find budgets over limit
    const overBudget = budgets.filter(b => b.spent > b.limit);

    return {
      totalSpent: Math.round(totalSpent * 100) / 100,
      budgetRemaining: Math.round(budgetRemaining * 100) / 100,
      percentSpent: Math.round(percentSpent),
      totalBudget,
      overBudgetCount: overBudget.length,
    };
  }, [expenses, budgets]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Spent */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Spent This Month</p>
            <p className="text-3xl font-bold">${stats.totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-destructive/10 p-3 rounded-lg">
            <TrendingDown className="w-6 h-6 text-destructive" />
          </div>
        </div>
      </Card>

      {/* Budget Remaining */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Budget Remaining</p>
            <p className={`text-3xl font-bold ${stats.budgetRemaining >= 0 ? 'text-accent' : 'text-destructive'}`}>
              ${Math.abs(stats.budgetRemaining).toFixed(2)}
            </p>
          </div>
          <div className={`${stats.budgetRemaining >= 0 ? 'bg-accent/10' : 'bg-destructive/10'} p-3 rounded-lg`}>
            <TrendingUp className={`w-6 h-6 ${stats.budgetRemaining >= 0 ? 'text-accent' : 'text-destructive'}`} />
          </div>
        </div>
      </Card>

      {/* Budget Usage */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Budget Used</p>
            <p className="text-3xl font-bold">{stats.percentSpent}%</p>
            <p className="text-xs text-muted-foreground mt-1">of ${stats.totalBudget.toFixed(2)}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <Target className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      {/* Budget Alerts */}
      <Card className={`p-6 ${stats.overBudgetCount > 0 ? 'border-destructive/50 bg-destructive/5' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Over Budget</p>
            <p className="text-3xl font-bold text-destructive">{stats.overBudgetCount}</p>
            <p className="text-xs text-muted-foreground mt-1">categories</p>
          </div>
          <div className="bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
        </div>
      </Card>
    </div>
  );
}
