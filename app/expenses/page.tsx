'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Trash2, Filter } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Transport: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Education: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Entertainment: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Health: 'bg-red-500/10 text-red-400 border-red-500/20',
  Shopping: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

export default function ExpensesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  useEffect(() => {
    if (!user?.id) return;
    fetchExpenses();
  }, [user]);

  const fetchExpenses = async () => {
    const res = await fetch('/api/expenses');
    const data = await res.json();
    if (data.success) {
      setExpenses(data.data.filter((e: any) => e.user_id === Number(user?.id)));
    }
  };

  const categories = Array.from(new Set(expenses.map(e => e.category)));
  const filteredExpenses = selectedCategory === 'All' ? expenses : expenses.filter(e => e.category === selectedCategory);
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const handleDelete = async (id: number) => {
    await fetch('/api/expenses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expense_id: id }),
    });
    fetchExpenses();
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">

      {/* Header */}
      <div className="bg-zinc-950/80 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Expenses</h1>
            <p className="text-zinc-500 text-sm mt-0.5">View and manage all your expenses</p>
          </div>
          <Link href="/add-expense">
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-8 space-y-6">

          {/* Summary Card */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-white tracking-tight">₹{totalAmount.toFixed(2)}</p>
                <p className="text-xs text-zinc-600 mt-1">{filteredExpenses.length} transactions</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-lg">₹</span>
              </div>
            </div>
          </Card>

          {/* Filters */}
          <Card className="p-5 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${selectedCategory === 'All' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-600 hover:text-zinc-300'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${selectedCategory === cat ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-600 hover:text-zinc-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>

          {/* Expenses List */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            {filteredExpenses.length > 0 ? (
              <div className="space-y-2">
                {filteredExpenses.map(expense => {
                  const colorClass = CATEGORY_COLORS[expense.category] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700';
                  return (
                    <div
                      key={expense.expense_id}
                      className="flex items-center justify-between p-3.5 bg-zinc-800/50 rounded-lg border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 ${colorClass}`}>
                          {expense.category}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">{expense.notes || 'Expense'}</p>
                          <div className="flex items-center gap-2 text-xs text-zinc-600 mt-0.5">
                            <span>{formatDistanceToNow(new Date(expense.expense_date), { addSuffix: true })}</span>
                            {expense.description && <><span>·</span><span className="truncate">{expense.description}</span></>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <p className="text-sm font-bold text-white">₹{Number(expense.amount).toFixed(2)}</p>
                        <button
                          onClick={() => handleDelete(expense.expense_id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <span className="text-zinc-600 text-xl">₹</span>
                </div>
                <p className="text-zinc-500 text-sm">No expenses found</p>
                <Link href="/add-expense">
                  <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm mt-1">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add your first expense
                  </Button>
                </Link>
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}