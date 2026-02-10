
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface SearchInterfaceProps {
  user: UserProfile;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ user }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    try {
      const result = await getGeminiResponse(query, user.role);
      setResponse(result || 'No response from AI.');
    } catch (err) {
      setResponse('Error connecting to AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hello, {user.name}! What would you like to explore today?</h2>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="w-full pl-6 pr-16 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400"
            placeholder={user.role === 'STUDENT' ? "Enter a topic (e.g. Quantum Physics, History of Rome)..." : "Search for health tips, history, or any topic..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </form>
      </div>

      {response && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="prose prose-indigo max-w-none">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-6 bg-indigo-600 rounded-full" />
              <h3 className="text-lg font-bold text-gray-800">Insights & Practice</h3>
            </div>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {response}
            </div>
          </div>
        </div>
      )}

      {!response && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2">Quick Prompt</h4>
            <p className="text-sm text-indigo-700">"Explain the concept of photosynthesis with 3 practice questions."</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100">
            <h4 className="font-bold text-purple-900 mb-2">Health Search</h4>
            <p className="text-sm text-purple-700">"What are some light exercises for a 65 year old with knee pain?"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
