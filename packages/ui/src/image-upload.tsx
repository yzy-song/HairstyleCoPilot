'use client';

import { cn } from './lib/utils';
import { Upload, Camera } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  onFile: (file: File) => void;
  previewUrl?: string;
  className?: string;
  capture?: boolean;
}

function ImageUpload({ onFile, previewUrl, className, capture }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(previewUrl);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onFile(file);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-warm-200 bg-warm-50/50 overflow-hidden cursor-pointer hover:border-primary-300 hover:bg-warm-50 transition-all',
        className,
      )}
      onClick={() => inputRef.current?.click()}
    >
      {preview ? (
        <>
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 hover:opacity-100 text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">
              Change Photo
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 p-8 text-warm-300">
          {capture ? <Camera className="h-10 w-10" /> : <Upload className="h-10 w-10" />}
          <span className="text-sm font-medium">
            {capture ? 'Take a photo' : 'Upload photo'}
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={capture ? 'environment' : undefined}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

export { ImageUpload };
export type { ImageUploadProps };
