'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { LockKeyhole, CheckCircle2, ArrowRight } from 'lucide-react';
import { resetPassword } from '@/lib/api/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col justify-center min-h-screen px-4 max-w-sm mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-200/50">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-[26px] font-bold text-warm-900 tracking-tight mb-2">
          Password reset
        </h1>
        <p className="text-sm text-warm-400 mb-8">
          Your password has been reset successfully.
        </p>
        <Button onClick={() => router.push('/login')} size="lg">
          <ArrowRight className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center min-h-screen px-4 max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-5">
          <LockKeyhole className="h-7 w-7 text-primary-500" />
        </div>
        <h1 className="text-[26px] font-bold text-warm-900 tracking-tight">New password</h1>
        <p className="text-sm text-warm-400 mt-1.5">Enter your new password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
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
          Reset Password
        </Button>
      </form>
    </div>
  );
}
