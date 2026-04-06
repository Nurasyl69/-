import { Phone, Mail, MapPin, Instagram } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-center text-[#C4A572] mb-4">
          Контакты
        </h1>
        <p className="text-xl text-center text-gray-300 mb-16">
          Свяжитесь с нами любым удобным способом
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/fa_progress"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 p-8 hover:border-[#C4A572] transition-all duration-300 hover:scale-105 flex items-start gap-4 cursor-pointer"
          >
            <Instagram className="w-12 h-12 text-[#C4A572] flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Instagram</h3>
              <p className="text-gray-300">@fa_progress</p>
              <p className="text-gray-400 text-sm mt-2">
                Наш Instagram
              </p>
            </div>
          </a>

          {/* Телефон */}
          <a
            href="tel:+77751175082"
            className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 p-8 hover:border-[#C4A572] transition-all duration-300 hover:scale-105 flex items-start gap-4 cursor-pointer"
          >
            <Phone className="w-12 h-12 text-[#C4A572] flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Телефон</h3>
              <p className="text-gray-300">+7 (775) 117-50-82</p>
              <p className="text-gray-400 text-sm mt-2">
                Звоните с 9:00 до 21:00
              </p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:info@faprogress.com"
            className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 p-8 hover:border-[#C4A572] transition-all duration-300 hover:scale-105 flex items-start gap-4 cursor-pointer"
          >
            <Mail className="w-12 h-12 text-[#C4A572] flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Email</h3>
              <p className="text-gray-300">info@faprogress.com</p>
              <p className="text-gray-400 text-sm mt-2">
                Ответим в течение 24 часов
              </p>
            </div>
          </a>

          {/* Адрес */}
          <div className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 p-8 flex items-start gap-4">
            <MapPin className="w-12 h-12 text-[#C4A572] flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Адрес</h3>
              <p className="text-gray-300">СК Алатау, Тәуелсіздік 1/1</p>
              <p className="text-gray-400 text-sm mt-2">
                Место проведения тренировок
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Записаться на пробную тренировку
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Первая тренировка бесплатно! Приходите и оцените профессиональный подход
            нашего тренера и дружелюбную атмосферу в команде.
          </p>
          <button
            onClick={() => window.open('https://wa.me/77751175082?text=Здравствуйте! Хочу записаться на тренировку', '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Записаться на тренировку
          </button>
        </div>
      </div>
    </div>
  );
}