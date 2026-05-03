import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { FALLBACK_NEWS, formatNewsDate } from "@/lib/news";
import { notFound } from "next/navigation";

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, content, category, published_at, read_time, cover_image_url, is_published")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  const article = data || FALLBACK_NEWS.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  const paragraphs = (article.content || article.excerpt)
    .split(/\n{2,}/)
    .map((part: string) => part.trim())
    .filter(Boolean);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-slate-900 text-white">
        <section className="border-b border-slate-800 bg-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-wrap gap-3 mb-4 text-sm text-slate-400">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-900/30 text-red-300">
                {article.category}
              </span>
              <span>{formatNewsDate(article.published_at)}</span>
              <span>•</span>
              <span>{article.read_time}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
              {article.excerpt}
            </p>
          </div>
        </section>

        <section>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            {article.cover_image_url && (
              <div className="overflow-hidden rounded-2xl border border-slate-800 mb-8">
                <img src={article.cover_image_url} alt={article.title} className="w-full max-h-[420px] object-cover" />
              </div>
            )}

            <article className="space-y-6 text-slate-300 leading-8 text-[17px]">
              {paragraphs.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
