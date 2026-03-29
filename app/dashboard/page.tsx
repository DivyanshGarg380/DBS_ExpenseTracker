'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardOverview } from '@/components/dashboard-overview';
import { CategoryBreakdown } from '@/components/category-breakdown';
import { RecentExpenses } from '@/components/recent-expenses';

export default function DashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your financial overview.</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6">
          {/* Overview Cards */}
          <DashboardOverview userId={Number(user!.id)} />

          {/* Charts and Recent */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CategoryBreakdown userId={Number(user?.id)} />
            </div>
            <div>
              <RecentExpenses userId={Number(user?.id)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
