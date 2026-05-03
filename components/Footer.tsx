"use client";

import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top section */}
      <div className="py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                  <span className="text-white font-black text-xl">Н</span>
                </div>
                <div>
                  <div className="text-white font-bold">НЕГОРИМ</div>
                  <div className="text-xs text-slate-500 -mt-0.5">
                    Пожарная безопасность
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Комплексные решения по пожарной безопасности.
                Проектирование, монтаж, согласовали более 200 сту.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 flex items-center justify-center transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-red-400 transition-colors">Проектирование</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">Монтаж систем</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">Сдача в МЧС</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">Обслуживание</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">Аудит безопасности</a></li>
              </ul>
            </div>

            {/* Documents */}
            <div>
              <h4 className="text-white font-semibold mb-4">Документы</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/documents" className="hover:text-red-400 transition-colors">Федеральные законы</a></li>
                <li><a href="/documents" className="hover:text-red-400 transition-colors">Своды правил (СП)</a></li>
                <li><a href="/documents" className="hover:text-red-400 transition-colors">ГОСТы</a></li>
                <li><a href="/documents" className="hover:text-red-400 transition-colors">Приказы МЧС</a></li>
                <li><a href="/documents" className="hover:text-red-400 transition-colors">Письма МЧС</a></li>
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="text-white font-semibold mb-4">Контакты</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-red-500" />
                  <span>+7 (999) 123-45-67</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-red-500" />
                  <span>info@negorim.ru</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-red-500" />
                  <span>Москва, ул. Примерная, 1</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 НЕГОРИМ. Все права защищены.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Договор оферты</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
