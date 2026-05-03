'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@repo/ui/skeleton';
import { EmptyState } from '@repo/ui/empty-state';
import { Fab } from '@repo/ui/fab';
import { Search, ChevronRight, UserPlus } from 'lucide-react';
import { getClients } from '@/lib/api/clients';
import type { Client } from '@/lib/types';

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClients(1, 50)
      .then((res) => setClients(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(
    (c) =>
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.notes && c.notes.toLowerCase().includes(search.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-warm-900">Clients</h2>
        <span className="text-xs font-medium text-warm-400 bg-warm-100 px-2.5 py-1 rounded-full">
          {clients.length} total
        </span>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-warm-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-warm-200/60 bg-white text-sm text-warm-800 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200/60 p-8">
          <EmptyState
            title={search ? 'No matches found' : 'No clients yet'}
            description={
              search
                ? 'Try a different search term'
                : 'Add your first client to begin their style journey'
            }
            action={
              !search ? (
                <button
                  onClick={() => router.push('/clients/new')}
                  className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Client
                </button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => (
            <button
              key={client.id}
              onClick={() => router.push(`/clients/${client.id}`)}
              className="w-full flex items-center gap-3.5 bg-white p-3.5 rounded-2xl border border-warm-200/60 hover:shadow-card transition-all text-left group"
            >
              {client.clientPhotoUrl ? (
                <img
                  src={client.clientPhotoUrl}
                  alt={client.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center text-base font-bold text-primary-600 shrink-0">
                  {client.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-warm-800">{client.name}</p>
                <p className="text-xs text-warm-400 truncate">
                  {client.notes || 'No notes'}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-warm-300 group-hover:text-warm-500 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      )}

      <Fab onClick={() => router.push('/clients/new')} />
    </div>
  );
}
