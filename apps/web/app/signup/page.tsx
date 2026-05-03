'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Scissors, Store } from 'lucide-react';

export default function SignUpPage() {
  const { signUpSalon } = useAuth();
  const router = useRouter();
  const [salonName, setSalonName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUpSalon(email, password, salonName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
        <h1 className="text-[26px] font-bold text-warm-900 tracking-tight">Create your salon</h1>
        <p className="text-sm text-warm-400 mt-1.5">
          Get started with AI-powered hairstyle previews
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Salon Name"
          value={salonName}
          onChange={(e) => setSalonName(e.target.value)}
          placeholder="My Hair Salon"
          required
        />
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
          placeholder="At least 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
        />

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          <Store className="h-4 w-4 mr-2" />
          Create Account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-warm-400">
        Already have an account?{' '}
        <button
          onClick={() => router.push('/login')}
          className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
