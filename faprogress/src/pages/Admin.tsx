import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Newspaper, Users, Calendar } from 'lucide-react';
import AdminLogin from '../components/AdminLogin';
import AdminNews from '../components/AdminNews';
import AdminPlayers from '../components/AdminPlayers';
import AdminSchedule from '../components/AdminSchedule';

export default function Admin() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'news' | 'players' | 'schedule'>('news');

  if (!user) {
    return <AdminLogin />;
  }

  const tabs = [
    { id: 'news' as const, label: 'Новости', icon: Newspaper },
    { id: 'players' as const, label: 'Игроки', icon: Users },
    { id: 'schedule' as const, label: 'Расписание', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#C4A572]">Панель управления</h1>
          <button
            onClick={signOut}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
          >
            <LogOut size={20} />
            Выйти
          </button>
        </div>

        <div className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 overflow-hidden">
          <div className="flex border-b border-[#C4A572]/30">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#C4A572] text-black font-bold'
                    : 'text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'news' && <AdminNews />}
            {activeTab === 'players' && <AdminPlayers />}
            {activeTab === 'schedule' && <AdminSchedule />}
          </div>
        </div>
      </div>
    </div>
  );
}
