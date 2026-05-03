"use client";

import { useEffect, useState } from "react";
import { supabase, type Page } from "@/lib/supabase";
import { Plus, Edit2, Eye, EyeOff, Save, X, Check } from "lucide-react";

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("pages").select("*").order("slug")
      .then(({ data }) => { setPages(data || []); setLoading(false); });
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from("pages").update({ ...editing, updated_at: new Date().toISOString() }).eq("id", editing.id);
    } else {
      await supabase.from("pages").insert([editing]);
    }
    setSaving(false);
    setEditing(null);
    const { data } = await supabase.from("pages").select("*").order("slug");
    setPages(data || []);
  };

  const togglePublish = async (page: Page) => {
    await supabase.from("pages").update({ is_published: !page.is_published }).eq("id", page.id);
    setPages(prev => prev.map(p => p.id === page.id ? { ...p, is_published: !p.is_published } : p));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground">Страницы</h1>
          <p className="text-sm text-muted-foreground mt-1">CMS — управление контентом</p>
        </div>
        <button
          onClick={() => setEditing({ id: "", slug: "", title: "", content: {}, meta_title: null, meta_description: null, is_published: true, created_at: "", updated_at: "" })}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Новая страница
        </button>
      </div>

      {/* Pages list */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-border overflow-hidden mb-6">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            Страниц пока нет. Создайте первую.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-slate-50 dark:bg-slate-950">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">SLUG</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ЗАГОЛОВОК</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">СТАТУС</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">ДЕЙСТВИЯ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.map(page => (
                <tr key={page.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      /{page.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{page.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      page.is_published
                        ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    }`}>
                      {page.is_published ? "Опубликована" : "Черновик"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => togglePublish(page)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition-colors">
                        {page.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setEditing(page)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Editor Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white dark:bg-slate-900">
              <h2 className="font-bold text-lg text-foreground">
                {editing.id ? "Редактировать страницу" : "Новая страница"}
              </h2>
              <button onClick={() => setEditing(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Slug *</label>
                  <input value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="about-us"
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Заголовок *</label>
                  <input value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="О компании"
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Контент (JSON)</label>
                <textarea
                  value={JSON.stringify(editing.content, null, 2)}
                  onChange={(e) => {
                    try {
                      setEditing({ ...editing, content: JSON.parse(e.target.value) });
                    } catch {}
                  }}
                  rows={8}
                  className="w-full px-3 py-2.5 text-xs font-mono rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Meta Title</label>
                  <input value={editing.meta_title || ""}
                    onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Meta Description</label>
                  <input value={editing.meta_description || ""}
                    onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/20" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border sticky bottom-0 bg-white dark:bg-slate-900">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Отмена
              </button>
              <button onClick={handleSave} disabled={saving || !editing.slug || !editing.title}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
