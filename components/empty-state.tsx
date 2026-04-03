'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <Card className="p-12 bg-zinc-900 border-zinc-800">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 w-14 h-14 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-500 mb-6 max-w-xs leading-relaxed">{description}</p>
        {actionLabel && actionHref && (
          <Link href={actionHref}>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm">
              {actionLabel}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}