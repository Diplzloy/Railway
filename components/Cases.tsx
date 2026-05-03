const cases = [
  { title: "Торговый центр «Меридиан»", area: "12 000 м²", city: "Москва", result: "Сдано МЧС без замечаний", period: "3 месяца", scope: "Сигнализация + пожаротушение + дымоудаление", img: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80" },
  { title: "Складской комплекс «Логопарк»", area: "25 000 м²", city: "Московская обл.", result: "Введён в эксплуатацию", period: "4 месяца", scope: "Спринклерная система + газовое тушение", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80" },
  { title: "Бизнес-центр «Высота»", area: "18 000 м²", city: "Москва, центр", result: "Ложные срабатывания → 0", period: "6 недель", scope: "Замена устаревшей системы", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
  { title: "Завод автокомпонентов", area: "8 500 м²", city: "Калуга", result: "Аттестация пройдена", period: "2 месяца", scope: "Сигнализация + тушение + СОУЭ", img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80" },
];

export default function Cases() {
  return (
    <section id="cases" className="py-24" style={{ background: "#0D0D0D" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <div className="section-label mb-3">Кейсы</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Реализованные проекты</h2>
          <p className="text-gray-400 text-lg max-w-2xl">Объекты, которые мы сдали МЧС — с реальными результатами.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {cases.map(c => (
            <div key={c.title} className="card-dark overflow-hidden group">
              <div className="relative h-52 overflow-hidden">
                <img src={c.img} alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1A1A1A 0%, transparent 60%)" }} />
                <div className="absolute bottom-3 left-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(153,0,0,0.8)", color: "#FFAAAA" }}>{c.area}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(0,0,0,0.6)", color: "#9CA3AF" }}>{c.city}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} />
                  <span className="text-sm font-semibold" style={{ color: "#4ADE80" }}>{c.result}</span>
                  <span className="text-xs text-gray-600">/ {c.period}</span>
                </div>
                <h3 className="font-black text-white text-lg mb-1 group-hover:text-red-400 transition-colors">{c.title}</h3>
                <p className="text-gray-500 text-sm">{c.scope}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
