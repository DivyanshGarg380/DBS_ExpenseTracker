'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/app/context/auth';
import { LayoutAuth } from '@/app/layout-auth';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
        <LayoutAuth>{children}</LayoutAuth>
    </AuthProvider>
  );
}
