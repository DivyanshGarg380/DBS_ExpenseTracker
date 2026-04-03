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
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const budgetRes = await fetch(
        `/api/budget?user_id=${userId}&month=${currentMonth}&year=${currentYear}`
      );
      const budgetData = await budgetRes.json();

      const totalBudget = Number(budgetData?.data?.total_budget) || 0;
      const totalSpent = Number(budgetData?.data?.spent) || 0;
      const budgetRemaining = totalBudget - totalSpent;
      const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      const alertRes = await fetch(`/api/alerts?user_id=${userId}`);
      const alertData = await alertRes.json();

      setStats({
        totalSpent,
        budgetRemaining,
        percentSpent: Math.round(percentSpent),
        totalBudget,
        overBudgetCount: alertData?.data?.length || 0,
      });
    } catch (err) {
      console.error('Dashboard error:', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Spent */}
      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Total Spent</p>
            <p className="text-2xl font-bold text-white">₹{stats.totalSpent.toFixed(2)}</p>
            <p className="text-xs text-zinc-600 mt-1">this month</p>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/10">
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
        </div>
      </Card>

      {/* Budget Remaining */}
      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Remaining</p>
            <p className={`text-2xl font-bold ${stats.budgetRemaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ₹{Math.abs(stats.budgetRemaining).toFixed(2)}
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              {stats.budgetRemaining >= 0 ? 'available' : 'over budget'}
            </p>
          </div>
          <div className={`p-3 rounded-lg border ${stats.budgetRemaining >= 0 ? 'bg-emerald-500/10 border-emerald-500/10' : 'bg-red-500/10 border-red-500/10'}`}>
            <TrendingUp className={`w-5 h-5 ${stats.budgetRemaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>
        </div>
      </Card>

      {/* Budget Usage */}
      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Budget Used</p>
            <p className="text-2xl font-bold text-white">{stats.percentSpent}%</p>
            <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${stats.percentSpent >= 90 ? 'bg-red-400' : stats.percentSpent >= 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                style={{ width: `${Math.min(stats.percentSpent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-zinc-600 mt-1">of ₹{stats.totalBudget.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700">
            <Target className="w-5 h-5 text-zinc-400" />
          </div>
        </div>
      </Card>

      {/* Alerts */}
      <Card className={`p-6 bg-zinc-900 border-zinc-800 ${stats.overBudgetCount > 0 ? 'border-red-500/30' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Alerts</p>
            <p className={`text-2xl font-bold ${stats.overBudgetCount > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
              {stats.overBudgetCount}
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              {stats.overBudgetCount > 0 ? 'need attention' : 'all clear'}
            </p>
          </div>
          <div className={`p-3 rounded-lg border ${stats.overBudgetCount > 0 ? 'bg-red-500/10 border-red-500/10' : 'bg-zinc-800 border-zinc-700'}`}>
            <AlertCircle className={`w-5 h-5 ${stats.overBudgetCount > 0 ? 'text-red-400' : 'text-zinc-500'}`} />
          </div>
        </div>
      </Card>

    </div>
  );
}