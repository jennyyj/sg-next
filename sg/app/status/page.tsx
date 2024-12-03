'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  businessName: string;
  category: string;
  status: 'PENDING' | 'CLAIMED' | 'REMOVED';
  shift: {
    type: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  claimedBy?: string;
}

export default function StatusPage() {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [pastJobs, setPastJobs] = useState<Job[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        if (data.jobs) {
          const [recent, ...past] = data.jobs;
          setCurrentJob(recent);
          setPastJobs(past);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-2xl font-bold text-[#3a73c1] mb-8">SHIFT UPDATES</h1>

      {currentJob && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-[#3a73c1] mb-4">Recent Shift</h2>
          <div className="space-y-2 text-[#52ace4]">
            <p><strong>Business:</strong> {currentJob.businessName}</p>
            <p><strong>Category:</strong> {currentJob.category}</p>
            <p><strong>Time:</strong> {formatTime(currentJob.shift.startTime)} - {formatTime(currentJob.shift.endTime)}</p>
            <p><strong>Status:</strong> <span className={`font-bold ${
              currentJob.status === 'CLAIMED' ? 'text-green-500' :
              currentJob.status === 'REMOVED' ? 'text-red-500' :
              'text-[#52ace4]'
            }`}>{currentJob.status}</span></p>
            {currentJob.claimedBy && (
              <p><strong>Claimed By:</strong> {currentJob.claimedBy}</p>
            )}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-[#3a73c1] mb-4">Past Shifts</h2>
        <div className="space-y-4">
          {pastJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow p-4">
              <div className="space-y-1 text-[#52ace4]">
                <p><strong>Business:</strong> {job.businessName}</p>
                <p><strong>Time:</strong> {formatTime(job.shift.startTime)} - {formatTime(job.shift.endTime)}</p>
                <p><strong>Status:</strong> <span className={`font-bold ${
                  job.status === 'CLAIMED' ? 'text-green-500' :
                  job.status === 'REMOVED' ? 'text-red-500' :
                  'text-[#52ace4]'
                }`}>{job.status}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}