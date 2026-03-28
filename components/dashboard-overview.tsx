'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingDown, TrendingUp, AlertCircle, Target } from 'lucide-react';

export function DashboardOverview({ userId }: { userId: number }) {
  const [stats, setStats] = useState({
    totalSpent: 0,
    budgetRemaining: 0,
    percentSpent: 0,
    totalBudget: 0,
    overBudgetCount: 0,
  });

  useEffect(() => {
    if (!userId) return;

    fetchData();
  }, [userId]);

  const fetchData = async () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const budgetRes = await fetch(
      `/api/budget?user_id=${userId}&month=${currentMonth}&year=${currentYear}`
    );
    const budgetData = await budgetRes.json();

    const totalBudget = budgetData.data?.total_budget || 0;
    const totalSpent = budgetData.data?.spent || 0;

    const budgetRemaining = totalBudget - totalSpent;
    const percentSpent =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const alertRes = await fetch(`/api/alerts?user_id=${userId}`);
    const alertData = await alertRes.json();

    setStats({
      totalSpent,
      budgetRemaining,
      percentSpent: Math.round(percentSpent),
      totalBudget,
      overBudgetCount: alertData.data.length,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Spent */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Spent This Month</p>
            <p className="text-3xl font-bold">₹{stats.totalSpent.toFixed(2)}</p>
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
              ₹{Math.abs(stats.budgetRemaining).toFixed(2)}
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
            <p className="text-xs text-muted-foreground mt-1">
              of ₹{stats.totalBudget.toFixed(2)}
            </p>
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <Target className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      {/* Alerts */}
      <Card className={`p-6 ${stats.overBudgetCount > 0 ? 'border-destructive/50 bg-destructive/5' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Alerts</p>
            <p className="text-3xl font-bold text-destructive">{stats.overBudgetCount}</p>
            <p className="text-xs text-muted-foreground mt-1">warnings</p>
          </div>
          <div className="bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
        </div>
      </Card>
    </div>
  );
}