'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { Skeleton } from '@repo/ui/skeleton';
import { useToast } from '@repo/ui/toast';
import { ImageUpload } from '@repo/ui/image-upload';
import { Badge } from '@repo/ui/badge';
import { ArrowLeft, Sparkles, ImageIcon } from 'lucide-react';
import { getConsultation, getGeneratedImages, createGeneratedImage } from '@/lib/api/consultations';
import { getTemplates } from '@/lib/api/templates';
import type { Consultation, HairstyleTemplate, GeneratedImage } from '@/lib/types';

export default function ConsultationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [templates, setTemplates] = useState<HairstyleTemplate[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<HairstyleTemplate | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);

  const loadData = useCallback(() => {
    Promise.all([getConsultation(id), getGeneratedImages(id), getTemplates(1, 50)])
      .then(([c, imgs, temps]) => {
        setConsultation(c);
        setImages(imgs);
        setTemplates(temps.data);
      })
      .catch(() => toast('Failed to load', 'error'))
      .finally(() => setLoading(false));
  }, [id, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleGenerate = async () => {
    if (!photo || !selectedTemplate) return;
    setGenerating(true);
    try {
      const result = await createGeneratedImage(
        id,
        photo,
        selectedTemplate.id,
        selectedTemplate.modelKey,
        selectedTemplate.aiParameters as Record<string, unknown>,
      );
      setImages((prev) => [result, ...prev]);
      setPhoto(null);
      setSelectedTemplate(null);
      toast('Preview generated!', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Generation failed', 'error');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!consultation) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-warm-200/60 flex items-center justify-center text-warm-500 hover:text-warm-700 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-warm-900">
            {consultation.client?.name || 'Walk-in Client'}
          </h2>
          <div className="flex gap-2 mt-0.5">
            <Badge variant={consultation.status === 'TEMPORARY' ? 'warning' : 'success'}>
              {consultation.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Generated images gallery */}
      {images.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-warm-800 mb-3 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-primary-500" />
            Generated Previews
            <span className="text-xs font-normal text-warm-400">({images.length})</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="rounded-2xl overflow-hidden border border-warm-200/60 shadow-card"
              >
                <img
                  src={img.imageUrl}
                  alt="Generated preview"
                  className="w-full aspect-square object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate new */}
      <div className="bg-white rounded-2xl border border-warm-200/60 p-4 shadow-card">
        <h3 className="text-sm font-semibold text-warm-800 mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-500" />
          Generate New Preview
        </h3>

        <ImageUpload onFile={setPhoto} capture className="h-40 w-full mb-3" />

        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t)}
              className={`shrink-0 text-center transition-all ${
                selectedTemplate?.id === t.id ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              }`}
            >
              <img
                src={t.imageUrl}
                alt={t.name}
                className={`w-16 h-16 rounded-xl object-cover mb-1 border-2 transition-all ${
                  selectedTemplate?.id === t.id
                    ? 'border-primary-500 shadow-sm shadow-primary-200'
                    : 'border-transparent'
                }`}
              />
              <p className="text-[10px] text-warm-600 w-16 truncate font-medium">{t.name}</p>
            </button>
          ))}
        </div>

        <Button className="w-full" onClick={handleGenerate} disabled={!photo || !selectedTemplate} loading={generating}>
          <Sparkles className="h-4 w-4 mr-2" />
          {generating ? 'Generating...' : 'Generate Preview'}
        </Button>
      </div>
    </div>
  );
}
