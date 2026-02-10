
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import SearchInterface from './SearchInterface';
import Scheduler from './Scheduler';
import Reminders from './Reminders';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'schedule' | 'reminders'>('search');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 text-white bg-indigo-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Life Sync <span className="text-indigo-600">AI</span></h1>
        </div>

        <div className="hidden md:flex items-center p-1 space-x-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'search' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Search & Learn
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'schedule' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'reminders' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reminders
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-400 transition-colors hover:text-red-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="flex md:hidden bg-white border-b border-gray-100 overflow-x-auto px-4 py-2 scrollbar-hide">
        <button
          onClick={() => setActiveTab('search')}
          className={`shrink-0 px-4 py-2 mr-2 rounded-lg text-sm font-medium ${activeTab === 'search' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
        >
          Search
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`shrink-0 px-4 py-2 mr-2 rounded-lg text-sm font-medium ${activeTab === 'schedule' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
        >
          Schedule
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`shrink-0 px-4 py-2 mr-2 rounded-lg text-sm font-medium ${activeTab === 'reminders' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
        >
          Reminders
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto h-full">
          {activeTab === 'search' && <SearchInterface user={user} />}
          {activeTab === 'schedule' && <Scheduler user={user} />}
          {activeTab === 'reminders' && <Reminders user={user} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
