import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MedicationCard from '../components/MedicationCard';
import ConditionCard from '../components/ConditionCard';
import SkeletonCard from '../components/SkeletonCard';

function StatCard({ value, label, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 text-center">
      <p className={`text-3xl font-bold ${color}`}>{value || '—'}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function Home() {
  const [activeTab, setActiveTab] = useState('medications');
  const [medications, setMedications] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [medCategories, setMedCategories] = useState([]);
  const [condCategories, setCondCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ medications: null, conditions: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        setMedCategories(data.medicationCategories);
        setCondCategories(data.conditionCategories);
      });
    Promise.all([
      fetch('/api/medications?limit=1').then(r => r.json()),
      fetch('/api/conditions?limit=1').then(r => r.json()),
    ]).then(([meds, conds]) => {
      setStats({ medications: meds.total, conditions: conds.total });
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const endpoint = activeTab === 'medications' ? '/api/medications' : '/api/conditions';
    fetch(`${endpoint}?${params}&limit=100`)
      .then(r => r.json())
      .then(data => {
        if (activeTab === 'medications') setMedications(data.medications || []);
        else setConditions(data.conditions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, category, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCategory('');
  };

  const displayItems = activeTab === 'medications' ? medications : conditions;
  const categories = activeTab === 'medications' ? medCategories : condCategories;

  return (
    <div className="px-4 py-8">
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard value={stats.medications} label="Medications" color="text-blue-600" />
        <StatCard value={stats.conditions} label="Conditions" color="text-emerald-600" />
        <StatCard value={38} label="Research Links" color="text-violet-600" />
      </div>

      <SearchBar search={search} onSearchChange={setSearch} />

      <div className="mt-6 border-b border-gray-200 flex gap-1">
        {['medications', 'conditions'].map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-5 py-2.5 text-sm font-semibold capitalize transition border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              category === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat === category ? '' : cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                category === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : displayItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No results found</p>
          {(search || category) && (
            <button
              onClick={() => { setSearch(''); setCategory(''); }}
              className="mt-3 text-blue-500 text-sm hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {displayItems.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(activeTab === 'medications' ? `/medication/${item.id}` : `/condition/${item.id}`)}
            >
              {activeTab === 'medications'
                ? <MedicationCard medication={item} />
                : <ConditionCard condition={item} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
