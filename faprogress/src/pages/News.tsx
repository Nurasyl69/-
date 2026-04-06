import { useEffect, useState } from 'react';
import { Calendar, Newspaper } from 'lucide-react';
import { supabase, News as NewsType } from '../lib/supabase';

export default function News() {
  const [news, setNews] = useState<NewsType[]>([]);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (data) setNews(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Newspaper className="w-12 h-12 text-[#C4A572]" />
          <h1 className="text-5xl font-bold text-center text-[#C4A572]">
            Новости
          </h1>
        </div>
        <p className="text-xl text-center text-gray-300 mb-16">
          Следите за нашими достижениями и событиями
        </p>

        <div className="space-y-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 overflow-hidden hover:border-[#C4A572] transition-all duration-300"
            >
              <div className="md:flex">
                {item.image_url && (
                  <div className="md:w-1/3">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={`p-8 ${item.image_url ? 'md:w-2/3' : 'w-full'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-5 h-5 text-[#C4A572]" />
                    <span className="text-gray-400">
                      {new Date(item.created_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-4">{item.title}</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              Новостей пока нет. Скоро здесь появятся наши достижения!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}