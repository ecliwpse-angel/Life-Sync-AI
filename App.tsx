
import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check for saved session
  useEffect(() => {
    const savedUser = localStorage.getItem('lifesync_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Background Notification Checker
  useEffect(() => {
    const checkNotifications = () => {
      if (Notification.permission !== 'granted') return;

      const now = new Date();
      const currentHHMM = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      const lastCheckKey = 'lifesync_last_notified_minute';
      const lastCheck = localStorage.getItem(lastCheckKey);

      // Only trigger once per minute
      if (lastCheck === currentHHMM) return;
      localStorage.setItem(lastCheckKey, currentHHMM);

      // Check Medicines
      const savedMeds = localStorage.getItem('lifesync_meds');
      if (savedMeds) {
        const meds = JSON.parse(savedMeds);
        meds.forEach((med: any) => {
          if (med.medTime === currentHHMM) {
            new Notification("Life Sync AI: Medicine Reminder", {
              body: `Time to take ${med.medicine} for ${med.disease}. ${med.medDescription || ''}`,
              icon: 'https://cdn-icons-png.flaticon.com/512/822/822143.png'
            });
          }
        });
      }

      // Check Study Schedule (if currently active/saved)
      const savedStudy = localStorage.getItem('lifesync_active_study');
      if (savedStudy) {
        const schedule = JSON.parse(savedStudy);
        schedule.forEach((item: any) => {
          // AI returns times like "09:00 AM" or "14:00"
          // We normalize and check against current time
          const [timePart, ampm] = item.startTime.split(' ');
          let [hours, minutes] = timePart.split(':').map(Number);
          
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          
          const normalizedTime = hours.toString().padStart(2, '0') + ':' + (minutes || 0).toString().padStart(2, '0');
          
          if (normalizedTime === currentHHMM) {
            new Notification("Life Sync AI: Study Time", {
              body: `Focus Session: ${item.name}. (Priority: ${item.priority})`,
              icon: 'https://cdn-icons-png.flaticon.com/512/2232/2232688.png'
            });
          }
        });
      }
    };

    const interval = setInterval(checkNotifications, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('lifesync_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lifesync_user');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!user ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
