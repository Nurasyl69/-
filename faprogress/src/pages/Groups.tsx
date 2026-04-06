import { useEffect, useState } from 'react';
import { Users, Calendar, MapPin } from 'lucide-react';
import { supabase, Group, Schedule } from '../lib/supabase';

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [groupsRes, schedulesRes] = await Promise.all([
      supabase.from('groups').select('*').order('created_at'),
      supabase.from('schedule').select('*'),
    ]);

    if (groupsRes.data) setGroups(groupsRes.data);
    if (schedulesRes.data) setSchedules(schedulesRes.data);
  };

  const getGroupSchedule = (groupId: string) => {
    return schedules.filter((s) => s.group_id === groupId);
  };

  const getDayName = (day: number) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[day];
  };

  const handleWhatsAppClick = (groupName: string) => {
    const message = encodeURIComponent(`Здравствуйте! Хочу записаться в группу "${groupName}"`);
    window.open(`https://wa.me/77751175082?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-center text-[#C4A572] mb-4">
          Наши группы
        </h1>
        <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
          Мы предлагаем программы для детей разных возрастов с учетом их физического и технического развития
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {groups.map((group) => {
            const groupSchedule = getGroupSchedule(group.id);
            return (
              <div
                key={group.id}
                className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 p-8 hover:border-[#C4A572] transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-10 h-10 text-[#C4A572]" />
                  <h2 className="text-2xl font-bold text-white">{group.name}</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#C4A572] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold">{group.age_range}</p>
                      <p className="text-gray-400 text-sm">Год рождения: {group.birth_years}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 leading-relaxed">{group.description}</p>
                </div>

                {groupSchedule.length > 0 && (
                  <div className="border-t border-[#C4A572]/30 pt-6">
                    <h3 className="text-lg font-bold text-[#C4A572] mb-3">Расписание:</h3>
                    <div className="space-y-3">
                      {groupSchedule.map((schedule) => (
                        <div key={schedule.id} className="bg-black/30 rounded-lg p-3">
                          <p className="text-white font-semibold">
                            {getDayName(schedule.day_of_week)}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {schedule.time_start.substring(0, 5)} - {schedule.time_end.substring(0, 5)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-[#C4A572]" />
                            <p className="text-gray-300 text-sm">{schedule.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleWhatsAppClick(group.name)}
                  className="w-full mt-6 bg-[#25D366] hover:bg-[#20b859] text-white font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.277-.553c.951.542 2.079.829 3.248.828 3.18 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.69-5.762-5.69zm3.392 8.244c-.144.405-.835.789-1.141.83-.266.036-.63.048-1.105-.157-.723-.312-1.417-.93-1.816-1.558-.249-.391-.531-.882-.531-1.343 0-.462.193-.789.417-1.045.193-.223.416-.362.416-.568 0-.207-.114-.467-.24-.667-.165-.261-.423-.789-.56-1.053-.138-.264-.276-.22-.392-.225-.092-.005-.2-.005-.307-.005-.221 0-.578.083-.882.416-.406.445-.74 1.083-.74 1.937 0 .854.315 1.624.732 2.195.415.571 1.131 1.148 1.894 1.484.76.336 1.511.423 2.029.352.52-.071 1.316-.537 1.5-1.055.183-.518.183-.962.129-1.055-.054-.093-.2-.149-.417-.259-.217-.111-.894-.44-1.033-.491-.139-.05-.241-.074-.342.112-.101.185-.392.49-.48.59-.088.1-.176.112-.327.038-.15-.074-.633-.234-1.205-.744-.449-.4-.768-.942-.84-1.102-.073-.16-.009-.248.055-.33.055-.074.123-.185.185-.277.062-.093.083-.167.124-.277.041-.111.021-.208-.01-.291-.031-.083-.203-.489-.292-.672-.087-.18-.176-.154-.24-.157-.062-.003-.134-.003-.206-.003-.186 0-.486.07-.74.333-.38.392-.828 1.129-.828 2.009 0 .881.393 1.7.592 2.046.199.346 1.028 1.567 2.484 2.196.964.416 1.533.484 2.048.446.515-.038 1.316-.538 1.5-1.056.183-.518.183-.962.129-1.055-.054-.093-.2-.149-.417-.259z"/>
                  </svg>
                  Записаться в WhatsApp
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}