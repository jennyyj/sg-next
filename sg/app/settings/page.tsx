'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ShiftTimes {
  morning: { start: string; end: string };
  midday: { start: string; end: string };
  night: { start: string; end: string };
}

export default function SettingsPage() {
  const [shiftTimes, setShiftTimes] = useState<ShiftTimes>({
    morning: { start: '', end: '' },
    midday: { start: '', end: '' },
    night: { start: '', end: '' }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.preferences?.shiftTimes) {
        setShiftTimes(data.preferences.shiftTimes);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleTimeChange = (shift: keyof ShiftTimes, type: 'start' | 'end', value: string) => {
    setShiftTimes(prev => ({
      ...prev,
      [shift]: { ...prev[shift], [type]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shiftTimes }),
      });
      
      if (response.ok) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-2xl font-bold text-[#3a73c1] mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(shiftTimes).map(([shift, times]) => (
          <div key={shift} className="space-y-2">
            <h2 className="text-lg font-semibold text-[#3a73c1] capitalize">
              {shift} Shift
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a73c1]" />
                <input
                  type="time"
                  value={times.start}
                  onChange={(e) => handleTimeChange(shift as keyof ShiftTimes, 'start', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-[#3a73c1] text-[#52ace4]"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a73c1]" />
                <input
                  type="time"
                  value={times.end}
                  onChange={(e) => handleTimeChange(shift as keyof ShiftTimes, 'end', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-[#3a73c1] text-[#52ace4]"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-[#3a73c1] font-bold hover:bg-[#f0f8ff] transition-colors flex items-center justify-between"
        >
          <span>SAVE SETTINGS</span>
          <span>➜</span>
        </button>
      </form>
    </div>
  );
}