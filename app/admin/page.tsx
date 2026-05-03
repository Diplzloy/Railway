"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Users, Image, TrendingUp, ArrowUpRight, Newspaper } from "lucide-react";

type Stats = {
  documents: number;
  users: number;
  media: number;
  pages: number;
  news: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ documents: 0, users: 0, media: 0, pages: 0, news: 0 });
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [docs, users, media, pages, news, recent, recentNewsData] = await Promise.all([
        supabase.from("documents").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("media").select("*", { count: "exact", head: true }),
        supabase.from("pages").select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true }),
        supabase.from("documents").select("id,title,category,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("news").select("id,title,category,published_at").order("published_at", { ascending: false }).limit(5),
      ]);
      setStats({
        documents: docs.count || 0,
        users: users.count || 0,
        media: media.count || 0,
        pages: pages.count || 0,
        news: news.count || 0,
      });
      setRecentDocs(recent.data || []);
      setRecentNews(recentNewsData.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: "Новости", value: stats.news, icon: Newspaper, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950", href: "/admin/news" },
    { label: "Документов", value: stats.documents, icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950", href: "/admin/documents" },
    { label: "Пользователей", value: stats.users, icon: Users, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950", href: "/admin/users" },
    { label: "Медиафайлов", value: stats.media, icon: Image, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950", href: "/admin/media" },
    { label: "Страниц", value: stats.pages, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950", href: "/admin/pages" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground">Дашборд</h1>
        <p className="text-muted-foreground text-sm mt-1">Управление контентом сайта НЕГОРИМ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-white dark:bg-slate-900 rounded-xl border border-border p-5 flex items-start justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="text-2xl font-black text-foreground">
                {loading ? "—" : card.value.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
            </div>
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </a>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Последние новости</h2>
            <a href="/admin/news" className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
              Все новости <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
                </div>
              ))
            ) : recentNews.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                Новостей пока нет
              </div>
            ) : (
              recentNews.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Newspaper className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.category}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item.published_at).toLocaleDateString("ru-RU")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Последние документы</h2>
            <a href="/admin/documents" className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
              Все документы <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
                </div>
              ))
            ) : recentDocs.length === 0 ? (
              <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                Документов пока нет
              </div>
            ) : (
              recentDocs.map((doc) => (
                <div key={doc.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{doc.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{doc.category}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(doc.created_at).toLocaleDateString("ru-RU")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
