"use client";

import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntityImage } from "@/components/shared/entity-image";
import { adminApiFetch } from "@/lib/api";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";

/** Upload and manage several photos (used for pig listings). */
export function MultiImageUploadField({
  value,
  onChange,
}: {
  value: string[] | null | undefined;
  onChange: (urls: string[]) => void;
}) {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).multiImageUpload;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urls = value ?? [];

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await adminApiFetch<{ url: string }>("/api/uploads/", {
          method: "POST",
          body: formData,
        });
        uploaded.push(res.url);
      }
      onChange([...urls, ...uploaded]);
    } catch {
      if (uploaded.length > 0) onChange([...urls, ...uploaded]);
      setError(t.partialError);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {urls.map((url, i) => (
            <div key={`${url}-${i}`} className="relative h-28 w-36 overflow-hidden rounded-lg border border-border">
              <EntityImage src={url} alt="" fill sizes="144px" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {t.mainPhoto}
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label={t.removePhoto}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFilesChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {urls.length > 0 ? t.addMorePhotos : t.uploadPhotos}
        </Button>
        <p className="mt-1.5 text-xs text-muted-foreground">{t.note}</p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
