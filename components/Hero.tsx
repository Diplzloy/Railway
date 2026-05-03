"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-red-950">
      {/* Background image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
      </div>

      {/* Red glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-600/30 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 mb-6">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">
                Лицензия МЧС № 0123456
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-6">
              <span className="text-gradient-red">НЕГОРИМ</span>
              <br />
              <span className="text-slate-200">Защита вашего бизнеса</span>
              <br />
              <span className="text-slate-400 text-3xl sm:text-4xl lg:text-5xl">
                от пожара
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed">
              Проектируем, монтируем и обслуживаем системы пожарной безопасности.
              320+ объектов сдано в МЧС с первого раза. Гарантия результата.
            </p>

            {/* Benefits */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Сдача с первого раза</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Ответственность 100 млн ₽</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">9 лет на рынке</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">Сроки от 3 дней</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <a href="#contact" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg hover:shadow-red-600/30 flex items-center gap-2">
                Получить расчёт
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#services" className="border border-slate-600 hover:border-slate-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                Наши услуги
              </a>
            </div>
          </motion.div>

          {/* Right content - Image/Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Stats cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "320+", label: "объектов сдано" },
                  { num: "98%", label: "с первого раза" },
                  { num: "10 лет", label: "на рынке" },
                  { num: "100 млн", label: "страхование" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                  >
                    <div className="text-3xl font-black text-red-400">{stat.num}</div>
                    <div className="text-sm text-slate-300 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Large stat */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -bottom-10 -left-10 bg-red-600 rounded-2xl p-6 text-white shadow-xl"
              >
                <div className="text-sm opacity-80 mb-1">Старт работ</div>
                <div className="text-2xl font-bold">от 3 дней</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-slate-500 flex justify-center pt-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        </motion.div>
      </div>
    </section>
  );
}
