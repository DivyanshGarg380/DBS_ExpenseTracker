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
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-emerald-400 animate-spin" />
          <p className="text-zinc-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 min-h-screen">

      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md bg-zinc-950/80">
        <div className="px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-0.5">
              Welcome back, <span className="text-emerald-400 font-medium">{firstName}</span> — here&apos;s your financial overview.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-8 space-y-8">

          {/* Overview Cards */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Overview</p>
            <DashboardOverview userId={Number(user!.id)} />
          </div>

          {/* Charts and Recent */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Breakdown</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <CategoryBreakdown userId={Number(user?.id)} />
              </div>
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <RecentExpenses userId={Number(user?.id)} />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}