'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { cn } from './lib/utils';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ open, onClose, title, children, className }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [open]);

    if (!open) return null;

    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        <div
          ref={ref}
          className={cn(
            'bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85dvh] overflow-y-auto shadow-xl',
            'animate-[slideUp_0.2s_ease-out]',
            className,
          )}
        >
          {title && (
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          <div className="p-5">{children}</div>
        </div>
      </div>
    );
  },
);

Dialog.displayName = 'Dialog';

export { Dialog };
export type { DialogProps };
