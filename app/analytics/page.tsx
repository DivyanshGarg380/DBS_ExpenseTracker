'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useExpenses } from '@/app/context/expenses';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { expenses } = useExpenses();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Calculate monthly data
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

      months[monthKey] = (months[monthKey] || 0) + expense.amount;
    });

    return Object.entries(months)
      .map(([month, amount]) => ({
        month,
        amount: Math.round(amount * 100) / 100,
      }))
      .slice(-6);
  }, [expenses]);

  // Calculate category comparison
  const categoryComparison = useMemo(() => {
    const categoryTotals: Record<string, { spent: number; budget: number }> = {};

    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = { spent: 0, budget: 0 };
      }
      categoryTotals[expense.category].spent += expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([category, { spent }]) => ({
        category,
        amount: Math.round(spent * 100) / 100,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [expenses]);

  // Calculate stats
  const stats = useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalExpenses: 0,
        averageExpense: 0,
        highestExpense: 0,
        totalCategories: 0,
      };
    }

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const averageExpense = totalExpenses / expenses.length;
    const highestExpense = Math.max(...expenses.map(e => e.amount));
    const totalCategories = new Set(expenses.map(e => e.category)).size;

    return {
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      averageExpense: Math.round(averageExpense * 100) / 100,
      highestExpense: Math.round(highestExpense * 100) / 100,
      totalCategories,
    };
  }, [expenses]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed insights into your spending patterns</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                  <p className="text-3xl font-bold">${stats.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Expense</p>
                  <p className="text-3xl font-bold">${stats.averageExpense.toFixed(2)}</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Highest Expense</p>
                  <p className="text-3xl font-bold">${stats.highestExpense.toFixed(2)}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Categories</p>
                  <p className="text-3xl font-bold">{stats.totalCategories}</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Monthly Spending Trend</h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--color-primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--color-primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </Card>

            {/* Top Categories */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Top Spending Categories</h3>
              {categoryComparison.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="amount" fill="hsl(var(--color-primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </Card>
          </div>

          {/* Insights */}
          <Card className="p-6 border-primary/20 bg-primary/5">
            <h3 className="text-lg font-semibold mb-4">Financial Insights</h3>
            <div className="space-y-2 text-sm">
              {expenses.length > 0 ? (
                <>
                  <p className="text-muted-foreground">
                    You have recorded <span className="font-semibold text-foreground">{expenses.length}</span> expenses
                    across <span className="font-semibold text-foreground">{stats.totalCategories}</span> categories.
                  </p>
                  <p className="text-muted-foreground">
                    Your average expense is <span className="font-semibold text-foreground">${stats.averageExpense.toFixed(2)}</span>,
                    with your highest single expense being <span className="font-semibold text-foreground">${stats.highestExpense.toFixed(2)}</span>.
                  </p>
                  <p className="text-muted-foreground">
                    Keep tracking your expenses regularly to maintain better control of your finances and meet your financial goals.
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Start adding expenses to see analytics and insights about your spending patterns.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
