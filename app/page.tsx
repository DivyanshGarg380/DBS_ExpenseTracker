'use client';

import { useAuth } from '@/app/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white tracking-tight">
            Budget<span className="text-emerald-400">Track</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Smart finance for students
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
          Smart Student{' '}
          <span className="text-emerald-400">Budget Management</span>
        </h1>
        <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Track your expenses, manage your budget, and achieve your financial goals with AI-powered insights.
          Perfect for college students and young professionals.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-8">
              Start Free
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
            Learn more
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-800/60 transition-all duration-300 group">
            <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Track Expenses</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Easily log and categorize your spending to understand where your money goes.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-800/60 transition-all duration-300 group">
            <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
              <PieChart className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Budget Planning</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Set category budgets and get alerts when you&apos;re approaching your limits.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-800/60 transition-all duration-300 group">
            <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analytics & Insights</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Get detailed analytics and spending patterns to make better financial decisions.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-zinc-950 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to take control of your finances?
          </h2>
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
            Join thousands of students managing their money smarter with BudgetTrack.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-10">
              Get started free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-zinc-600 text-sm">
          <p>&copy; 2026 BudgetTrack. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}