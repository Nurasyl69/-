import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase, News } from '../lib/supabase';

export default function AdminNews() {
  const [news, setNews] = useState<News[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    published: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setNews(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingId) {
        const { error: err } = await supabase.from('news').update(formData).eq('id', editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('news').insert([formData]);
        if (err) throw err;
      }

      resetForm();
      await loadNews();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: News) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      content: item.content,
      image_url: item.image_url,
      published: item.published,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить новость?')) {
      await supabase.from('news').delete().eq('id', id);
      loadNews();
    }
  };

  const togglePublished = async (item: News) => {
    await supabase
      .from('news')
      .update({ published: !item.published })
      .eq('id', item.id);
    loadNews();
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', image_url: '', published: false });
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Управление новостями</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-[#C4A572] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#D4B582] transition-all"
        >
          <Plus size={20} />
          Добавить новость
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-black/30 rounded-xl p-6 mb-6 space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg px-4 py-3 text-red-400">
              {error}
            </div>
          )}
          <input
            type="text"
            placeholder="Заголовок"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
            required
          />
          <textarea
            placeholder="Содержание"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white min-h-[150px]"
            required
          />
          <input
            type="url"
            placeholder="URL изображения (необязательно)"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white"
          />
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-5 h-5"
            />
            Опубликовать
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#C4A572] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#D4B582] disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : editingId ? 'Сохранить' : 'Создать'}
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
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-black/30 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  {item.published ? (
                    <Eye className="w-5 h-5 text-green-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <p className="text-gray-400 mb-2 line-clamp-2">{item.content}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(item.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePublished(item)}
                  className={`p-2 rounded-lg ${
                    item.published ? 'bg-green-600' : 'bg-gray-600'
                  } hover:opacity-80`}
                >
                  {item.published ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
