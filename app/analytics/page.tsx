'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
BarChart,
Bar,
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalExpenses: 0,
    averageExpense: 0,
    highestExpense: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    const res = await fetch(`/api/analytics?user_id=${user?.id}`);
    const data = await res.json();

    if (data.success) {
      const monthly = data.monthlyData.map((item: any) => ({
        month: `${item.month}/${item.year}`,
        amount: Number(item.total),
      }));

      const category = data.categoryData.map((item: any) => ({
        category: item.category,
        amount: Number(item.total),
      }));

      const amounts = category.map((c: any) => c.amount);
      const total = amounts.reduce((a: number, b: number) => a + b, 0);
      const avg = amounts.length ? total / amounts.length : 0;
      const max = amounts.length ? Math.max(...amounts) : 0;

      setMonthlyData(monthly);
      setCategoryData(category);
      setStats({
        totalExpenses: total,
        averageExpense: avg,
        highestExpense: max,
        totalCategories: category.length,
      });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed insights into your spending patterns
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6">
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
              <p className="text-3xl font-bold">₹{stats.totalExpenses.toFixed(2)}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Average Expense</p>
              <p className="text-3xl font-bold">₹{stats.averageExpense.toFixed(2)}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Highest Expense</p>
              <p className="text-3xl font-bold">₹{stats.highestExpense.toFixed(2)}</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Categories</p>
              <p className="text-3xl font-bold">{stats.totalCategories}</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Monthly Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Monthly Spending Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Category Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Top Categories</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Bar dataKey="amount" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};