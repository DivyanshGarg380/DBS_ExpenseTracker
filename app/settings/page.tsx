'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, User, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">

      {/* Header */}
      <div className="bg-zinc-950/80 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="px-8 py-5">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/dashboard">
              <button className="w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage your account and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl px-8 py-8 space-y-4">

          {/* Profile Section */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Profile Information</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Full Name</label>
                <div className="flex items-center gap-3 p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                  <User className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-sm font-medium text-zinc-200">{user?.name || 'User'}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email Address</label>
                <div className="flex items-center gap-3 p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                  <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-sm font-medium text-zinc-200">{user?.email || 'No email'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Preferences</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3.5 bg-zinc-800/50 border border-zinc-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-zinc-200">Email Notifications</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Get alerts about budget overages</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-400 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-3.5 bg-zinc-800/50 border border-zinc-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-zinc-200">Monthly Reports</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Receive monthly spending summary</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-400 cursor-pointer" />
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 bg-zinc-900 border-zinc-800 border-red-500/20">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Account</p>
            <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
              Signing out will end your current session. You&apos;ll need to log in again to access your account.
            </p>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 font-semibold"
              variant="outline"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoading ? 'Logging out...' : 'Sign out'}
            </Button>
          </Card>

          {/* About */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-2">About BudgetTrack</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              BudgetTrack is a smart budget management app designed specifically for students and young professionals.
              Track your expenses, manage your budgets, and achieve your financial goals with ease.
            </p>
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-600">Version 1.0.0 · © 2026 BudgetTrack</p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}