"use client";

import { motion } from "framer-motion";
import { ArrowRight, ClipboardList, Wrench, ShieldCheck, Search } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: ClipboardList,
    title: "Проектирование",
    description: "Разрабатываем проектную документацию для систем АПС, СОУЭ, АУПТ. Полный комплект для согласования в МЧС.",
    link: "/services/proektirovanie",
  },
  {
    icon: Wrench,
    title: "Монтаж",
    description: "Установка оборудования ведущих производителей. Соблюдаем СНиП и требования МЧС.",
    link: "/services/montazh",
  },
  {
    icon: ShieldCheck,
    title: "Обслуживание",
    description: "Техническое обслуживание, ремонт, поверка приборов. Гарантируем работоспособность систем.",
    link: "/services/obsluzhivanie",
  },
  {
    icon: Search,
    title: "Аудит",
    description: "Проверка соответствия систем требованиям МЧС. Выдача заключения и рекомендаций.",
    link: "/services/audit",
  },
];

export default function WhatWeDo() {
  return (
    <section className="section bg-white dark:bg-slate-900">
      <div className="container-xl">
        <div className="text-center mb-12">
          <div className="badge mb-4">Услуги</div>
          <h2 className="heading-lg text-slate-900 dark:text-white mb-4">
            Что мы делаем
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Полный цикл работ по пожарной безопасности: от проектирования до обслуживания.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-elevated group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <Link href={service.link} className="block">
                <div className="w-12 h-12 rounded-lg bg-red-600/10 flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                  <service.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="heading-md text-slate-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>
                <div className="flex items-center text-red-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Подробнее
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}