import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { supabase, Schedule, Group } from '../lib/supabase';

export default function AdminSchedule() {
  const [schedules, setSchedules] = useState<(Schedule & { group?: Group })[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    group_id: '',
    day_of_week: 1,
    time_start: '',
    time_end: '',
    location: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [schedulesRes, groupsRes] = await Promise.all([
      supabase.from('schedule').select('*').order('day_of_week').order('time_start'),
      supabase.from('groups').select('*'),
    ]);

    if (groupsRes.data) setGroups(groupsRes.data);

    if (schedulesRes.data && groupsRes.data) {
      const schedulesWithGroups = schedulesRes.data.map((schedule) => ({
        ...schedule,
        group: groupsRes.data.find((g) => g.id === schedule.group_id),
      }));
      setSchedules(schedulesWithGroups);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await supabase.from('schedule').update(formData).eq('id', editingId);
    } else {
      await supabase.from('schedule').insert([formData]);
    }

    resetForm();
    loadData();
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setFormData({
      group_id: schedule.group_id,
      day_of_week: schedule.day_of_week,
      time_start: schedule.time_start,
      time_end: schedule.time_end,
      location: schedule.location,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить расписание?')) {
      await supabase.from('schedule').delete().eq('id', id);
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      group_id: '',
      day_of_week: 1,
      time_start: '',
      time_end: '',
      location: '',
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const getDayName = (day: number) => {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[day];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Управление расписанием</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-[#C4A572] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#D4B582] transition-all"
        >
          <Plus size={20} />
          Добавить занятие
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-black/30 rounded-xl p-6 mb-6 space-y-4">
          <select
            value={formData.group_id}
            onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
            required
          >
            <option value="">Выберите группу</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <select
            value={formData.day_of_week}
            onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
            required
          >
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <option key={day} value={day}>
                {getDayName(day)}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              placeholder="Начало"
              value={formData.time_start}
              onChange={(e) => setFormData({ ...formData, time_start: e.target.value })}
              className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
              required
            />
            <input
              type="time"
              placeholder="Конец"
              value={formData.time_end}
              onChange={(e) => setFormData({ ...formData, time_end: e.target.value })}
              className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Место проведения"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-[#C4A572] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#D4B582]"
            >
              {editingId ? 'Сохранить' : 'Создать'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-black/30 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {schedule.group?.name}
                </h3>
                <p className="text-[#C4A572] mb-2">{getDayName(schedule.day_of_week)}</p>
                <p className="text-gray-400 text-sm">
                  Время: {schedule.time_start.substring(0, 5)} - {schedule.time_end.substring(0, 5)}
                </p>
                <p className="text-gray-400 text-sm">Место: {schedule.location}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(schedule)}
                  className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(schedule.id)}
                  className="p-2 bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
