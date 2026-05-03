"use client";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="py-24" style={{ background: "#0D0D0D" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-10 lg:gap-14 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="section-label mb-3">Контакты</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Готовы обсудить<br />
              <span className="text-gradient-red">ваш объект?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Оставьте заявку — инженер рассчитает стоимость за 24 часа. Бесплатно, без обязательств.
            </p>
            <div className="flex flex-col gap-4">
              <a href="tel:+78007002487" className="flex items-center gap-3 text-white hover:text-red-400 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(153,0,0,0.2)" }}>📞</div>
                <span className="font-semibold">+7 (800) 700-24-87</span>
              </a>
              <a href="mailto:info@negorim.ru" className="flex items-center gap-3 text-white hover:text-red-400 transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(153,0,0,0.2)" }}>✉️</div>
                <span className="font-semibold">info@negorim.ru</span>
              </a>
            </div>
          </div>

          <div className="card-dark p-8">
            {sent ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <div className="text-xl font-bold text-white mb-2">Заявка отправлена!</div>
                <div className="text-gray-400 text-sm">Свяжемся с вами в течение 24 часов</div>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white mb-1">Получить расчёт бесплатно</h3>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  <input required type="text" placeholder="Ваше имя"
                    className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none"
                    style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <input required type="tel" placeholder="Телефон"
                    className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none"
                    style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <input required type="email" placeholder="Email"
                  className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none"
                  style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }} />
                <select className="w-full px-4 py-3 text-sm rounded-lg focus:outline-none"
                  style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)", color: "#9CA3AF" }}>
                  <option>Тип объекта</option>
                  <option>Торговый центр</option>
                  <option>Склад / Логистика</option>
                  <option>Бизнес-центр</option>
                  <option>Производство</option>
                  <option>Другое</option>
                </select>
                <textarea placeholder="Описание объекта (площадь, задача)" rows={3} required
                  className="w-full px-4 py-3 text-sm text-white rounded-lg focus:outline-none resize-none"
                  style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.1)" }} />
                <button type="submit" className="btn-primary w-full text-base">Отправить заявку</button>
                <p className="text-xs text-gray-600 text-center">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
