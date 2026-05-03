"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window { turnstile: any; }
}

// Тестовый ключ Cloudflare Turnstile (всегда проходит, для разработки)
const TURNSTILE_SITEKEY = "1x00000000000000000000AA";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", password2: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<any>(null);

  useEffect(() => {
    const initTurnstile = () => {
      if (captchaRef.current && window.turnstile && widgetId.current === null) {
        widgetId.current = window.turnstile.render(captchaRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          callback: (token: string) => setCaptchaToken(token),
          "expired-callback": () => setCaptchaToken(null),
          "error-callback": () => setCaptchaToken(null),
          theme: "dark",
          language: "ru",
        });
      }
    };

    if (window.turnstile) {
      initTurnstile();
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileReady";
      script.async = true;
      document.head.appendChild(script);
      (window as any).onTurnstileReady = initTurnstile;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password2) { setError("Пароли не совпадают"); return; }
    if (form.password.length < 8) { setError("Пароль минимум 8 символов"); return; }
    if (!captchaToken) { setError("Пройдите проверку капчи"); return; }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    });
    setLoading(false);

    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        setError("Этот email уже зарегистрирован");
      } else {
        setError(error.message);
      }
      setCaptchaToken(null);
      if (widgetId.current !== null) window.turnstile?.reset(widgetId.current);
      return;
    }
    setSuccess(true);
  };

  if (success) return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0D0D0D" }}>
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">📧</div>
        <h2 className="text-2xl font-black text-white mb-3">Письмо отправлено!</h2>
        <p className="text-gray-400 mb-2 text-sm">Мы отправили ссылку для подтверждения на:</p>
        <p className="text-white font-bold mb-4">{form.email}</p>
        <p className="text-gray-500 text-xs mb-8">Перейдите по ссылке в письме, чтобы активировать аккаунт и получить доступ ко всем документам. Проверьте папку «Спам» если письмо не пришло.</p>
        <a href="/" className="btn-primary px-8 py-3">На главную</a>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20" style={{ background: "#0D0D0D" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/"><img src="/logo.jpg" alt="НЕГОРИМ" className="h-14 mx-auto mb-4 object-contain" /></a>
          <h1 className="text-2xl font-black text-white mb-1">Регистрация</h1>
          <p className="text-gray-500 text-sm">Бесплатный доступ к нормативной базе</p>
        </div>

        <div className="card-dark p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Имя */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Имя и фамилия</label>
              <input required type="text" placeholder="Иван Иванов" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none transition-all"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#CC0000"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Email</label>
              <input required type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none transition-all"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#CC0000"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            {/* Пароль */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Пароль</label>
              <input required type="password" placeholder="Минимум 8 символов" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none transition-all"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#CC0000"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            {/* Повтор пароля */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Повторите пароль</label>
              <input required type="password" placeholder="Повторите пароль" value={form.password2}
                onChange={e => setForm({ ...form, password2: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none transition-all"
                style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => e.target.style.borderColor = "#CC0000"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            {/* Капча */}
            <div className="flex flex-col items-center gap-2 py-1">
              <div ref={captchaRef}></div>
              {!captchaToken && (
                <p className="text-xs text-gray-600">Пройдите проверку выше</p>
              )}
              {captchaToken && (
                <p className="text-xs text-green-500">✓ Проверка пройдена</p>
              )}
            </div>

            {/* Ошибка */}
            {error && (
              <div className="text-red-400 text-sm text-center py-2.5 px-4 rounded-lg"
                style={{ background: "rgba(204,0,0,0.1)", border: "1px solid rgba(204,0,0,0.2)" }}>
                {error}
              </div>
            )}

            {/* Кнопка */}
            <button type="submit" disabled={loading || !captchaToken}
              className="btn-primary w-full py-3.5 text-base mt-1 transition-all"
              style={{ opacity: (!captchaToken || loading) ? 0.5 : 1, cursor: (!captchaToken || loading) ? "not-allowed" : "pointer" }}>
              {loading ? "Регистрация..." : "Зарегистрироваться →"}
            </button>

            <p className="text-xs text-gray-600 text-center">
              Нажимая, вы соглашаетесь с{" "}
              <a href="#" className="text-gray-400 hover:text-white transition-colors">политикой конфиденциальности</a>
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Уже есть аккаунт?{" "}
          <a href="/auth/login" className="text-white hover:text-red-400 transition-colors font-semibold">Войти</a>
        </p>
      </div>
    </main>
  );
}
