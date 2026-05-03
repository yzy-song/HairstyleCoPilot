'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@repo/ui/badge';
import { Skeleton } from '@repo/ui/skeleton';
import { EmptyState } from '@repo/ui/empty-state';
import { Palette } from 'lucide-react';
import { getTemplates } from '@/lib/api/templates';
import type { HairstyleTemplate } from '@/lib/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<HairstyleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    getTemplates(1, 50)
      .then((res) => setTemplates(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allTags = [...new Set(templates.flatMap((t) => t.tags?.map((tg) => tg.name) || []))];

  const filtered = activeTag
    ? templates.filter((t) => t.tags?.some((tg) => tg.name === activeTag))
    : templates;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
          <Palette className="h-4 w-4 text-violet-500" />
        </div>
        <h2 className="text-xl font-bold text-warm-900">Styles</h2>
        <span className="text-xs font-medium text-warm-400 bg-warm-100 px-2 py-0.5 rounded-full">
          {templates.length}
        </span>
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-1 no-scrollbar">
          <button
            onClick={() => setActiveTag(null)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              !activeTag
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-white text-warm-500 border border-warm-200/60 hover:border-warm-300'
            }`}
          >
            All Styles
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTag === tag
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-warm-500 border border-warm-200/60 hover:border-warm-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200/60 p-8 mt-2">
          <EmptyState title="No styles found" description="Try a different filter" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-2xl overflow-hidden border border-warm-200/60 hover:shadow-card transition-all"
            >
              <div className="relative overflow-hidden">
                <img
                  src={template.imageUrl}
                  alt={template.name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-warm-800">{template.name}</h3>
                {template.description && (
                  <p className="text-xs text-warm-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                )}
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.slice(0, 2).map((t) => (
                      <Badge key={t.id} variant="primary">
                        {t.name}
                      </Badge>
                    ))}
                    {template.tags.length > 2 && (
                      <span className="text-[10px] text-warm-400 font-medium self-center">
                        +{template.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
