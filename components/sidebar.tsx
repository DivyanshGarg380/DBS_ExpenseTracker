'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, BarChart3, PlusCircle, ListTodo, PieChart, Settings } from 'lucide-react';
import { useAuth } from '@/app/context/auth';
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

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??';

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0">

      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <div className="text-xl font-bold text-white tracking-tight">
          Budget<span className="text-emerald-400">Track</span>
        </div>
        <p className="text-xs text-zinc-600 mt-0.5">Smart spending tracker</p>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-emerald-400">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{user.name}</p>
              <p className="text-xs text-zinc-600 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 border border-transparent hover:border-red-500/10"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log out
        </button>
      </div>

    </aside>
  );
}