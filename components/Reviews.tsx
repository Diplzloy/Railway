const reviews = [
  { name: "Алексей Р.", role: "Директор по эксплуатации", company: "ТЦ «Меридиан»", text: "С НЕГОРИМ наконец выдохнули — закрыли проект от чертежа до сдачи МЧС. Проверку прошли чисто. Работаем третий год." },
  { name: "Марина К.", role: "Руководитель службы безопасности", company: "Логистическая компания", text: "Нужно было срочно привести склад в соответствие. НЕГОРИМ уложились в 6 недель — без лишних нервов." },
  { name: "Игорь С.", role: "Генеральный директор", company: "Девелоперская группа", text: "Работаем на третьем объекте подряд. Свои инженеры — не надо каждый раз объяснять требования заново." },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24" style={{ background: "#111111" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <div className="section-label mb-3">Отзывы</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Нас рекомендуют</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map(r => (
            <div key={r.name} className="card-dark p-8">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4" fill="#CC0000" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #660000, #CC0000)" }}>
                  {r.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.role} · {r.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
