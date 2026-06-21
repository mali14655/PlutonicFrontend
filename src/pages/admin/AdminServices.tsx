import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  active: boolean;
}

interface SubService {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  youtubeUrl: string;
  active: boolean;
  steps: { title: string; description: string; order: number }[];
}

interface City {
  _id: string;
  name: string;
}

export default function AdminServices() {
  const token = localStorage.getItem('admin_token') || '';
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [newSub, setNewSub] = useState({
    name: '',
    slug: '',
    description: '',
    durationMinutes: 60,
    youtubeUrl: '',
    categoryId: '',
  });

  const load = async () => {
    const cats = await adminApi<Category[]>('/admin/cms/categories', token);
    setCategories(cats);
    if (cats.length) setSelectedCategory(cats[0]._id);
    const loc = await adminApi<{ cities: City[] }>('/admin/cms/locations', token);
    setCities(loc.cities);
    if (loc.cities[0]) setSelectedCity(loc.cities[0]._id);
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    load();
  }, [token, navigate]);

  useEffect(() => {
    if (!selectedCategory) return;
    adminApi<SubService[]>(`/admin/cms/sub-services?categoryId=${selectedCategory}`, token).then(setSubServices);
  }, [selectedCategory, token]);

  useEffect(() => {
    if (!selectedCity) return;
    adminApi<{ subServiceId: string; priceAed: number }[]>(
      `/admin/cms/prices?cityId=${selectedCity}`,
      token
    ).then((rows) => {
      const map: Record<string, number> = {};
      rows.forEach((r) => (map[String(r.subServiceId)] = r.priceAed));
      setPrices(map);
    });
  }, [selectedCity, subServices, token]);

  const createSubService = async () => {
    if (!newSub.categoryId || !newSub.name) return;
    await adminApi('/admin/cms/sub-services', token, {
      method: 'POST',
      body: JSON.stringify({
        ...newSub,
        slug: newSub.slug || newSub.name.toLowerCase().replace(/\s+/g, '-'),
        steps: [],
        active: true,
      }),
    });
    setNewSub({ name: '', slug: '', description: '', durationMinutes: 60, youtubeUrl: '', categoryId: selectedCategory });
    const list = await adminApi<SubService[]>(`/admin/cms/sub-services?categoryId=${selectedCategory}`, token);
    setSubServices(list);
  };

  const updatePrice = async (subServiceId: string, priceAed: number) => {
    await adminApi('/admin/cms/prices', token, {
      method: 'PUT',
      body: JSON.stringify({ subServiceId, cityId: selectedCity, priceAed }),
    });
    setPrices((p) => ({ ...p, [subServiceId]: priceAed }));
  };

  const updateSubService = async (id: string, field: string, value: string | number) => {
    await adminApi(`/admin/cms/sub-services/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ [field]: value }),
    });
    setSubServices((list) =>
      list.map((s) => (s._id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-plutonic-blue-dark">Services CMS</h1>

      <div className="premium-card p-6">
        <h2 className="font-bold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCategory(c._id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedCategory === c._id ? 'bg-plutonic-blue text-white' : 'bg-plutonic-surface'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <>
          <div className="premium-card p-6">
            <h2 className="font-bold mb-4">Sub-services</h2>
            <div className="space-y-4">
              {subServices.map((s) => (
                <div key={s._id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <input className="border rounded px-2 py-1 text-sm flex-1 min-w-[120px]" value={s.name}
                      onChange={(e) => updateSubService(s._id, 'name', e.target.value)} />
                    <input type="number" className="border rounded px-2 py-1 text-sm w-24" value={s.durationMinutes}
                      onChange={(e) => updateSubService(s._id, 'durationMinutes', Number(e.target.value))} />
                  </div>
                  <input
                    className="border rounded px-2 py-1 text-sm w-full"
                    placeholder="YouTube URL (paste when ready)"
                    value={s.youtubeUrl || ''}
                    onChange={(e) => updateSubService(s._id, 'youtubeUrl', e.target.value)}
                  />
                  <textarea
                    className="border rounded px-2 py-1 text-sm w-full"
                    rows={2}
                    value={s.description}
                    onChange={(e) => updateSubService(s._id, 'description', e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-3">Add sub-service</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                <input placeholder="Name" className="border rounded-lg px-3 py-2 text-sm"
                  value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value, categoryId: selectedCategory })} />
                <input placeholder="YouTube URL" className="border rounded-lg px-3 py-2 text-sm"
                  value={newSub.youtubeUrl} onChange={(e) => setNewSub({ ...newSub, youtubeUrl: e.target.value })} />
                <input placeholder="Description" className="border rounded-lg px-3 py-2 text-sm sm:col-span-2"
                  value={newSub.description} onChange={(e) => setNewSub({ ...newSub, description: e.target.value })} />
              </div>
              <button onClick={createSubService} className="mt-3 bg-plutonic-blue text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Add sub-service
              </button>
            </div>
          </div>

          <div className="premium-card p-6">
            <h2 className="font-bold mb-4">Prices by city</h2>
            <select className="border rounded-lg px-3 py-2 mb-4 text-sm" value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}>
              {cities.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <div className="space-y-2">
              {subServices.map((s) => (
                <div key={s._id} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">{s.name}</span>
                  <input
                    type="number"
                    className="border rounded-lg px-3 py-1 text-sm w-28"
                    value={prices[s._id] ?? ''}
                    onChange={(e) => updatePrice(s._id, Number(e.target.value))}
                    placeholder="AED"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
