import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MedicationCard from '../components/MedicationCard';
import ConditionCard from '../components/ConditionCard';

function Home() {
  const [activeTab, setActiveTab] = useState('medications');
  const [medications, setMedications] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [medCategories, setMedCategories] = useState([]);
  const [condCategories, setCondCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        setMedCategories(data.medicationCategories);
        setCondCategories(data.conditionCategories);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && activeTab === 'medications') params.append('category', category);
    if (category && activeTab === 'conditions') params.append('category', category);

    const endpoint = activeTab === 'medications' ? '/api/medications' : '/api/conditions';
    fetch(`${endpoint}?${params}`)
      .then(r => r.json())
      .then(data => {
        if (activeTab === 'medications') setMedications(data.medications);
        else setConditions(data.conditions);
        setLoading(false);
      });
  }, [search, category, activeTab]);

  const displayItems = activeTab === 'medications' ? medications : conditions;
  const categories = activeTab === 'medications' ? medCategories : condCategories;

  return (
    <div className="px-4 py-8">
      <SearchBar search={search} onSearchChange={setSearch} />

      <div className="mt-8 flex gap-4 flex-wrap">
        <button
          onClick={() => setActiveTab('medications')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === 'medications' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Medications
        </button>
        <button
          onClick={() => setActiveTab('conditions')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === 'conditions' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Conditions
        </button>
      </div>

      {categories.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : displayItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No results found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {displayItems.map(item => (
            <div key={item.id} onClick={() => navigate(activeTab === 'medications' ? `/medication/${item.id}` : `/condition/${item.id}`)}>
              {activeTab === 'medications' ? (
                <MedicationCard medication={item} />
              ) : (
                <ConditionCard condition={item} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
