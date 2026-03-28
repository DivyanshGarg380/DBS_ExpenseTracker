'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/app/context/auth';
import { ExpenseProvider } from '@/app/context/expenses';
import { LayoutAuth } from '@/app/layout-auth';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <LayoutAuth>{children}</LayoutAuth>
      </ExpenseProvider>
    </AuthProvider>
  );
}
