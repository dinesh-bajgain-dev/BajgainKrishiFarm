"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FolderPlus, Loader2, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { EntityImage } from "@/components/shared/entity-image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminApiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { loc } from "@/lib/i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { Album, GalleryImage } from "@/types/entities";

const NO_ALBUM = "none";

export default function AdminGalleryPage() {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale).gallery;
  const common = getAdminDictionary(locale).common;
  const [albums, setAlbums] = useState<Album[]>([]);
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // "New album" dialog
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumTitleEn, setAlbumTitleEn] = useState("");
  const [albumTitleNe, setAlbumTitleNe] = useState("");
  const [savingAlbum, setSavingAlbum] = useState(false);

  // "Edit photo" dialog
  const [editingPhoto, setEditingPhoto] = useState<GalleryImage | null>(null);
  const [photoCaptionEn, setPhotoCaptionEn] = useState("");
  const [photoCaptionNe, setPhotoCaptionNe] = useState("");
  const [photoAlbumId, setPhotoAlbumId] = useState<string>(NO_ALBUM);
  const [savingPhoto, setSavingPhoto] = useState(false);

  async function load() {
    try {
      const [albumData, imageData] = await Promise.all([
        adminApiFetch<Album[]>("/api/albums/"),
        adminApiFetch<GalleryImage[]>("/api/gallery/"),
      ]);
      setAlbums(albumData);
      setImages(imageData);
    } catch {
      toast.error(t.loadFailedToast);
      setImages([]);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- state is set after awaited fetches, not synchronously
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    let uploaded = 0;
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await adminApiFetch<{ url: string }>("/api/uploads/", {
          method: "POST",
          body: formData,
        });
        await adminApiFetch("/api/gallery/", {
          method: "POST",
          body: JSON.stringify({
            image_url: res.url,
            album_id: filter === "all" ? null : filter,
          }),
        });
        uploaded += 1;
      }
      toast.success(uploaded === 1 ? t.uploadedOneToast : t.uploadedManyToast(uploaded));
      await load();
    } catch {
      toast.error(uploaded > 0 ? t.uploadPartialFailToast(uploaded) : t.uploadFailToast);
      if (uploaded > 0) await load();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDeletePhoto(image: GalleryImage) {
    if (!confirm(t.deletePhotoConfirm)) return;
    try {
      await adminApiFetch(`/api/gallery/${image.id}`, { method: "DELETE" });
      toast.success(t.photoDeletedToast);
      setImages((prev) => prev?.filter((img) => img.id !== image.id) ?? null);
    } catch {
      toast.error(t.photoDeleteFailedToast);
    }
  }

  function openNewAlbumDialog() {
    setEditingAlbum(null);
    setAlbumTitleEn("");
    setAlbumTitleNe("");
    setAlbumDialogOpen(true);
  }

  function openEditAlbumDialog(album: Album) {
    setEditingAlbum(album);
    setAlbumTitleEn(album.title_en);
    setAlbumTitleNe(album.title_ne);
    setAlbumDialogOpen(true);
  }

  async function saveAlbum() {
    if (!albumTitleEn.trim()) {
      toast.error(t.albumNameRequired);
      return;
    }
    setSavingAlbum(true);
    try {
      if (editingAlbum) {
        await adminApiFetch(`/api/albums/${editingAlbum.id}`, {
          method: "PUT",
          body: JSON.stringify({ title_en: albumTitleEn, title_ne: albumTitleNe }),
        });
        toast.success(t.albumRenamedToast);
      } else {
        await adminApiFetch("/api/albums/", {
          method: "POST",
          body: JSON.stringify({ title_en: albumTitleEn, title_ne: albumTitleNe }),
        });
        toast.success(t.albumCreatedToast);
      }
      setAlbumDialogOpen(false);
      await load();
    } catch {
      toast.error(t.albumSaveFailedToast);
    } finally {
      setSavingAlbum(false);
    }
  }

  async function deleteAlbum(album: Album) {
    if (!confirm(t.deleteAlbumConfirm(loc(album, "title", locale)))) return;
    try {
      await adminApiFetch(`/api/albums/${album.id}`, { method: "DELETE" });
      toast.success(t.albumDeletedToast);
      if (filter === album.id) setFilter("all");
      setAlbumDialogOpen(false);
      await load();
    } catch {
      toast.error(t.albumDeleteFailedToast);
    }
  }

  function openPhotoDialog(image: GalleryImage) {
    setEditingPhoto(image);
    setPhotoCaptionEn(image.caption_en ?? "");
    setPhotoCaptionNe(image.caption_ne ?? "");
    setPhotoAlbumId(image.album_id ?? NO_ALBUM);
  }

  async function savePhoto() {
    if (!editingPhoto) return;
    setSavingPhoto(true);
    try {
      await adminApiFetch(`/api/gallery/${editingPhoto.id}`, {
        method: "PUT",
        body: JSON.stringify({
          caption_en: photoCaptionEn || null,
          caption_ne: photoCaptionNe || null,
          album_id: photoAlbumId === NO_ALBUM ? null : photoAlbumId,
        }),
      });
      toast.success(t.photoUpdatedToast);
      setEditingPhoto(null);
      await load();
    } catch {
      toast.error(t.photoSaveFailedToast);
    } finally {
      setSavingPhoto(false);
    }
  }

  const visible =
    images?.filter((img) => filter === "all" || img.album_id === filter) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">{t.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            className="hidden"
          />
          <Button size="lg" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
            {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
            {uploading ? t.uploading : t.addPhotos}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            filter === "all"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground/70 hover:bg-muted"
          )}
        >
          {t.allPhotos}
        </button>
        {albums.map((album) => (
          <span key={album.id} className="inline-flex items-center">
            <button
              type="button"
              onClick={() => setFilter(album.id)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                filter === album.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/70 hover:bg-muted"
              )}
            >
              {loc(album, "title", locale)}
            </button>
            {filter === album.id && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="ml-1"
                aria-label={t.editAlbumAria(loc(album, "title", locale))}
                onClick={() => openEditAlbumDialog(album)}
              >
                <Pencil className="size-3.5" />
              </Button>
            )}
          </span>
        ))}
        <Button variant="outline" size="sm" onClick={openNewAlbumDialog}>
          <FolderPlus className="size-4" /> {t.newAlbum}
        </Button>
      </div>

      {filter !== "all" && <p className="mt-3 text-xs text-muted-foreground">{t.newAlbumNote}</p>}

      {visible === null && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      )}

      {visible && visible.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">{t.emptyState}</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible?.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted"
          >
            <EntityImage
              src={image.image_url}
              alt={loc(image, "caption", locale)}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1.5 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label={t.editPhotoAria}
                onClick={() => openPhotoDialog(image)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label={t.deletePhotoAria}
                onClick={() => handleDeletePhoto(image)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* New / edit album dialog */}
      <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAlbum ? t.editAlbumDialogTitle : t.newAlbumDialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="album-title-en">{t.albumNameEnLabel}</Label>
              <Input
                id="album-title-en"
                value={albumTitleEn}
                onChange={(e) => setAlbumTitleEn(e.target.value)}
                placeholder={t.albumNameEnPlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album-title-ne">{t.albumNameNeLabel}</Label>
              <Input
                id="album-title-ne"
                value={albumTitleNe}
                onChange={(e) => setAlbumTitleNe(e.target.value)}
                placeholder={t.albumNameNePlaceholder}
              />
            </div>
            <div className="flex justify-between gap-2 pt-1">
              {editingAlbum ? (
                <Button
                  variant="outline"
                  onClick={() => deleteAlbum(editingAlbum)}
                  className="text-destructive"
                >
                  <Trash2 className="size-4" /> {t.deleteAlbum}
                </Button>
              ) : (
                <span />
              )}
              <Button onClick={saveAlbum} disabled={savingAlbum}>
                {savingAlbum ? common.saving : common.save}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit photo dialog */}
      <Dialog open={editingPhoto !== null} onOpenChange={(open) => !open && setEditingPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editPhotoDialogTitle}</DialogTitle>
          </DialogHeader>
          {editingPhoto && (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                <EntityImage
                  src={editingPhoto.image_url}
                  alt=""
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.albumFieldLabel}</Label>
                <Select
                  value={photoAlbumId}
                  onValueChange={(value) => setPhotoAlbumId(value ?? NO_ALBUM)}
                  items={{
                    [NO_ALBUM]: t.noAlbum,
                    ...Object.fromEntries(albums.map((album) => [album.id, loc(album, "title", locale)])),
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_ALBUM}>{t.noAlbum}</SelectItem>
                    {albums.map((album) => (
                      <SelectItem key={album.id} value={album.id}>
                        {loc(album, "title", locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption-en">{t.captionEnLabel}</Label>
                <Input
                  id="caption-en"
                  value={photoCaptionEn}
                  onChange={(e) => setPhotoCaptionEn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption-ne">{t.captionNeLabel}</Label>
                <Input
                  id="caption-ne"
                  value={photoCaptionNe}
                  onChange={(e) => setPhotoCaptionNe(e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-1">
                <Button onClick={savePhoto} disabled={savingPhoto}>
                  {savingPhoto ? common.saving : common.save}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
