'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { Skeleton } from '@repo/ui/skeleton';
import { ConfirmDialog } from '@repo/ui/confirm-dialog';
import { useToast } from '@repo/ui/toast';
import { Sparkles, Trash2, ArrowLeft, User, Camera } from 'lucide-react';
import { getClient, deleteClient } from '@/lib/api/clients';
import { createConsultation } from '@/lib/api/consultations';
import type { Client } from '@/lib/types';

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [consulting, setConsulting] = useState(false);

  const loadClient = useCallback(() => {
    getClient(id)
      .then(setClient)
      .catch(() => toast('Failed to load client', 'error'))
      .finally(() => setLoading(false));
  }, [id, toast]);

  useEffect(() => {
    loadClient();
  }, [loadClient]);

  const handleConsult = async () => {
    setConsulting(true);
    try {
      const consultation = await createConsultation(id);
      router.push(`/consultations/${consultation.id}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create consultation', 'error');
    } finally {
      setConsulting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteClient(id);
      toast('Client deleted', 'success');
      router.push('/clients');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Delete failed', 'error');
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  if (!client) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-warm-200/60 flex items-center justify-center text-warm-500 hover:text-warm-700 hover:border-warm-300 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-bold text-warm-900 flex-1 truncate">{client.name}</h2>
        <button
          onClick={() => setDeleteOpen(true)}
          className="w-9 h-9 rounded-xl bg-white border border-warm-200/60 flex items-center justify-center text-warm-300 hover:text-red-500 hover:border-red-200 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Photo */}
      {client.clientPhotoUrl ? (
        <div className="relative mb-5">
          <img
            src={client.clientPhotoUrl}
            alt={client.name}
            className="w-full h-72 object-cover rounded-3xl shadow-card"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent rounded-b-3xl" />
        </div>
      ) : (
        <div className="w-full h-56 bg-gradient-to-br from-warm-100 to-warm-200 rounded-3xl mb-5 flex flex-col items-center justify-center gap-2 border border-warm-200/60">
          <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center">
            <Camera className="h-7 w-7 text-warm-300" />
          </div>
          <p className="text-sm font-medium text-warm-400">No photo yet</p>
        </div>
      )}

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-warm-200/60 p-4 mb-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <User className="h-4 w-4 text-primary-500" />
          </div>
          <div>
            <p className="text-xs text-warm-400">Name</p>
            <p className="text-sm font-semibold text-warm-800">{client.name}</p>
          </div>
        </div>
        {client.notes && (
          <div className="pt-3 border-t border-warm-100">
            <p className="text-xs text-warm-400 mb-0.5">Notes</p>
            <p className="text-sm text-warm-600 leading-relaxed">{client.notes}</p>
          </div>
        )}
      </div>

      {/* Start consultation button */}
      <Button className="w-full" size="lg" onClick={handleConsult} loading={consulting}>
        <Sparkles className="h-4 w-4 mr-2" />
        Start AI Consultation
      </Button>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Client"
        message={`Are you sure you want to delete ${client.name}? This will not affect past consultations.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
