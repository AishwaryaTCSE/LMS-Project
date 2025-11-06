// src/pages/Instructor/Settings.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';

const InstructorSettings = () => {
  const [prefs, setPrefs] = useState({ messages: true, enrollments: true, weeklySummary: false });
  const [timezone, setTimezone] = useState('UTC');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const load = async () => {
      try {
        const me = await axios.get('/users/me');
        const s = me.data?.data?.settings || {};
        setTimezone(s.timezone || 'UTC');
        setLanguage(s.language || 'en');
        setPrefs({
          messages: s.notificationPrefs?.messages ?? true,
          enrollments: s.notificationPrefs?.enrollments ?? true,
          weeklySummary: s.notificationPrefs?.weeklySummary ?? false
        });
      } catch {}
    };
    load();
  }, []);

  const saveSettings = async () => {
    await axios.put('/users/me/settings', {
      settings: {
        timezone,
        language,
        notificationPrefs: prefs
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
      <p className="text-sm text-gray-600 mb-6">Manage your account and instructor preferences.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="john@example.com" />
            </div>
            <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" checked={prefs.messages} onChange={e=> setPrefs(prev => ({...prev, messages: e.target.checked}))} />
              <span className="ml-2 text-sm text-gray-700">Email me about new messages</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" checked={prefs.enrollments} onChange={e=> setPrefs(prev => ({...prev, enrollments: e.target.checked}))} />
              <span className="ml-2 text-sm text-gray-700">Notify me about new enrollments</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" checked={prefs.weeklySummary} onChange={e=> setPrefs(prev => ({...prev, weeklySummary: e.target.checked}))} />
              <span className="ml-2 text-sm text-gray-700">Weekly analytics summary</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={timezone} onChange={e=> setTimezone(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <input className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" value={language} onChange={e=> setLanguage(e.target.value)} />
              </div>
            </div>
            <button onClick={saveSettings} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSettings;


