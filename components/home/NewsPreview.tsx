"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FALLBACK_NEWS, formatNewsDate, type NewsArticle } from "@/lib/news";

export default function NewsPreview() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, slug, excerpt, content, category, published_at, read_time, cover_image_url, is_published, is_featured")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(4);

      if (!error && data && data.length > 0) {
        setNews(data);
      } else {
        setNews(FALLBACK_NEWS.slice(0, 4));
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <section className="py-16 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="badge mb-3">Новости</div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Новости пожарной безопасности
            </h2>
          </div>
          <Link
            href="/news"
            className="hidden sm:flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            Все новости
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((article, index) => {
            const isNew =
              (Date.now() - new Date(article.published_at).getTime()) /
                (1000 * 60 * 60 * 24) <=
              14;

            return (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/news/${article.slug}`}
                  className="block bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-300 dark:bg-red-900/50">
                      {article.category}
                    </span>
                    {isNew && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-600/20 text-red-400">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                  <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatNewsDate(article.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.read_time}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile link */}
        <div className="sm:hidden text-center mt-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            Все новости
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
