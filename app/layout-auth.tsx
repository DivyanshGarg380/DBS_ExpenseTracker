'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/app/context/auth';
import { Sidebar } from '@/components/sidebar';
import { usePathname } from 'next/navigation';

interface LayoutAuthProps {
  children: ReactNode;
}

export function LayoutAuth({ children }: LayoutAuthProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Pages that don't require authentication
  const publicPages = ['/', '/login', '/signup'];
  const isPublicPage = publicPages.includes(pathname);

  // If not authenticated and trying to access protected page, show nothing (will redirect in page)
  if (!isAuthenticated && !isPublicPage) {
    return null;
  }

  // If authenticated and on public page, show with sidebar
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    );
  }

  // Public page without sidebar
  return <>{children}</>;
}
