import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { supabase, Schedule as ScheduleType, Group } from '../lib/supabase';

export default function Schedule() {
  const [schedules, setSchedules] = useState<(ScheduleType & { group?: Group })[]>([]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    const { data: schedulesData } = await supabase
      .from('schedule')
      .select('*')
      .order('day_of_week')
      .order('time_start');

    if (schedulesData) {
      const { data: groupsData } = await supabase.from('groups').select('*');

      const schedulesWithGroups = schedulesData.map((schedule) => ({
        ...schedule,
        group: groupsData?.find((g) => g.id === schedule.group_id),
      }));

      setSchedules(schedulesWithGroups);
    }
  };

  const getDayName = (day: number) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[day];
  };

  const groupByDay = () => {
    const grouped: { [key: number]: typeof schedules } = {};
    schedules.forEach((schedule) => {
      if (!grouped[schedule.day_of_week]) {
        grouped[schedule.day_of_week] = [];
      }
      grouped[schedule.day_of_week].push(schedule);
    });
    return grouped;
  };

  const groupedSchedules = groupByDay();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-5xl font-bold text-center text-[#C4A572] mb-4">
          Расписание тренировок
        </h1>
        <p className="text-xl text-center text-gray-300 mb-16">
          Выберите удобное время для занятий
        </p>

        <div className="space-y-8">
          {Object.entries(groupedSchedules)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([day, daySchedules]) => (
              <div
                key={day}
                className="bg-gradient-to-br from-[#C4A572]/10 to-transparent rounded-2xl border border-[#C4A572]/30 p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-8 h-8 text-[#C4A572]" />
                  <h2 className="text-3xl font-bold text-white">
                    {getDayName(Number(day))}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {daySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="bg-black/30 rounded-xl p-6 border border-white/10 hover:border-[#C4A572]/50 transition-all duration-300"
                    >
                      <h3 className="text-xl font-bold text-[#C4A572] mb-4">
                        {schedule.group?.name}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#C4A572]" />
                          <span className="text-white">
                            {schedule.time_start.substring(0, 5)} - {schedule.time_end.substring(0, 5)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-[#C4A572]" />
                          <span className="text-gray-300">{schedule.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {schedules.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              Расписание будет добавлено в ближайшее время
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
