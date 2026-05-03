"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, type Document } from "@/lib/supabase";
import {
  Upload, Search, Trash2, Edit2, Download, Plus,
  FileText, X, Check, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Своды правил (СП)", "ГОСТы", "Федеральные законы", "Приказы МЧС",
  "НПБ/ППБ", "Письма МЧС", "Постановления", "СНиПы", "Прочее"
];

type UploadState = "idle" | "uploading" | "success" | "error";

export default function AdminDocuments() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Upload modal
  const [showUpload, setShowUpload] = useState(false);
  const [editDoc, setEditDoc] = useState<Document | null>(null);

  // Upload form
  const [form, setForm] = useState({ title: "", category: CATEGORIES[0], description: "", is_free: false, is_active: true });
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("documents").select("*", { count: "exact" });
    if (search) q = q.ilike("title", `%${search}%`);
    if (category !== "Все") q = q.eq("category", category);
    q = q.order("created_at", { ascending: false }).range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
    const { data, count } = await q;
    setDocs(data || []);
    setTotal(count || 0);
    setLoading(false);
  }, [search, category, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  };

  const handleSubmit = async () => {
    if (!form.title) return;
    setUploadState("uploading");
    try {
      let file_url = editDoc?.file_url || null;
      let file_size = editDoc?.file_size || null;
      let file_name = editDoc?.file_name || null;

      if (file) {
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
        const { data: upload, error: uploadErr } = await supabase.storage
          .from("documents")
          .upload(fileName, file, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(upload.path);
        file_url = urlData.publicUrl;
        file_name = file.name;
        const kb = Math.round(file.size / 1024);
        file_size = kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`;
      }

      const payload = { ...form, file_url, file_size, file_name };

      if (editDoc) {
        await supabase.from("documents").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editDoc.id);
      } else {
        await supabase.from("documents").insert([payload]);
      }

      setUploadState("success");
      setTimeout(() => {
        setShowUpload(false);
        setEditDoc(null);
        setFile(null);
        setForm({ title: "", category: CATEGORIES[0], description: "", is_free: false, is_active: true });
        setUploadState("idle");
        fetch();
      }, 800);
    } catch {
      setUploadState("error");
      setTimeout(() => setUploadState("idle"), 2000);
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Удалить «${doc.title.slice(0, 50)}»?`)) return;
    if (doc.file_url) {
      const path = doc.file_url.split("/").pop();
      if (path) await supabase.storage.from("documents").remove([path]);
    }
    await supabase.from("documents").delete().eq("id", doc.id);
    fetch();
  };

  const openEdit = (doc: Document) => {
    setEditDoc(doc);
    setForm({ title: doc.title, category: doc.category || CATEGORIES[0], description: doc.description || "", is_free: doc.is_free, is_active: doc.is_active });
    setShowUpload(true);
  };

  const toggleActive = async (doc: Document) => {
    await supabase.from("documents").update({ is_active: !doc.is_active }).eq("id", doc.id);
    fetch();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground">Документы</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} документов в базе</p>
        </div>
        <button
          onClick={() => { setEditDoc(null); setForm({ title: "", category: CATEGORIES[0], description: "", is_free: false, is_active: true }); setShowUpload(true); }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить документ
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-3 py-2.5 text-sm rounded-lg border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
          <option value="Все">Все категории</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-slate-50 dark:bg-slate-950">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ДОКУМЕНТ</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">КАТЕГОРИЯ</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">ФАЙЛ</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">СТАТУС</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-4 py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-2/3" />
                  </td>
                </tr>
              ))
            ) : docs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  Документов не найдено
                </td>
              </tr>
            ) : (
              docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate max-w-xs">{doc.title}</div>
                        {doc.is_free && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 font-medium">
                            Бесплатно
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                      {doc.category || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {doc.file_url ? (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> {doc.file_size || "PDF"}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Нет файла</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <button
                      onClick={() => toggleActive(doc)}
                      className={`text-xs px-2 py-1 rounded font-medium ${doc.is_active ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'}`}
                    >
                      {doc.is_active ? 'Активен' : 'Неактивен'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank"
                          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-blue-500 transition-colors">
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => openEdit(doc)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(doc)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950 text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {total > PER_PAGE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} из {total}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 text-xs rounded border border-border disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                ←
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={page * PER_PAGE >= total}
                className="px-3 py-1 text-xs rounded border border-border disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-bold text-lg text-foreground">
                {editDoc ? "Редактировать документ" : "Добавить документ"}
              </h2>
              <button onClick={() => { setShowUpload(false); setEditDoc(null); }}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Название *
                </label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Название документа..."
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Категория
                </label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Описание
                </label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} placeholder="Краткое описание..."
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none" />
              </div>

              {/* PDF Upload */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  PDF файл {editDoc?.file_url && "(уже загружен)"}
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("pdf-input")?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                    dragOver ? "border-red-500 bg-red-50 dark:bg-red-950" : "border-border hover:border-red-400",
                    file ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
                  )}
                >
                  <input id="pdf-input" type="file" accept=".pdf" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
                  {file ? (
                    <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      <Upload className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-sm">Перетащите PDF или нажмите для выбора</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Free & Active */}
              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })}
                    className="w-4 h-4 rounded border-border accent-red-600" />
                  <span className="text-sm text-foreground">Бесплатный доступ</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-border accent-red-600" />
                  <span className="text-sm text-foreground">Активен</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button onClick={() => { setShowUpload(false); setEditDoc(null); }}
                className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Отмена
              </button>
              <button onClick={handleSubmit} disabled={!form.title || uploadState === "uploading"}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex items-center justify-center gap-2",
                  uploadState === "success" ? "bg-green-500" :
                    uploadState === "error" ? "bg-red-400" :
                      "bg-red-600 hover:bg-red-700 disabled:opacity-50"
                )}>
                {uploadState === "uploading" && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {uploadState === "success" && <Check className="w-4 h-4" />}
                {uploadState === "error" && <AlertCircle className="w-4 h-4" />}
                {uploadState === "idle" && (editDoc ? "Сохранить" : "Добавить")}
                {uploadState === "uploading" && "Загрузка..."}
                {uploadState === "success" && "Готово!"}
                {uploadState === "error" && "Ошибка"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}