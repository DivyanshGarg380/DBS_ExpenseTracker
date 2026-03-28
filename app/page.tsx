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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">BudgetTrack</div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
          Smart Student <span className="text-primary">Budget Management</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Track your expenses, manage your budget, and achieve your financial goals with AI-powered insights.
          Perfect for college students and young professionals.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground">
              Start Free
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Learn more
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-8 border border-border">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
            <p className="text-muted-foreground">
              Easily log and categorize your spending to understand where your money goes.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border">
            <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Budget Planning</h3>
            <p className="text-muted-foreground">
              Set category budgets and get alerts when you&apos;re approaching your limits.
            </p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-muted-foreground">
              Get detailed analytics and spending patterns to make better financial decisions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to take control of your finances?</h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of students managing their money smarter with BudgetTrack.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Get started free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>&copy; 2026 BudgetTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
