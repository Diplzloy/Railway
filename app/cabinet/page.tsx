"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CabinetPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { window.location.href = "/auth/login"; return; }
      setUser(data.session.user);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0D0D" }}>
      <div className="text-gray-400">Загрузка...</div>
    </div>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16" style={{ background: "#0D0D0D" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="py-10">
            <div className="section-label mb-3">Личный кабинет</div>
            <h1 className="text-3xl font-black text-white mb-2">
              Добро пожаловать{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
            </h1>
            <p className="text-gray-400">{user?.email}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <a href="/documents" className="card-dark p-6 hover:border-red-900/30 transition-all group">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-bold text-white mb-1 group-hover:text-red-400 transition-colors">Документы</h3>
              <p className="text-gray-500 text-sm">Скачивайте нормативные документы и письма МЧС</p>
            </a>
            <a href="/news" className="card-dark p-6 hover:border-red-900/30 transition-all group">
              <div className="text-3xl mb-3">📰</div>
              <h3 className="font-bold text-white mb-1 group-hover:text-red-400 transition-colors">Новости</h3>
              <p className="text-gray-500 text-sm">Изменения в законодательстве по пожарной безопасности</p>
            </a>
            <a href="/#contact" className="card-dark p-6 hover:border-red-900/30 transition-all group">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold text-white mb-1 group-hover:text-red-400 transition-colors">Консультация</h3>
              <p className="text-gray-500 text-sm">Задайте вопрос специалистам НЕГОРИМ</p>
            </a>
          </div>

          <div className="mt-8 p-6 rounded-2xl" style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-bold text-white mb-1">Ваш аккаунт</h3>
            <p className="text-gray-400 text-sm mb-4">Email: <span className="text-white">{user?.email}</span></p>
            <p className="text-gray-400 text-sm">Дата регистрации: <span className="text-white">
              {new Date(user?.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
            </span></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
