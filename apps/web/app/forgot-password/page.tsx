'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { forgotPassword } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col justify-center min-h-screen px-4 max-w-sm mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200/50">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-[26px] font-bold text-warm-900 tracking-tight mb-2">
          Check your email
        </h1>
        <p className="text-sm text-warm-400 mb-8 leading-relaxed">
          If an account with that email exists, we&apos;ve sent a reset link.
        </p>
        <Button variant="outline" onClick={() => router.push('/login')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center min-h-screen px-4 max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-5">
          <Mail className="h-7 w-7 text-primary-500" />
        </div>
        <h1 className="text-[26px] font-bold text-warm-900 tracking-tight">Reset password</h1>
        <p className="text-sm text-warm-400 mt-1.5">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          <Send className="h-4 w-4 mr-2" />
          Send Reset Link
        </Button>
      </form>

      <p className="mt-5 text-center">
        <button
          onClick={() => router.push('/login')}
          className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </button>
      </p>
    </div>
  );
}
