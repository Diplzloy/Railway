"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { FALLBACK_NEWS, formatNewsDate, type NewsArticle } from "@/lib/news";

export default function NewsPage() {
  const [news, setNews] = useState<NewsArticle[]>(FALLBACK_NEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, slug, excerpt, content, category, published_at, read_time, cover_image_url, is_published, is_featured")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setNews(data);
      }

      setLoading(false);
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = news.length;
    const fresh = news.filter((item) => {
      const days = (Date.now() - new Date(item.published_at).getTime()) / (1000 * 60 * 60 * 24);
      return days <= 30;
    }).length;

    return { total, fresh };
  }, [news]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-slate-900">
        <div className="py-12 px-4 sm:px-6 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="badge mb-3">Статьи и аналитика</div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
              Новости пожарной безопасности
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-3xl">
              {loading
                ? "Загружаем материалы…"
                : `${stats.total} материалов по нормативной базе, проектированию, обслуживанию и проверкам. ${stats.fresh} публикаций вышло за последние 30 дней.`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card-elevated bg-slate-900 border-slate-800 p-5 animate-pulse">
                  <div className="h-5 w-24 rounded bg-slate-800 mb-3" />
                  <div className="h-6 w-3/4 rounded bg-slate-800 mb-3" />
                  <div className="h-4 w-full rounded bg-slate-800 mb-2" />
                  <div className="h-4 w-2/3 rounded bg-slate-800 mb-4" />
                  <div className="h-4 w-32 rounded bg-slate-800" />
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              Пока нет опубликованных новостей.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((article) => {
                const isNew = (Date.now() - new Date(article.published_at).getTime()) / (1000 * 60 * 60 * 24) <= 14;

                return (
                  <a
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="card-elevated bg-slate-900 border-slate-800 p-5 block hover:ring-1 hover:ring-red-500/30 transition-all"
                  >
                    {article.cover_image_url && (
                      <div className="mb-4 overflow-hidden rounded-xl border border-slate-800">
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="w-full h-52 object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-300">
                        {article.category}
                      </span>
                      {isNew && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-600/20 text-red-400">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-base leading-snug mb-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>{formatNewsDate(article.published_at)}</span>
                      <span>•</span>
                      <span>{article.read_time}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
