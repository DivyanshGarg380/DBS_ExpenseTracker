'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useExpenses } from '@/app/context/expenses';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Target } from 'lucide-react';
import { toast } from 'sonner';

export default function BudgetsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { budgets, updateBudget } = useExpenses();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleEditClick = (category: string, limit: number) => {
    setEditingCategory(category);
    setEditAmount(limit.toString());
  };

  const handleSave = (category: string, currentBudget: typeof budgets[0]) => {
    const newLimit = parseFloat(editAmount);
    if (isNaN(newLimit) || newLimit <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    updateBudget(category, {
      ...currentBudget,
      limit: newLimit,
    });

    setEditingCategory(null);
    toast.success('Budget updated!');
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setEditAmount('');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground mt-1">Set and monitor your spending limits by category</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          <div className="space-y-4">
            {budgets.map(budget => {
              const percentSpent = (budget.spent / budget.limit) * 100;
              const isOverBudget = budget.spent > budget.limit;
              const isWarning = percentSpent >= 80;

              return (
                <Card
                  key={budget.category}
                  className={`p-6 ${isOverBudget ? 'border-destructive/50 bg-destructive/5' : ''} ${
                    isWarning && !isOverBudget ? 'border-orange-500/50 bg-orange-500/5' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{budget.category}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Spent: ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                        </p>
                      </div>
                      {isOverBudget && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-destructive" />
                          <span className="text-sm font-medium text-destructive">Over budget</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isOverBudget ? 'bg-destructive' : isWarning ? 'bg-orange-500' : 'bg-accent'
                          }`}
                          style={{ width: `${Math.min(percentSpent, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{percentSpent.toFixed(0)}% spent</p>
                    </div>

                    {/* Edit Section */}
                    <div className="flex items-end gap-3">
                      {editingCategory === budget.category ? (
                        <>
                          <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">New Budget Limit</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleSave(budget.category, budget)}
                            className="bg-primary text-primary-foreground"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(budget.category, budget.limit)}
                        >
                          Edit Budget
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Info Card */}
          <Card className="p-6 mt-6 border-primary/20 bg-primary/5">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Budget Tips</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Set realistic budgets based on your income and priorities</li>
                  <li>• Review your budgets monthly and adjust as needed</li>
                  <li>• Keep track of expenses throughout the month to stay on budget</li>
                  <li>• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
