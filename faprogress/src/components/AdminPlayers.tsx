import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';
import { supabase, Player, Group } from '../lib/supabase';

export default function AdminPlayers() {
  const [players, setPlayers] = useState<(Player & { group?: Group })[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    group_id: '',
    name: '',
    birth_year: new Date().getFullYear(),
    parent_name: '',
    parent_phone: '',
    parent_telegram: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [playersRes, groupsRes] = await Promise.all([
      supabase.from('players').select('*').order('created_at', { ascending: false }),
      supabase.from('groups').select('*'),
    ]);

    if (groupsRes.data) setGroups(groupsRes.data);

    if (playersRes.data && groupsRes.data) {
      const playersWithGroups = playersRes.data.map((player) => ({
        ...player,
        group: groupsRes.data.find((g) => g.id === player.group_id),
      }));
      setPlayers(playersWithGroups);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await supabase.from('players').update(formData).eq('id', editingId);
    } else {
      await supabase.from('players').insert([formData]);
    }

    resetForm();
    loadData();
  };

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setFormData({
      group_id: player.group_id,
      name: player.name,
      birth_year: player.birth_year,
      parent_name: player.parent_name,
      parent_phone: player.parent_phone,
      parent_telegram: player.parent_telegram,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить игрока?')) {
      await supabase.from('players').delete().eq('id', id);
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      group_id: '',
      name: '',
      birth_year: new Date().getFullYear(),
      parent_name: '',
      parent_phone: '',
      parent_telegram: '',
    });
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Управление игроками</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-[#C4A572] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#D4B582] transition-all"
        >
          <Plus size={20} />
          Добавить игрока
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
          <input
            type="text"
            placeholder="Имя и фамилия"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
            required
          />
          <input
            type="number"
            placeholder="Год рождения"
            value={formData.birth_year}
            onChange={(e) => setFormData({ ...formData, birth_year: parseInt(e.target.value) })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
            required
          />
          <input
            type="text"
            placeholder="Имя родителя"
            value={formData.parent_name}
            onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
            required
          />
          <input
            type="tel"
            placeholder="Телефон родителя"
            value={formData.parent_phone}
            onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
            required
          />
          <input
            type="text"
            placeholder="Telegram (необязательно)"
            value={formData.parent_telegram}
            onChange={(e) => setFormData({ ...formData, parent_telegram: e.target.value })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
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
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-black/30 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">{player.name}</h3>
                <p className="text-[#C4A572] mb-2">{player.group?.name}</p>
                <p className="text-gray-400 text-sm">Год рождения: {player.birth_year}</p>
                <p className="text-gray-400 text-sm">
                  Родитель: {player.parent_name} - {player.parent_phone}
                </p>
                {player.parent_telegram && (
                  <p className="text-gray-400 text-sm">Telegram: {player.parent_telegram}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(player)}
                  className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(player.id)}
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
