'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, BarChart3, PlusCircle, ListTodo, PieChart, Settings } from 'lucide-react';
import { useAuth } from '@/app/context/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/expenses', label: 'Expenses', icon: ListTodo },
    { href: '/add-expense', label: 'Add Expense', icon: PlusCircle },
    { href: '/budgets', label: 'Budgets', icon: PieChart },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary">BudgetTrack</h1>
        <p className="text-sm text-sidebar-foreground/70 mt-1">Smart spending</p>
      </div>

      {/* User Info */}
      {user && (
        <>
          <p className="text-sm font-semibold text-sidebar-foreground">{user.name}</p>
          <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
        </>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
