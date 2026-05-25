const COLOR_MAP = {
  Antibiotic:       'bg-amber-100 text-amber-800',
  Antiviral:        'bg-violet-100 text-violet-800',
  Antifungal:       'bg-yellow-100 text-yellow-800',
  Vaccine:          'bg-lime-100 text-lime-800',
  Cardiovascular:   'bg-red-100 text-red-800',
  Anticoagulant:    'bg-rose-100 text-rose-800',
  Endocrine:        'bg-orange-100 text-orange-800',
  Gastrointestinal: 'bg-teal-100 text-teal-800',
  Respiratory:      'bg-sky-100 text-sky-800',
  Psychiatric:      'bg-purple-100 text-purple-800',
  Neurologic:       'bg-indigo-100 text-indigo-800',
  'Pain Relief':    'bg-pink-100 text-pink-800',
  Allergy:          'bg-cyan-100 text-cyan-800',
  Immunosuppressant:'bg-emerald-100 text-emerald-800',
  Rheumatologic:    'bg-fuchsia-100 text-fuchsia-800',
  Genitourinary:    'bg-blue-100 text-blue-800',
  Dermatologic:     'bg-green-100 text-green-800',
  Infectious:       'bg-amber-100 text-amber-800',
  Vascular:         'bg-rose-100 text-rose-800',
  Pain:             'bg-pink-100 text-pink-800',
};

export const getCategoryColor = (category) =>
  COLOR_MAP[category] ?? 'bg-gray-100 text-gray-700';
