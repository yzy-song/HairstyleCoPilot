'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, Users, Palette, User, Sparkles, Scissors } from 'lucide-react';
import { Spinner } from '@repo/ui/spinner';

const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/templates', label: 'Styles', icon: Palette },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-warm-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-warm-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-warm-200/60">
        <div className="flex items-center justify-between max-w-lg mx-auto px-4 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center shadow-sm">
              <Scissors className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-warm-900 leading-tight">
                HairstyleCoPilot
              </h1>
            </div>
          </div>
          <button
            onClick={() => router.push('/quick-consult')}
            className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Quick
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-24 max-w-lg mx-auto w-full px-4 py-5">
        {children}
      </main>

      {/* Bottom tab navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-xl border-t border-warm-200/60 shadow-nav">
        <div className="flex items-center justify-around max-w-lg mx-auto h-16 pb-safe">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = pathname.startsWith(tab.href);
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-1 min-w-[64px] transition-all ${
                  active ? 'text-primary-600' : 'text-warm-400 hover:text-warm-600'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
                {active && (
                  <span className="absolute -top-px left-1/4 right-1/4 h-0.5 bg-primary-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
