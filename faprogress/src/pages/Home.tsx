import { useEffect, useState } from 'react';
import { Trophy, Users, Target, Award } from 'lucide-react';
import { supabase, News } from '../lib/supabase';

export default function Home() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (data) setNews(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src="/image.png"
          alt="FA Progress"
          className="absolute inset-0 w-full h-full object-contain opacity-20"
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-[#C4A572] mb-4 drop-shadow-2xl">
            FA PROGRESS
          </h1>
          <p className="text-2xl md:text-4xl text-white mb-8 font-light">
            Football Academy
          </p>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Профессиональная футбольная академия для детей и подростков.
            Развиваем таланты, воспитываем чемпионов.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#C4A572] mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Trophy, title: 'Профессиональный подход', desc: 'Опытные тренеры с лицензиями UEFA' },
              { icon: Users, title: 'Малые группы', desc: 'Индивидуальный подход к каждому ребенку' },
              { icon: Target, title: 'Современные методики', desc: 'Программы, соответствующие мировым стандартам' },
              { icon: Award, title: 'Достижения', desc: 'Наши воспитанники играют в ведущих клубах' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#C4A572]/10 to-transparent p-6 rounded-xl border border-[#C4A572]/30 hover:border-[#C4A572] transition-all duration-300 hover:scale-105"
              >
                <item.icon className="w-12 h-12 text-[#C4A572] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {news.length > 0 && (
        <section className="py-20 px-4 bg-black/30">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center text-[#C4A572] mb-12">
              Последние новости
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-white/5 to-transparent rounded-xl overflow-hidden border border-white/10 hover:border-[#C4A572]/50 transition-all duration-300 hover:scale-105"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 line-clamp-3">{item.content}</p>
                    <p className="text-[#C4A572] text-sm mt-4">
                      {new Date(item.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#C4A572] mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Запишитесь на пробную тренировку и станьте частью нашей команды
          </p>
          <button
            onClick={() => window.open('https://wa.me/77751175082?text=Здравствуйте! Хочу записаться на тренировку', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Записаться на тренировку
          </button>
        </div>
      </section>
    </div>
  );
}
