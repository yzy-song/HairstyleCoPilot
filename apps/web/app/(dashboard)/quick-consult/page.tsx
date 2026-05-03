'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { Spinner } from '@repo/ui/spinner';
import { ImageUpload } from '@repo/ui/image-upload';
import { useToast } from '@repo/ui/toast';
import { ArrowLeft, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { createQuickConsult, createGeneratedImage } from '@/lib/api/consultations';
import { getTemplates } from '@/lib/api/templates';
import type { HairstyleTemplate, Consultation } from '@/lib/types';

export default function QuickConsultPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<'upload' | 'template' | 'generating' | 'result'>('upload');
  const [photo, setPhoto] = useState<File | null>(null);
  const [templates, setTemplates] = useState<HairstyleTemplate[]>([]);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<HairstyleTemplate | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  useEffect(() => {
    getTemplates(1, 50).then((res) => setTemplates(res.data)).catch(() => {});
  }, []);

  const handlePhotoReady = (file: File) => {
    setPhoto(file);
    setStep('template');
  };

  const handleGenerate = async () => {
    if (!photo || !selectedTemplate) return;
    setStep('generating');

    try {
      let cons = consultation;
      if (!cons) {
        cons = await createQuickConsult();
        setConsultation(cons);
      }

      const result = await createGeneratedImage(
        cons.id,
        photo,
        selectedTemplate.id,
        selectedTemplate.modelKey,
        selectedTemplate.aiParameters as Record<string, unknown>,
      );

      setResultUrl(result.imageUrl);
      setStep('result');
      toast('Image generated!', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Generation failed', 'error');
      setStep('template');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-warm-200/60 flex items-center justify-center text-warm-500 hover:text-warm-700 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-bold text-warm-900">Quick Consult</h2>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-5">
        {['Photo', 'Style', 'Generate'].map((label, i) => {
          const stepIdx =
            step === 'upload' ? 0 : step === 'template' ? 1 : step === 'generating' ? 2 : 3;
          const isDone = i < stepIdx;
          const isCurrent = i === stepIdx && stepIdx < 3;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                      ? 'bg-primary-500 text-white'
                      : 'bg-warm-100 text-warm-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium ${
                  isDone ? 'text-emerald-600' : isCurrent ? 'text-primary-600' : 'text-warm-300'
                }`}
              >
                {label}
              </span>
              {i < 2 && <div className="w-6 h-px bg-warm-200" />}
            </div>
          );
        })}
      </div>

      {/* Upload step */}
      {(step === 'upload' || step === 'template') && (
        <div className="mb-4">
          <ImageUpload
            onFile={handlePhotoReady}
            capture
            className={step === 'upload' ? 'h-56 w-full' : 'h-32 w-full'}
          />
        </div>
      )}

      {/* Template picker */}
      {step === 'template' && (
        <>
          <h3 className="text-sm font-semibold text-warm-800 mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-500" />
            Choose a hairstyle
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`text-left bg-white rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedTemplate?.id === t.id
                    ? 'border-primary-500 shadow-md shadow-primary-100'
                    : 'border-warm-200/60 hover:border-warm-300'
                }`}
              >
                <img src={t.imageUrl} alt={t.name} className="w-full h-36 object-cover" />
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-warm-800">{t.name}</p>
                  {t.description && (
                    <p className="text-[10px] text-warm-400 mt-0.5 line-clamp-1">{t.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
          <Button className="w-full" size="lg" onClick={handleGenerate} disabled={!selectedTemplate}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Preview
          </Button>
        </>
      )}

      {/* Generating */}
      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-5">
            <Spinner size="lg" />
          </div>
          <p className="text-sm font-semibold text-warm-800">Generating preview...</p>
          <p className="text-xs text-warm-400 mt-1">This usually takes up to 60 seconds</p>
        </div>
      )}

      {/* Result */}
      {step === 'result' && resultUrl && (
        <div>
          <div className="relative rounded-3xl overflow-hidden shadow-card mb-4">
            <img src={resultUrl} alt="Generated result" className="w-full aspect-[3/4] object-cover" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Done
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedTemplate(null);
                setStep('template');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Try Again
            </Button>
            <Button
              className="flex-1"
              onClick={() => router.push(`/consultations/${consultation?.id}`)}
            >
              View All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
