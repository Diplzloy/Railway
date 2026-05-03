"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, Edit2, Eye, EyeOff, Image as ImageIcon, Plus, Save, Search, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/news";

type NewsForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published_at: string;
  read_time: string;
  cover_image_url: string;
  is_published: boolean;
  is_featured: boolean;
};

const DEFAULT_FORM: NewsForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Нормативная база",
  published_at: new Date().toISOString().slice(0, 10),
  read_time: "5 мин",
  cover_image_url: "",
  is_published: true,
  is_featured: false,
};

const CATEGORIES = [
  "Законодательство",
  "Изменения в нормах",
  "Нормативная база",
  "Проектирование",
  "Обслуживание",
  "Системы пожаротушения",
  "Проверки МЧС",
  "ГОСТы",
  "Надзор МЧС",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[а-яё]/gi, (char) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
        к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
        х: "h", ц: "cz", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
      };
      return map[char.toLowerCase()] ?? char;
    });
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsForm>(DEFAULT_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("news")
      .select("id, title, slug, excerpt, content, category, published_at, read_time, cover_image_url, is_published, is_featured")
      .order("published_at", { ascending: false });

    if (search.trim()) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { data } = await query;
    setItems((data || []) as NewsArticle[]);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setFile(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setFile(null);
    setShowForm(true);
  };

  const openEdit = (item: NewsArticle) => {
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      published_at: item.published_at.slice(0, 10),
      read_time: item.read_time,
      cover_image_url: item.cover_image_url || "",
      is_published: item.is_published,
      is_featured: item.is_featured,
    });
    setEditingId(item.id);
    setFile(null);
    setShowForm(true);
  };

  const filteredCount = useMemo(() => items.length, [items]);

  const uploadCoverIfNeeded = async () => {
    if (!file) return form.cover_image_url || null;

    setUploading(true);
    const path = `news/${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { data: upload, error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
    if (error || !upload) {
      setUploading(false);
      throw error || new Error("Не удалось загрузить изображение");
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(upload.path);
    await supabase.from("media").insert({
      name: file.name,
      url: urlData.publicUrl,
      mime_type: file.type,
      size: file.size,
      bucket: "media",
      path: upload.path,
    });

    setUploading(false);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.excerpt || !form.content) return;

    setSaving(true);
    try {
      const cover_image_url = await uploadCoverIfNeeded();
      const payload = {
        ...form,
        slug: slugify(form.slug),
        cover_image_url,
        published_at: form.published_at,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        await supabase.from("news").update(payload).eq("id", editingId);
      } else {
        await supabase.from("news").insert(payload);
      }

      await load();
      resetForm();
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить новость «${title}»?`)) return;
    await supabase.from("news").delete().eq("id", id);
    await load();
  };

  const togglePublish = async (id: string, isPublished: boolean) => {
    await supabase
      .from("news")
      .update({ is_published: !isPublished, updated_at: new Date().toISOString() })
      .eq("id", id);
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Новости</h1>
          <p className="text-sm text-muted-foreground mt-1">{filteredCount} материалов в базе</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить новость
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск по заголовку или анонсу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-slate-50 dark:bg-slate-950">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">НОВОСТЬ</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">КАТЕГОРИЯ</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">ДАТА</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">СТАТУС</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={5} className="px-4 py-4">
                    <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Новостей пока нет</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {item.cover_image_url ? (
                          <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate max-w-md">{item.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.excerpt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{item.category}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    {new Date(item.published_at).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded font-medium",
                      item.is_published
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      {item.is_published ? "Опубликована" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => togglePublish(item.id, item.is_published)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition-colors"
                        title={item.is_published ? "Снять с публикации" : "Опубликовать"}
                      >
                        {item.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors"
                        title="Редактировать"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="font-bold text-lg text-foreground">
                {editingId ? "Редактировать новость" : "Новая новость"}
              </h2>
              <button
                onClick={resetForm}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Заголовок *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                      slug: prev.slug ? prev.slug : slugify(e.target.value),
                    }))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Категория</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Дата публикации</label>
                  <input
                    type="date"
                    value={form.published_at}
                    onChange={(e) => setForm((prev) => ({ ...prev, published_at: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Время чтения</label>
                  <input
                    value={form.read_time}
                    onChange={(e) => setForm((prev) => ({ ...prev, read_time: e.target.value }))}
                    placeholder="7 мин"
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Анонс *</label>
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Текст новости *</label>
                <textarea
                  rows={10}
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-y"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">URL изображения</label>
                  <input
                    value={form.cover_image_url}
                    onChange={(e) => setForm((prev) => ({ ...prev, cover_image_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Загрузка изображения</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      const dropped = e.dataTransfer.files?.[0];
                      if (dropped?.type.startsWith("image/")) setFile(dropped);
                    }}
                    onClick={() => document.getElementById("news-cover-input")?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all",
                      dragOver ? "border-red-500 bg-red-50 dark:bg-red-950" : "border-border hover:border-red-400",
                      file ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
                    )}
                  >
                    <input
                      id="news-cover-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files?.[0];
                        if (selected) setFile(selected);
                      }}
                    />
                    {file ? (
                      <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
                        <Check className="w-4 h-4" /> {file.name}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">
                        <Upload className="w-5 h-5 mx-auto mb-1" />
                        Перетащите файл или нажмите для выбора
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 rounded border-border accent-red-600"
                  />
                  <span className="text-sm text-foreground">Опубликована</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded border-border accent-red-600"
                  />
                  <span className="text-sm text-foreground">Показывать как важную</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border sticky bottom-0 bg-white dark:bg-slate-900">
              <button
                onClick={resetForm}
                className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading || !form.title || !form.slug || !form.excerpt || !form.content}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {(saving || uploading) ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving || uploading ? "Сохранение..." : editingId ? "Сохранить" : "Добавить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
