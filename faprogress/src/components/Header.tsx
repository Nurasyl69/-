import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'groups', label: 'Группы' },
    { id: 'schedule', label: 'Расписание' },
    { id: 'news', label: 'Новости' },
    { id: 'contact', label: 'Контакты' },
  ];

  return (
    <header className="bg-black border-b border-[#C4A572]/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <img src="/image.png" alt="FA Progress" className="h-10 w-10" />
            <span className="text-2xl font-bold text-[#C4A572]">FA Progress</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#C4A572]"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav
            className={`${
              mobileMenuOpen ? 'block' : 'hidden'
            } md:block absolute md:relative top-full md:top-0 left-0 md:left-auto right-0 bg-black md:bg-transparent border-b md:border-0 border-[#C4A572]/30 w-full md:w-auto`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 p-4 md:p-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 md:py-0 text-left transition-colors ${
                    currentPage === item.id
                      ? 'text-[#C4A572] font-bold'
                      : 'text-gray-300 hover:text-[#C4A572]'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {user ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 md:py-0 text-left transition-colors ${
                      currentPage === 'admin'
                        ? 'text-[#C4A572] font-bold'
                        : 'text-gray-300 hover:text-[#C4A572]'
                    }`}
                  >
                    Админ 
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 md:py-0"
                  >
                    <LogOut size={20} />
                    Выход
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 md:py-0 text-left transition-colors ${
                    currentPage === 'admin'
                      ? 'text-[#C4A572] font-bold'
                      : 'text-gray-300 hover:text-[#C4A572]'
                  }`}
                >
                  Админ
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
