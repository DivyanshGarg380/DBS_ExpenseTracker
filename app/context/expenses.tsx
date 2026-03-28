'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

interface ExpenseContextType {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (category: string, budget: Budget) => void;
  getBudgetByCategory: (category: string) => Budget | undefined;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Mock data
const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    title: 'Coffee at Cafe',
    amount: 5.5,
    category: 'Food & Dining',
    date: new Date('2024-03-25'),
    description: 'Morning coffee',
  },
  {
    id: '2',
    title: 'Textbooks',
    amount: 120,
    category: 'Education',
    date: new Date('2024-03-24'),
    description: 'Organic Chemistry textbook',
  },
  {
    id: '3',
    title: 'Gas',
    amount: 45,
    category: 'Transportation',
    date: new Date('2024-03-23'),
  },
  {
    id: '4',
    title: 'Lunch',
    amount: 12.5,
    category: 'Food & Dining',
    date: new Date('2024-03-22'),
  },
];

const MOCK_BUDGETS: Budget[] = [
  { category: 'Food & Dining', limit: 300, spent: 180 },
  { category: 'Education', limit: 500, spent: 120 },
  { category: 'Transportation', limit: 200, spent: 45 },
  { category: 'Entertainment', limit: 150, spent: 60 },
  { category: 'Utilities', limit: 100, spent: 85 },
];

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses([newExpense, ...expenses]);

    // Update budget spent
    setBudgets(budgets.map(b => 
      b.category === expense.category 
        ? { ...b, spent: b.spent + expense.amount }
        : b
    ));
  };

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    const oldExpense = expenses.find(e => e.id === id);
    setExpenses(expenses.map(e => (e.id === id ? { ...expense, id } : e)));

    // Update budget spent
    if (oldExpense) {
      const difference = expense.amount - oldExpense.amount;
      setBudgets(budgets.map(b => 
        b.category === expense.category 
          ? { ...b, spent: Math.max(0, b.spent + difference) }
          : b
      ));
    }
  };

  const deleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    setExpenses(expenses.filter(e => e.id !== id));

    // Update budget spent
    if (expense) {
      setBudgets(budgets.map(b => 
        b.category === expense.category 
          ? { ...b, spent: Math.max(0, b.spent - expense.amount) }
          : b
      ));
    }
  };

  const addBudget = (budget: Budget) => {
    setBudgets([...budgets, budget]);
  };

  const updateBudget = (category: string, budget: Budget) => {
    setBudgets(budgets.map(b => (b.category === category ? budget : b)));
  };

  const getBudgetByCategory = (category: string) => {
    return budgets.find(b => b.category === category);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        budgets,
        addExpense,
        updateExpense,
        deleteExpense,
        addBudget,
        updateBudget,
        getBudgetByCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within ExpenseProvider');
  }
  return context;
}
