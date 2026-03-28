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
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl px-8 py-6 space-y-6">
          {/* Profile Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{user?.name || 'User'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{user?.email || 'No email'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Get alerts about budget overages</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div>
                  <p className="font-medium">Monthly Reports</p>
                  <p className="text-sm text-muted-foreground">Receive monthly spending summary</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Account Section */}
          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <h2 className="text-lg font-semibold mb-6">Account</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Signing out will end your current session. You&apos;ll need to log in again to access your account.
              </p>
              <Button
                onClick={handleLogout}
                disabled={isLoading}
                className="bg-destructive text-destructive-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isLoading ? 'Logging out...' : 'Sign out'}
              </Button>
            </div>
          </Card>

          {/* Info Section */}
          <Card className="p-6 border-primary/20 bg-primary/5">
            <h3 className="font-semibold mb-3">About BudgetTrack</h3>
            <p className="text-sm text-muted-foreground">
              BudgetTrack is a smart budget management app designed specifically for students and young professionals.
              Track your expenses, manage your budgets, and achieve your financial goals with ease.
            </p>
            <div className="mt-4 pt-4 border-t border-primary/20">
              <p className="text-xs text-muted-foreground">
                Version 1.0.0 • &copy; 2026 BudgetTrack
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
