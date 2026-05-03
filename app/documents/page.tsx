"use client";

import { useEffect, useState } from "react";
import { supabase, type Document } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, Download, Lock, FileText, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORIES = ["Все", "Своды правил (СП)", "ГОСТы", "Федеральные законы", "Приказы МЧС", "НПБ/ППБ", "Письма МЧС", "Постановления"];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [popular, setPopular] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: l } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null));
    return () => l.subscription.unsubscribe();
  }, []);

  useEffect(() => { setPage(1); }, [search, category]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let q = supabase.from("documents").select("*", { count: "exact" }).eq("is_active", true);
      if (search) q = q.ilike("title", `%${search}%`);
      if (category !== "Все") q = q.eq("category", category);
      q = q.order("order_num", { ascending: false }).range((page - 1) * PER_PAGE, page * PER_PAGE - 1);
      const { data, count } = await q;
      setDocs(data || []);
      setTotal(count || 0);
      setLoading(false);
    };
    load();
  }, [search, category, page]);

  useEffect(() => {
    const loadPopular = async () => {
      const { data } = await supabase.from("documents").select("*").eq("is_active", true).order("order_num", { ascending: false }).limit(6);
      setPopular(data || []);
    };
    loadPopular();
  }, []);

  const handleDownload = async (doc: Document) => {
    if (!user && !doc.is_free) { window.location.href = "/auth/register"; return; }
    if (!doc.file_url) { alert("PDF файл ещё не загружен"); return; }
    window.open(doc.file_url, "_blank");
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <>
      <Header />
      <main className="pt-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
        {/* Hero */}
        <section className="bg-white dark:bg-slate-900 border-b border-border">
          <div className="container-xl py-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="badge mb-3">Нормативная база</div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  Документы по пожарной безопасности
                </h1>
                <p className="text-muted-foreground mt-2">
                  <span className="font-semibold text-foreground">{total || "..."}</span> нормативных актов: СП, ГОСТы, ФЗ, приказы и письма МЧС.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск по названию..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-3 py-2.5 text-sm rounded-lg border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Popular documents */}
        {!user && popular.length > 0 && (
          <section className="py-12">
            <div className="container-xl">
              <h2 className="heading-md text-slate-900 dark:text-white mb-6">Популярные документы</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popular.map((doc) => (
                  <Card key={doc.id} className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        {doc.category || "Без категории"}
                      </div>
                      <CardTitle className="text-sm leading-snug line-clamp-2">{doc.title}</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDownload(doc)}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Войти для скачивания
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All documents */}
        <section className="py-12">
          <div className="container-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-md text-slate-900 dark:text-white">Все документы</h2>
              <div className="text-sm text-muted-foreground">
                {loading ? "Загрузка..." : (
                  <>Найдено: <span className="font-semibold text-foreground">{total}</span></>
                )}
              </div>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-border p-4 animate-pulse">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                ))
              ) : docs.length === 0 ? (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  <div className="text-sm">По запросу «{search}» ничего не найдено</div>
                </div>
              ) : (
                docs.map((doc) => (
                  <Card key={doc.id} className="group hover:shadow-md transition-shadow flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        {doc.category || "Без категории"}
                      </div>
                      <CardTitle className="text-sm leading-snug line-clamp-2">{doc.title}</CardTitle>
                      {doc.description && (
                        <CardDescription className="line-clamp-2">{doc.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardFooter className="mt-auto pt-0">
                      <Button
                        variant={user || doc.is_free ? "default" : "secondary"}
                        size="sm"
                        className="w-full"
                        onClick={() => handleDownload(doc)}
                      >
                        {user || doc.is_free ? (
                          <>
                            <Download className="w-3 h-3 mr-1" />
                            {doc.file_url ? "Скачать" : "Нет файла"}
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Войти
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Назад
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Вперёд →
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}