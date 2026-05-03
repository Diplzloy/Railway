"use client";

import { Phone, MapPin, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container-xl py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                <span className="text-white font-black text-xl">Н</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white">НЕГОРИМ</div>
                <div className="text-[10px] text-slate-500">Пожарная безопасность</div>
              </div>
            </div>
            <p className="text-sm mb-4">
              Проектирование, монтаж и обслуживание систем пожарной безопасности.
              Согласовали более 200 сту.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                <span className="text-xs">VK</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                <span className="text-xs">TG</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                <span className="text-xs">YT</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/proektirovanie" className="hover:text-red-400 transition-colors">
                  Проектирование
                </Link>
              </li>
              <li>
                <Link href="/services/montazh" className="hover:text-red-400 transition-colors">
                  Монтаж
                </Link>
              </li>
              <li>
                <Link href="/services/obsluzhivanie" className="hover:text-red-400 transition-colors">
                  Обслуживание
                </Link>
              </li>
              <li>
                <Link href="/services/audit" className="hover:text-red-400 transition-colors">
                  Аудит
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-red-400 transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-red-400 transition-colors">
                  Документы
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-red-400 transition-colors">
                  Новости
                </Link>
              </li>
              <li>
                <a href="#projects" className="hover:text-red-400 transition-colors">
                  Кейсы
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div>+7 (999) 123-45-67</div>
                  <div className="text-xs text-slate-500">Пн-Пт 9:00-18:00</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>Москва, ул. Примерная, д. 1</div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>info@negorim.ru</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>© 2024 НЕГОРИМ. Все права защищены.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-red-400 transition-colors">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-red-400 transition-colors">
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}