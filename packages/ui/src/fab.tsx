'use client';

import { cn } from './lib/utils';
import { Plus } from 'lucide-react';

interface FabProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

function Fab({ onClick, className, label }: FabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 active:bg-primary-700 active:scale-95 transition-all',
        className,
      )}
      aria-label={label || 'Add'}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}

export { Fab };
export type { FabProps };
