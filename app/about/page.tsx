import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-white dark:bg-slate-900">
        <div className="container-xl py-16">
          {/* Hero */}
          <div className="mb-16">
            <div className="badge mb-4">О компании</div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mt-3">
              НЕГОРИМ — профессиональная защита от пожаров
            </h1>
            <p className="text-xl mt-6 text-slate-600 dark:text-slate-400 max-w-3xl">
              Компания «НЕГОРИМ» специализируется на комплексных решениях по пожарной безопасности с 2016 года.
              Мы проектируем, монтируем и обслуживаем системы пожарной безопасности любого масштаба.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { num: "9+", label: "лет на рынке" },
              { num: "320+", label: "объектов сдано" },
              { num: "98%", label: "с первого раза" },
              { num: "100M+", label: "страхование" },
            ].map(s => (
              <div key={s.label} className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div className="text-3xl md:text-4xl font-black mb-2 text-red-600">{s.num}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Story */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                Наша миссия — безопасность вашего бизнеса
              </h2>
              <p className="mb-4 text-slate-600 dark:text-slate-400">
                Мы понимаем, что пожарная безопасность — это не просто требование закона, а ключевой фактор,
                который защищает ваш бизнес от финансовых потерь и репутационных рисков.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Каждый объект, который мы сдаём в МЧС, проходит строгий контроль качества.
                Наша команда сертифицированных специалистов гарантирует соответствие всем нормативным требованиям.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              <div className="aspect-video bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800')" }} />
            </div>
          </div>

          {/* Services preview */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">
              Что мы делаем
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "📊",
                  title: "Проектирование",
                  desc: "Разработка проектной документации для систем пожарной безопасности.",
                },
                {
                  icon: "🔧",
                  title: "Монтаж",
                  desc: "Установка и ввод в эксплуатацию систем АПС, СОУЭ, пожаротушения.",
                },
                {
                  icon: "✅",
                  title: "Сдача в МЧС",
                  desc: "Подготовка документов и сопровождение проверок для получения разрешения.",
                },
              ].map(s => (
                <div key={s.title} className="p-6 rounded-2xl text-center bg-slate-50 dark:bg-slate-800">
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Наша команда
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Сертифицированные инженеры и специалисты с опытом работы от 5 лет.
                Постоянное обучение новым нормативам и технологиям.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}