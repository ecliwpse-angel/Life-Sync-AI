
import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface RemindersProps {
  user: UserProfile;
}

interface ReminderItem {
  id: string;
  text: string;
  timestamp: string;
  role: UserRole;
}

const Reminders: React.FC<RemindersProps> = ({ user }) => {
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(Notification.permission);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  useEffect(() => {
    const fetchReminders = () => {
      const saved = localStorage.getItem('lifesync_reminders');
      let data: ReminderItem[] = saved ? JSON.parse(saved) : [];
      
      // If no dynamic reminders exist, add some defaults based on user role
      if (data.length === 0) {
        if (user.role === UserRole.STUDENT) {
          data = [{
            id: 'default-1',
            text: "Welcome to Life Sync AI. Set your study schedule to see reminders here.",
            timestamp: new Date().toISOString(),
            role: UserRole.STUDENT
          }];
        } else {
          data = [{
            id: 'default-2',
            text: "Welcome to Life Sync AI. Add your medications in the Scheduler to see alerts.",
            timestamp: new Date().toISOString(),
            role: UserRole.SENIOR
          }];
        }
      }
      setReminders(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    };

    fetchReminders();
    window.addEventListener('storage', fetchReminders);
    return () => window.removeEventListener('storage', fetchReminders);
  }, [user.role]);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === 'granted') {
      new Notification("Life Sync AI", { body: "Smart notifications enabled!" });
    }
  };

  const removeReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem('lifesync_reminders', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Notification Center</h2>
            <p className="text-sm text-gray-500">Manage your smart alerts</p>
          </div>
          <button
            onClick={requestPermission}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              notifPermission === 'granted' 
              ? 'bg-emerald-100 text-emerald-600' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {notifPermission === 'granted' ? 'Notifications Active' : 'Enable Notifications'}
          </button>
        </div>

        <div className="space-y-4">
          {reminders.length > 0 ? reminders.map((reminder) => (
            <div key={reminder.id} className="group relative flex items-start p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 ${
                reminder.role === UserRole.STUDENT ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{reminder.text}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(reminder.timestamp).toLocaleTimeString()}</p>
              </div>
              <button 
                onClick={() => removeReminder(reminder.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-300 hover:text-red-500"
              >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )) : (
            <div className="py-12 text-center text-gray-400">
              No active reminders.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl text-white">
          <h3 className="font-bold text-lg mb-2">Smart Sync</h3>
          <p className="text-indigo-100 text-sm opacity-90">Reminders set in the Schedule page automatically appear here for quick access.</p>
        </div>
        <div className="p-6 bg-slate-800 rounded-3xl text-white">
          <h3 className="font-bold text-lg mb-2">Privacy Focus</h3>
          <p className="text-slate-400 text-sm">All reminders and medication data are stored securely on your device.</p>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
