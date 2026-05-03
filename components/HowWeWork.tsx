"use client";

import { motion } from "framer-motion";
import { FileText, Wrench, Calendar, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <FileText className="w-6 h-6" />,
    number: "01",
    title: "Заявка и выезд",
    description: "Оставляете заявку, наш инженер выезжает на объект для бесплатной оценки и замеров.",
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    number: "02",
    title: "Разработка проекта",
    description: "Готовим проектную документацию с учётом нормативов и особенностей объекта.",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    number: "03",
    title: "Монтаж и пусконаладка",
    description: "Установка систем и приведение в рабочее состояние. Тестирование всех компонентов.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    number: "04",
    title: "Сдача в МЧС",
    description: "Подготовка и подача документов, сопровождение проверки, получение разрешения.",
  },
];

export default function HowWeWork() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label">Как мы работаем</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-3">
            Четыре простых шага
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600/30 via-red-600 to-red-600/30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {/* Number */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center z-10">
                {step.number}
              </div>

              {/* Content */}
              <div className="pt-10 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-red-600">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
