import { useState } from 'react';

function SearchBar({ search, onSearchChange }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Search Medications & Conditions</label>
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Type a medication name or condition..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

export default SearchBar;
