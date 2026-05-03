"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 bg-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Нужна пожарная безопасность?
            </h2>
            <p className="text-red-100 text-lg mb-8 max-w-lg">
              Оставьте заявку — наш инженер бесплатно выедет на объект,
              оценит объем работ и составит смету в день обращения.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+79991234567" className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors flex items-center gap-2">
                <Phone className="w-5 h-5" />
                +7 (999) 123-45-67
              </a>
              <a href="#contact" className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
                Оставить заявку
              </a>
            </div>
          </motion.div>

          {/* Right - Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
              <Phone className="w-5 h-5 text-red-200 mb-2" />
              <div className="text-sm text-red-200 mb-1">Телефон</div>
              <div className="text-white font-semibold">+7 (999) 123-45-67</div>
            </div>
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
              <Mail className="w-5 h-5 text-red-200 mb-2" />
              <div className="text-sm text-red-200 mb-1">Email</div>
              <div className="text-white font-semibold">info@negorim.ru</div>
            </div>
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
              <MapPin className="w-5 h-5 text-red-200 mb-2" />
              <div className="text-sm text-red-200 mb-1">Адрес</div>
              <div className="text-white font-semibold">Москва, ул. Примерная, 1</div>
            </div>
            <div className="bg-white/10 rounded-xl p-5 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-red-200 mb-2" />
              <div className="text-sm text-red-200 mb-1">Часы работы</div>
              <div className="text-white font-semibold">Пн-Пт: 9:00 — 18:00</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
