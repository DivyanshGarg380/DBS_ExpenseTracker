'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function BudgetsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  useEffect(() => {
    if (!user?.id) return;
    fetchBudgets();
  }, [user]);

  const fetchBudgets = async () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const res = await fetch(`/api/budget?user_id=${user?.id}&month=${currentMonth}&year=${currentYear}`);
    const data = await res.json();
    if (data.success) {
      setBudgets([{
        category: 'Overall',
        spent: Number(data.data?.spent) || 0,
        limit: Number(data.data?.total_budget) || 0,
      }]);
    }
  };

  const handleEditClick = (category: string, limit: number) => {
    setEditingCategory(category);
    setEditAmount(limit.toString());
  };

  const handleSave = async (category: string) => {
    const newLimit = parseFloat(editAmount);
    if (isNaN(newLimit) || newLimit <= 0) { toast.error('Please enter a valid amount'); return; }
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: Number(user?.id), month: currentMonth, year: currentYear, total_budget: newLimit }),
    });
    toast.success('Budget updated!');
    setEditingCategory(null);
    fetchBudgets();
  };

  const handleCancel = () => { setEditingCategory(null); setEditAmount(''); };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">

      {/* Header */}
      <div className="bg-zinc-950/80 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="px-8 py-5">
          <h1 className="text-2xl font-bold text-white tracking-tight">Budget Management</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Set and monitor your spending limits by category</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-8 space-y-4">

          {budgets.map(budget => {
            const percentSpent = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
            const isOverBudget = budget.spent > budget.limit;
            const isWarning = percentSpent >= 80 && !isOverBudget;

            return (
              <Card
                key={budget.category}
                className={`p-6 bg-zinc-900 border-zinc-800 ${isOverBudget ? 'border-red-500/30' : isWarning ? 'border-amber-500/30' : ''}`}
              >
                <div className="space-y-5">

                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Budget</p>
                      <h3 className="text-lg font-semibold text-white">{budget.category}</h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        ₹{budget.spent.toFixed(2)} spent of ₹{budget.limit.toFixed(2)}
                      </p>
                    </div>
                    {isOverBudget && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-xs font-medium text-red-400">Over budget</span>
                      </div>
                    )}
                    {isWarning && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-medium text-amber-400">Near limit</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-400' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.min(percentSpent, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-600 mt-1.5">{percentSpent.toFixed(0)}% used</p>
                  </div>

                  {/* Edit Section */}
                  <div className="flex items-end gap-3">
                    {editingCategory === budget.category ? (
                      <>
                        <div className="flex-1">
                          <label className="block text-xs text-zinc-500 font-medium mb-1.5">New Budget Limit</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                          />
                        </div>
                        <Button size="sm" onClick={() => handleSave(budget.category)} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold">
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel} className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(budget.category, budget.limit)} className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white text-xs">
                        Edit Budget
                      </Button>
                    )}
                  </div>

                </div>
              </Card>
            );
          })}

          {/* Tips Card */}
          <Card className="p-6 bg-zinc-900 border-zinc-800 border-emerald-500/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Budget Tips</h4>
                <ul className="text-sm text-zinc-500 mt-2 space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> Set realistic budgets based on your income and priorities</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> Review your budgets monthly and adjust as needed</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> Keep track of expenses throughout the month to stay on budget</li>
                  <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">•</span> Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
                </ul>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}