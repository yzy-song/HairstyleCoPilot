'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { ImageUpload } from '@repo/ui/image-upload';
import { useToast } from '@repo/ui/toast';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { createClient, uploadClientPhoto } from '@/lib/api/clients';

export default function NewClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const client = await createClient({ name: name.trim(), notes: notes.trim() || undefined });
      if (photo) {
        await uploadClientPhoto(client.id, photo);
      }
      toast('Client created', 'success');
      router.push(`/clients/${client.id}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create client', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-warm-200/60 flex items-center justify-center text-warm-500 hover:text-warm-700 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-bold text-warm-900">Add Client</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUpload onFile={setPhoto} capture className="h-48 w-full" />

        <div className="bg-white rounded-2xl border border-warm-200/60 p-4 space-y-4">
          <Input
            label="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
          />

          <Textarea
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Hair preferences, allergies, etc."
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          <UserPlus className="h-4 w-4 mr-2" />
          Save Client
        </Button>
      </form>
    </div>
  );
}
