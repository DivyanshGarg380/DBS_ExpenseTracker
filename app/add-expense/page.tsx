'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  'Food & Dining', 'Education', 'Transportation', 'Entertainment',
  'Utilities', 'Shopping', 'Health & Fitness', 'Books & Media',
  'Subscriptions', 'Other',
];

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all";
const labelClass = "block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5";

export default function AddExpensePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const getCategoryId = (category: string) => {
    const map: Record<string, number> = {
      'Food & Dining': 1, 'Education': 2, 'Transportation': 3, 'Entertainment': 4,
      'Utilities': 5, 'Shopping': 6, 'Health & Fitness': 7, 'Books & Media': 8,
      'Subscriptions': 9, 'Other': 10,
    };
    return map[category] || 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category) { toast.error('Please fill in all required fields'); return; }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) { toast.error('Please enter a valid amount'); return; }

    setIsLoading(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: Number(user?.id), category_id: getCategoryId(category), amount: amountNum, expense_date: date, notes: description || title }),
      });
      const data = await res.json();
      if (data.success) { toast.success('Expense added successfully!'); router.push('/expenses'); }
      else { toast.error(data.error || 'Failed to add expense'); }
    } catch { toast.error('Failed to add expense'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">

      {/* Header */}
      <div className="bg-zinc-950/80 border-b border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="px-8 py-5">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/expenses">
              <button className="w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Add Expense</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Record a new expense to track your spending</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl px-8 py-8">
          <Card className="p-8 bg-zinc-900 border-zinc-800">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className={labelClass}>Expense Title <span className="text-emerald-500">*</span></label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Coffee at Cafe" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Amount (₹) <span className="text-emerald-500">*</span></label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Category <span className="text-emerald-500">*</span></label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Date <span className="text-emerald-500">*</span></label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Description <span className="text-zinc-600 normal-case tracking-normal font-normal">(optional)</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any notes about this expense"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold">
                  {isLoading ? 'Adding...' : 'Add Expense'}
                </Button>
                <Link href="/expenses">
                  <Button variant="outline" type="button" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                    Cancel
                  </Button>
                </Link>
              </div>

            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}