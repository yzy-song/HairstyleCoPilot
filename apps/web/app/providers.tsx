'use client';

import { AuthProvider } from '@/lib/auth/auth-context';
import { ToastProvider } from '@repo/ui/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
