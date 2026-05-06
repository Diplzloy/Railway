"use client";

import { motion } from "framer-motion";
import { ClipboardList, Wrench, ShieldCheck, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ServicesPreview() {
  const services = [
    {
      icon: ClipboardList,
      title: "Проектирование",
      description: "Разработка проектной документации для систем АПС, СОУЭ, АУПТ. Полный комплект для согласования в МЧС.",
      link: "/services/proektirovanie",
      price: "от 15 000 ₽",
      features: ["Проект АПС", "Проект СОУЭ", "Проект АУПТ", "Согласование в МЧС"],
    },
    {
      icon: Wrench,
      title: "Монтаж",
      description: "Установка оборудования ведущих производителей. Соблюдаем СНиП и требования МЧС.",
      link: "/services/montazh",
      price: "от 50 000 ₽",
      features: ["Монтаж АПС", "Монтаж СОУЭ", "Монтаж АУПТ", "Пусконаладка"],
    },
    {
      icon: ShieldCheck,
      title: "Обслуживание",
      description: "Техническое обслуживание, ремонт, поверка приборов. Гарантируем работоспособность систем.",
      link: "/services/obsluzhivanie",
      price: "договорная",
      features: ["ТО АПС", "ТО СОУЭ", "Поверка приборов", "24/7 поддержка"],
    },
    {
      icon: Search,
      title: "Аудит",
      description: "Проверка соответствия систем требованиям МЧС. Выдача заключения и рекомендаций.",
      link: "/services/audit",
      price: "от 10 000 ₽",
      features: ["Проверка проектов", "Осмотр систем", "Заключение МЧС", "Рекомендации"],
    },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge mb-3">Услуги</div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Услуги пожарной безопасности
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Полный цикл работ: от проектирования до обслуживания. Согласовали более 200 сту.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-red-600/10 flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                <service.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {service.description}
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-red-600 font-semibold">{service.price}</span>
                <Link
                  href={service.link}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 group/link"
                >
                  Подробнее
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* All services link */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
          >
            Все услуги
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
