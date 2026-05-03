'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/button';
import { Skeleton } from '@repo/ui/skeleton';
import { EmptyState } from '@repo/ui/empty-state';
import { Users, Sparkles, Palette, Camera, ChevronRight, LogOut, TrendingUp } from 'lucide-react';
import { getClients } from '@/lib/api/clients';
import { getTemplates } from '@/lib/api/templates';
import type { Client, HairstyleTemplate } from '@/lib/types';

const quickActions = [
  {
    label: 'Quick Consult',
    sub: 'Walk-in client',
    icon: Camera,
    href: '/quick-consult',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'from-amber-50 to-orange-50',
  },
  {
    label: 'New Client',
    sub: 'Add to salon',
    icon: Users,
    href: '/clients/new',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'from-emerald-50 to-teal-50',
  },
  {
    label: 'Templates',
    sub: 'Style library',
    icon: Palette,
    href: '/templates',
    gradient: 'from-violet-400 to-purple-500',
    bg: 'from-violet-50 to-purple-50',
  },
  {
    label: 'Clients',
    sub: 'All clients',
    icon: Sparkles,
    href: '/clients',
    gradient: 'from-rose-400 to-pink-500',
    bg: 'from-rose-50 to-pink-50',
  },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<HairstyleTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClients(1, 5), getTemplates(1, 5)])
      .then(([c, t]) => {
        setClients(c.data);
        setTemplates(t.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayName = user?.role === 'salon' ? 'Salon Owner' : user?.email || 'Stylist';

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-16 w-3/4" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="pt-1">
        <p className="text-sm font-medium text-warm-500">Good day,</p>
        <h2 className="text-[26px] font-bold text-warm-900 leading-tight mt-0.5 tracking-tight">
          {displayName}
        </h2>
        <p className="text-sm text-warm-400 mt-1.5 leading-relaxed">
          Help your clients discover their perfect look
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const count =
            action.label === 'Templates'
              ? templates.length
              : action.label === 'Clients'
                ? clients.length
                : null;
          return (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className={`relative flex flex-col items-center gap-2.5 bg-gradient-to-br ${action.bg} p-5 rounded-2xl border border-warm-200/60 hover:shadow-card-hover transition-all active:scale-[0.97] text-left`}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-warm-800">{action.label}</p>
                <p className="text-xs text-warm-400 mt-0.5">
                  {count !== null ? `${count} total` : action.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="flex gap-3">
        <div className="flex-1 bg-white rounded-2xl border border-warm-200/60 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
              <Users className="h-3.5 w-3.5 text-primary-500" />
            </div>
          </div>
          <p className="text-xl font-bold text-warm-900">{clients.length}</p>
          <p className="text-xs text-warm-400">Total clients</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-warm-200/60 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-accent-50 flex items-center justify-center">
              <Palette className="h-3.5 w-3.5 text-accent-500" />
            </div>
          </div>
          <p className="text-xl font-bold text-warm-900">{templates.length}</p>
          <p className="text-xs text-warm-400">Hair styles</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-warm-200/60 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            </div>
          </div>
          <p className="text-xl font-bold text-warm-900">0</p>
          <p className="text-xs text-warm-400">Today</p>
        </div>
      </div>

      {/* Recent clients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-warm-800">Recent Clients</h3>
          {clients.length > 0 && (
            <button
              onClick={() => router.push('/clients')}
              className="flex items-center gap-0.5 text-xs text-primary-600 font-medium hover:text-primary-700"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {clients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-warm-200/60 p-8">
            <EmptyState
              title="No clients yet"
              description="Add your first client to start creating AI hairstyle previews"
              action={
                <Button size="sm" onClick={() => router.push('/clients/new')}>
                  Add Your First Client
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-2">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => router.push(`/clients/${client.id}`)}
                className="w-full flex items-center gap-3.5 bg-white p-3.5 rounded-2xl border border-warm-200/60 hover:shadow-card transition-all text-left group"
              >
                {client.clientPhotoUrl ? (
                  <img
                    src={client.clientPhotoUrl}
                    alt={client.name}
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-sm font-bold text-primary-600">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-warm-800">{client.name}</p>
                  <p className="text-xs text-warm-400 truncate">
                    {client.notes || 'No notes yet'}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-warm-300 group-hover:text-warm-500 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center justify-center gap-1.5 text-xs text-warm-300 hover:text-red-500 w-full text-center py-5 transition-colors"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  );
}
