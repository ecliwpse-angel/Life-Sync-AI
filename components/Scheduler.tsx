
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { generateStudySchedule } from '../services/geminiService';

interface SchedulerProps {
  user: UserProfile;
}

const Scheduler: React.FC<SchedulerProps> = ({ user }) => {
  // Navigation State
  const [activeView, setActiveView] = useState<UserRole>(user.role);

  // Student State
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState('');
  const [timeLimit, setTimeLimit] = useState('2');
  const [examTomorrow, setExamTomorrow] = useState(false);
  const [setStudyReminder, setSetStudyReminder] = useState(true);
  const [studySchedule, setStudySchedule] = useState<any[]>(() => {
    const saved = localStorage.getItem('lifesync_active_study');
    return saved ? JSON.parse(saved) : [];
  });

  // Senior State
  const [disease, setDisease] = useState('');
  const [medicine, setMedicine] = useState('');
  const [medDescription, setMedDescription] = useState('');
  const [medTime, setMedTime] = useState('');
  const [setMedReminder, setSetMedReminder] = useState(true);
  const [medList, setMedList] = useState<any[]>(() => {
    const saved = localStorage.getItem('lifesync_meds');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  const saveReminder = (text: string) => {
    const saved = localStorage.getItem('lifesync_reminders');
    const reminders = saved ? JSON.parse(saved) : [];
    reminders.push({
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      role: activeView
    });
    localStorage.setItem('lifesync_reminders', JSON.stringify(reminders));
    // Trigger storage event for cross-tab or component sync
    window.dispatchEvent(new Event('storage'));
  };

  const handleStudentSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const topicsList = topics.split(',').map(t => t.trim());
    const result = await generateStudySchedule(subject, topicsList, parseInt(timeLimit), examTomorrow);
    
    setStudySchedule(result);
    localStorage.setItem('lifesync_active_study', JSON.stringify(result));
    
    if (setStudyReminder) {
      if (examTomorrow) {
        saveReminder(`EXAM TOMORROW: ${subject}. AI has scheduled ${result.length} critical topics. Notifications are set.`);
      } else {
        saveReminder(`New Study Plan for ${subject} created. You will receive notifications at the start of each topic.`);
      }
    }
    setLoading(false);
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed = { disease, medicine, medDescription, medTime };
    const updated = [...medList, newMed];
    setMedList(updated);
    localStorage.setItem('lifesync_meds', JSON.stringify(updated));
    
    if (setMedReminder) {
      saveReminder(`MEDICINE ALERT: Scheduled ${medicine} for ${medTime} daily.`);
    }
    
    setMedicine('');
    setMedTime('');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="space-y-6">
      {/* Role Switcher */}
      <div className="flex items-center justify-center p-1 bg-gray-200 rounded-2xl w-fit mx-auto shadow-inner">
        <button
          onClick={() => setActiveView(UserRole.STUDENT)}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === UserRole.STUDENT ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Student Mode
        </button>
        <button
          onClick={() => setActiveView(UserRole.SENIOR)}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === UserRole.SENIOR ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Senior/Elder Mode
        </button>
      </div>

      {activeView === UserRole.STUDENT ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Study Planner
              </h2>
            </div>
            <form onSubmit={handleStudentSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Subject</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Mathematics"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl mt-1 focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Topics (comma separated)</label>
                <textarea
                  required
                  placeholder="Algebra, Trigonometry, Calculus..."
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl mt-1 focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  onChange={(e) => setTopics(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Hours Available</label>
                  <input
                    type="number"
                    value={timeLimit}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl mt-1 focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setTimeLimit(e.target.value)}
                  />
                </div>
                <div className="flex flex-col justify-center space-y-2 pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="exam"
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                      checked={examTomorrow}
                      onChange={(e) => setExamTomorrow(e.target.checked)}
                    />
                    <label htmlFor="exam" className="ml-2 text-sm text-gray-600 font-medium">Exam Tomorrow?</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="studyReminder"
                      className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                      checked={setStudyReminder}
                      onChange={(e) => setSetStudyReminder(e.target.checked)}
                    />
                    <label htmlFor="studyReminder" className="ml-2 text-sm text-gray-600 font-medium">Auto-Notifications</label>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg"
              >
                {loading ? 'AI is Thinking...' : 'Plan Session & Set Alerts'}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Live AI Schedule</h2>
            {studySchedule.length > 0 ? (
              <div className="space-y-4">
                {studySchedule.map((item, idx) => (
                  <div key={idx} className="flex items-start p-4 bg-indigo-50 rounded-2xl border-l-4 border-indigo-600 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-indigo-900">{item.name}</h4>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-200 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Alert Active</span>
                      </div>
                      <p className="text-xs text-indigo-600 font-medium">{item.startTime} - {item.endTime}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm max-w-xs">Your AI plan will appear here with automatic push notifications for each topic.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Care & Medicine
            </h2>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Condition</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Hypertension"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Medicine</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Lisinopril"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500"
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Once daily after lunch"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500"
                  value={medDescription}
                  onChange={(e) => setMedDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Daily Time</label>
                  <input
                    required
                    type="time"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl mt-1 focus:ring-2 focus:ring-emerald-500"
                    value={medTime}
                    onChange={(e) => setMedTime(e.target.value)}
                  />
                </div>
                <div className="flex items-center pt-5">
                   <input
                    type="checkbox"
                    id="medReminder"
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500"
                    checked={setMedReminder}
                    onChange={(e) => setSetMedReminder(e.target.checked)}
                  />
                  <label htmlFor="medReminder" className="ml-2 text-sm text-gray-600 font-medium">Daily Notification</label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg"
              >
                Set Medicine Alert
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Medication Schedule</h2>
            {medList.length > 0 ? (
              <div className="space-y-4">
                {medList.map((med, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-emerald-50 rounded-2xl border-l-4 border-emerald-600">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm shrink-0">
                      <span className="text-xl">💊</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-emerald-900">{med.medicine}</h4>
                        <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded-lg border border-emerald-100">
                          {med.medTime}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 mt-1">{med.disease} • {med.medDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-gray-400 text-sm">No medicine alerts configured.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
