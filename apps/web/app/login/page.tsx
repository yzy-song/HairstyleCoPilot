'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Scissors, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen px-4 max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200/50">
          <Scissors className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-[26px] font-bold text-warm-900 tracking-tight">Welcome back</h1>
        <p className="text-sm text-warm-400 mt-1.5">Sign in to HairstyleCoPilot</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </form>

      <div className="mt-5 text-center space-y-3">
        <p className="text-sm">
          <button
            onClick={() => router.push('/forgot-password')}
            className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Forgot password?
          </button>
        </p>
        <p className="text-sm text-warm-400">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Register your salon
          </button>
        </p>
      </div>
    </div>
  );
}
