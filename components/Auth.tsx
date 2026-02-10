
import React, { useState } from 'react';
import { UserProfile, UserRole, Gender, EducationLevel, SeniorStatus } from '../types';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    role: UserRole.STUDENT,
    gender: Gender.MALE,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.age) {
      onLogin(formData as UserProfile);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-2xl rounded-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Life Sync AI</h2>
          <p className="mt-2 text-sm text-gray-600">Tailored assistance for every stage of life</p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Name</label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Age</label>
              <input
                required
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Email</label>
            <input
              required
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Mobile Number</label>
            <input
              required
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Gender</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Role</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                <option value={UserRole.STUDENT}>Student</option>
                <option value={UserRole.SENIOR}>Senior</option>
              </select>
            </div>
          </div>

          {formData.role === UserRole.STUDENT ? (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Education Type</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
              >
                <option value="">Select Level</option>
                <option value={EducationLevel.SCHOOL}>School</option>
                <option value={EducationLevel.COLLEGE}>College</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">Employment Status</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setFormData({ ...formData, seniorStatus: e.target.value as SeniorStatus })}
              >
                <option value="">Select Status</option>
                <option value={SeniorStatus.EMPLOYED}>Employed</option>
                <option value={SeniorStatus.UNEMPLOYED}>Unemployed</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 mt-4 font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 shadow-lg"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
