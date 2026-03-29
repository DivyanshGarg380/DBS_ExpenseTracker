'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Trash2, Filter } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function ExpensesPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  useEffect(() => {
    if(!user?.id) return;
    fetchExpenses();
  }, [user]);

  const fetchExpenses = async () => {
    const res = await fetch("/api/expenses");
    const data = await res.json();

    if(data.success) {
      const userExpenses = data.data.filter(
        (e: any) => e.user_id === Number(user?.id)
      );
      setExpenses(userExpenses);
    }
  }

  const categories = Array.from(new Set(expenses.map(e => e.category)));
  const filteredExpenses = selectedCategory === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === selectedCategory);

  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const handleDelete = async (id: number) => {
    await fetch("/api/expenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expense_id: id }),
    });

    fetchExpenses();
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground mt-1">View and manage all your expenses</p>
          </div>
          <Link href="/add-expense">
            <Button className="bg-primary text-primary-foreground">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 space-y-6">
          {/* Summary Card */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-4xl font-bold text-primary">${totalAmount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">{filteredExpenses.length} transactions</p>
          </Card>

          {/* Filters */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('All')}
                size="sm"
              >
                All
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  size="sm"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </Card>

          {/* Expenses List */}
          <Card className="p-6">
            {filteredExpenses.length > 0 ? (
              <div className="space-y-2">
                {filteredExpenses.map(expense => (
                  <div
                    key={expense.expense_id}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{expense.notes || "Expense"}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                              {expense.category}
                            </span>
                            <span>{formatDistanceToNow(new Date(expense.expense_date), { addSuffix: true })}</span>
                            {expense.description && (
                              <>
                                <span>•</span>
                                <span>{expense.description}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold text-foreground">₹{Number(expense.amount).toFixed(2)}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(expense.expense_id)}
                        className="text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No expenses found</p>
                <Link href="/add-expense">
                  <Button className="bg-primary text-primary-foreground">
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
