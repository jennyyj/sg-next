'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();
  const [jobData, setJobData] = useState({
    businessName: '',
    jobDescription: '',
    category: '',
    shift: {
      type: 'CUSTOM',
      date: '',
      startTime: '',
      endTime: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobData.businessName || !jobData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('lastPostedJobId', data.job.id);
        router.push('/status');
      } else {
        alert(data.message || 'Error posting job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Error posting job. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-20">
      <h1 className="text-2xl font-bold text-center text-[#3a73c1] mb-8">
        POST A SHIFT
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Business Name"
          value={jobData.businessName}
          onChange={(e) => setJobData({ ...jobData, businessName: e.target.value })}
          className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-center text-[#52ace4] placeholder-[#52ace4] focus:outline-none"
        />

        <select
          value={jobData.category}
          onChange={(e) => setJobData({ ...jobData, category: e.target.value })}
          className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-center text-[#52ace4] focus:outline-none appearance-none"
        >
          <option value="">Select Category</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Bar">Bar</option>
          <option value="Server">Server</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Security">Security</option>
          <option value="Management">Management</option>
          <option value="Everyone">Everyone</option>
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3a73c1]" />
            <input
              type="time"
              value={jobData.shift.startTime}
              onChange={(e) => setJobData({
                ...jobData,
                shift: { ...jobData.shift, startTime: e.target.value }
              })}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#3a73c1] text-center text-[#52ace4] focus:outline-none"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3a73c1]" />
            <input
              type="time"
              value={jobData.shift.endTime}
              onChange={(e) => setJobData({
                ...jobData,
                shift: { ...jobData.shift, endTime: e.target.value }
              })}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#3a73c1] text-center text-[#52ace4] focus:outline-none"
            />
          </div>
        </div>

        <textarea
          placeholder="Job Description (Optional)"
          value={jobData.jobDescription}
          onChange={(e) => setJobData({ ...jobData, jobDescription: e.target.value })}
          className="w-full px-4 py-3 rounded-2xl border-2 border-[#3a73c1] text-center text-[#52ace4] placeholder-[#52ace4] focus:outline-none min-h-[100px]"
        />

        <button
          type="submit"
          className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-[#3a73c1] font-bold hover:bg-[#f0f8ff] transition-colors flex items-center justify-between"
        >
          <span>POST SHIFT</span>
          <span>➜</span>
        </button>
      </form>
    </div>
  );
}