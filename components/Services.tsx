"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, FileText, Wrench, Calendar, FileCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Проектирование",
    description: "Разработка проектной документации для систем АПС, СОУЭ, пожаротушения. Полный комплект согласований и экспертизы.",
    price: "от 15 000 ₽",
    duration: "5-10 дней",
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Монтаж систем",
    description: "Установка и ввод в эксплуатацию систем пожарной безопасности. Гарантия 2 года, сертифицированные специалисты.",
    price: "договорная",
    duration: "по графику",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Сдача в МЧС",
    description: "Подготовка документов, сопровождение проверок, получение разрешения от МЧС России. Гарантия результата.",
    price: "от 25 000 ₽",
    duration: "7-14 дней",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Обслуживание",
    description: "Техническое обслуживание АПС, СОУЭ, огнетушителей. Плановые проверки и пусконаладка, круглосуточная поддержка.",
    price: "от 5 000 ₽/мес",
    duration: "постоянно",
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: "Аудит безопасности",
    description: "Проверка соответствия вашего объекта требованиям МЧС и СНиП. Акт выявленных нарушений и рекомендации.",
    price: "от 10 000 ₽",
    duration: "1-2 дня",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Обучение по ПБ",
    description: "Повышение квалификации для сотрудников и руководителей. Сертификаты МЧС, онлайн и очно.",
    price: "от 8 000 ₽",
    duration: "1-3 дня",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label">Услуги</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-3 mb-4">
            Что мы делаем
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Полный цикл работ по пожарной безопасности — от проектирования до сдачи в МЧС.
            Работаем под ключ, без скрытых платежей.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-border hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-red-600/10 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-red-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div>
                  <div className="text-sm font-semibold text-red-600">{service.price}</div>
                  <div className="text-xs text-muted-foreground">{service.duration}</div>
                </div>
                <a
                  href="#contact"
                  className="text-sm text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
                >
                  Заказать <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a href="#contact" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Получить консультацию
          </a>
        </motion.div>
      </div>
    </section>
  );
}
