'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

const tooltipStyle = {
  contentStyle: {
    background: '#18181b',
    border: '1px solid #3f3f46',
    borderRadius: '8px',
    color: '#f4f4f5',
    fontSize: '13px',
  },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
};

export default function AnalyticsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalExpenses: 0, averageExpense: 0, highestExpense: 0, totalCategories: 0 });

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    const res = await fetch(`/api/analytics?user_id=${user?.id}`);
    const data = await res.json();
    if (data.success) {
      const monthly = data.monthlyData.map((item: any) => ({ month: `${item.month}/${item.year}`, amount: Number(item.total) }));
      const category = data.categoryData.map((item: any) => ({ category: item.category, amount: Number(item.total) }));
      const amounts = category.map((c: any) => c.amount);
      const total = amounts.reduce((a: number, b: number) => a + b, 0);
      setMonthlyData(monthly);
      setCategoryData(category);
      setStats({ totalExpenses: total, averageExpense: amounts.length ? total / amounts.length : 0, highestExpense: amounts.length ? Math.max(...amounts) : 0, totalCategories: category.length });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">

      {/* Header */}
      <div className="bg-zinc-950/80 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="px-8 py-5">
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Detailed insights into your spending patterns</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-8 space-y-8">

          {/* Stats */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Overview</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Expenses', value: `₹${stats.totalExpenses.toFixed(2)}` },
                { label: 'Average Expense', value: `₹${stats.averageExpense.toFixed(2)}` },
                { label: 'Highest Expense', value: `₹${stats.highestExpense.toFixed(2)}` },
                { label: 'Categories', value: stats.totalCategories },
              ].map((s, i) => (
                <Card key={i} className="p-5 bg-zinc-900 border-zinc-800">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">{s.label}</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Breakdown</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Monthly Trend */}
              <Card className="p-6 bg-zinc-900 border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Trend</p>
                <h3 className="text-base font-semibold text-white mb-6">Monthly Spending</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="month" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip {...tooltipStyle} formatter={(value) => `₹${value}`} />
                    <Line type="monotone" dataKey="amount" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399', r: 3 }} activeDot={{ r: 5, fill: '#34d399' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Category Chart */}
              <Card className="p-6 bg-zinc-900 border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Categories</p>
                <h3 className="text-base font-semibold text-white mb-6">Top Spending Areas</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="category" angle={-35} textAnchor="end" height={70} tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip {...tooltipStyle} formatter={(value) => `₹${value}`} />
                    <Bar dataKey="amount" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}