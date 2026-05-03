"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Trash2, Copy, Image as ImageIcon, X, Check } from "lucide-react";

export default function AdminMedia() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
    setImages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const path = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      const { data: upload, error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
      if (error || !upload) continue;
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(upload.path);
      await supabase.from("media").insert([{
        name: file.name,
        url: urlData.publicUrl,
        mime_type: file.type,
        size: file.size,
        bucket: "media",
        path: upload.path,
      }]);
    }
    setUploading(false);
    load();
  };

  const handleDelete = async (img: any) => {
    if (!confirm(`Удалить ${img.name}?`)) return;
    if (img.path) await supabase.storage.from("media").remove([img.path]);
    await supabase.from("media").delete().eq("id", img.id);
    setImages(prev => prev.filter(i => i.id !== img.id));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground">Медиафайлы</h1>
          <p className="text-sm text-muted-foreground mt-1">{images.length} файлов</p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => document.getElementById("media-input")?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-8 ${
          dragOver ? "border-red-500 bg-red-50 dark:bg-red-950" : "border-border hover:border-red-400"
        }`}
      >
        <input id="media-input" type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => handleUpload(e.target.files)} />
        {uploading ? (
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            <span className="text-sm">Загрузка...</span>
          </div>
        ) : (
          <div className="text-muted-foreground">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm font-medium">Перетащите изображения сюда</div>
            <div className="text-xs mt-1">или нажмите для выбора файлов</div>
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon className="w-8 h-8 mx-auto mb-3" />
          <div className="text-sm">Нет загруженных изображений</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-border">
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(img.url)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                  {copied === img.url ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(img)}
                  className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-600 flex items-center justify-center text-white transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white text-[10px] truncate">{img.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
