"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle, Clock, Briefcase } from "lucide-react";

const advantages = [
  {
    icon: Award,
    title: "Лицензии МЧС",
    description: "Все лицензии и допуски СРО на проектирование и монтаж.",
  },
  {
    icon: CheckCircle,
    title: "Гарантия",
    description: "Гарантия на работы до 3 лет. Страхование ответственности 100 млн ₽.",
  },
  {
    icon: Clock,
    title: "Сроки",
    description: "Проект от 3 дней. Монтаж от 5 дней. Быстро и качественно.",
  },
  {
    icon: Briefcase,
    title: "Опыт",
    description: "9 лет на рынке. 320+ объектов. Клиенты от малого бизнеса до федеральных сетей.",
  },
];

export default function Advantages() {
  return (
    <section className="section bg-white dark:bg-slate-900">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge mb-4">Преимущества</div>
            <h2 className="heading-lg text-slate-900 dark:text-white mb-4">
              Почему нас выбирают
            </h2>
            <p className="text-muted text-lg mb-6">
              Мы работаем на результат. Ваша безопасность — наша репутация.
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Сдача объектов в МЧС с первого раза — наш стандарт.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Полный пакет документов: от сметы до акта выполненных работ.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Прозрачные цены. Фиксированная стоимость в договоре.</span>
              </li>
            </ul>
          </motion.div>

          {/* Right cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {advantages.map((adv, index) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-elevated"
              >
                <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center mb-3">
                  <adv.icon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="heading-md text-slate-900 dark:text-white mb-2">
                  {adv.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {adv.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}