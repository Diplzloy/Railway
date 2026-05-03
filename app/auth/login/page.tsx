"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) { setError("Неверный email или пароль"); return; }
    window.location.href = "/cabinet";
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: "#0D0D0D" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/"><img src="/logo.jpg" alt="НЕГОРИМ" className="h-14 mx-auto mb-4 object-contain" /></a>
          <h1 className="text-2xl font-black text-white mb-1">Вход</h1>
          <p className="text-gray-500 text-sm">Войдите для доступа к документам</p>
        </div>

        <div className="card-dark p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Email</label>
              <input required type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none transition-all"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#CC0000"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Пароль</label>
              <input required type="password" placeholder="Ваш пароль" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none transition-all"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#CC0000"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            {error && <div className="text-red-400 text-sm text-center py-2 px-4 rounded-lg" style={{ background: "rgba(204,0,0,0.1)" }}>{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Нет аккаунта?{" "}
          <a href="/auth/register" className="text-white hover:text-red-400 transition-colors">Зарегистрироваться</a>
        </p>
      </div>
    </main>
  );
}
