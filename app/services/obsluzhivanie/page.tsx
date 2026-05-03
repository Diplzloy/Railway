import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle, ArrowRight, ShieldCheck, Clock } from "lucide-react";

export default function ObsluzhivaniePage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 py-20">
          <div className="container-xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="badge mb-4">Услуга</div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                  Обслуживание систем пожарной безопасности
                </h1>
                <p className="text-slate-300 text-lg mb-6">
                  Техническое обслуживание, ремонт, поверка приборов.
                  Гарантируем работоспособность систем 24/7.
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Техническое обслуживание АПС
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Техническое обслуживание СОУЭ
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Поверка приборов и датчиков
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Экстренный ремонт
                  </li>
                </ul>
              </div>
              <div className="hidden lg:block">
                <div className="card-elevated bg-white/10 border-white/20">
                  <div className="text-center py-8">
                    <ShieldCheck className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <div className="text-2xl font-bold text-white mb-2">Гарантия</div>
                    <div className="text-slate-300">до 3 лет</div>
                    <div className="text-2xl font-bold text-white mt-6 mb-2">Стоимость</div>
                    <div className="text-slate-300">договорная</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container-xl">
            <h2 className="heading-lg text-slate-900 dark:text-white text-center mb-12">
              Что входит в обслуживание
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Визуальный осмотр оборудования</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Проверка работоспособности</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Очистка приборов от пыли</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Проверка электропитания</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Тестирование системы</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Поверка приборов (раз в год)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Замена неисправных элементов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Обновление ПО (при необходимости)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Подготовка отчетности</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Круглосуточная поддержка</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stages */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
          <div className="container-xl">
            <h2 className="heading-lg text-slate-900 dark:text-white text-center mb-12">
              Этапы обслуживания
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { num: "1", title: "Договор", desc: "Заключение договора на обслуживание" },
                { num: "2", title: "План работ", desc: "Составление графика обслуживания" },
                { num: "3", title: "Техобслуживание", desc: "Регулярные проверки и ремонт" },
                { num: "4", title: "Отчетность", desc: "Предоставление отчетов о выполненных работах" },
              ].map((stage) => (
                <div key={stage.num} className="card-elevated text-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold mx-auto mb-3">
                    {stage.num}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-red-600">
          <div className="container-xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Заключите договор на обслуживание
            </h2>
            <p className="text-red-100 mb-6 max-w-xl mx-auto">
              Получите бесплатную консультацию и расчёт стоимости.
            </p>
            <a href="#contact" className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors inline-flex items-center gap-2">
              Получить расчёт
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}