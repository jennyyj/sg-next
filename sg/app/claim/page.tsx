'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Job {
  id: string;
  businessName: string;
  jobDescription: string;
  shift: {
    startTime: string;
    endTime: string;
    date: string;
  };
  status: string;
}

export default function ClaimPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [workerName, setWorkerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const jobId = searchParams.get('jobId');

  useEffect(() => {
    if (jobId) {
      fetchJob(jobId);
    }
  }, [jobId]);

  const fetchJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs?id=${id}`);
      const data = await response.json();
      setJob(data.job);
    } catch (error) {
      setError('Failed to load job details');
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, workerName }),
      });

      if (response.ok) {
        alert('Shift claimed successfully!');
        router.push('/status');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to claim shift');
      }
    } catch (error) {
      setError('Failed to claim shift');
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#3a73c1] mb-6">Claim Shift</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6 text-[#52ace4]">
          <p className="font-bold">{job.businessName}</p>
          <p>{job.jobDescription}</p>
          <p className="mt-2">
            {new Date(job.shift.date).toLocaleDateString()} <br />
            {job.shift.startTime} - {job.shift.endTime}
          </p>
        </div>

        <form onSubmit={handleClaim} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={workerName}
            onChange={(e) => setWorkerName(e.target.value)}
            className="w-full px-4 py-2 rounded-full border-2 border-[#3a73c1] text-center"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-[#3a73c1] font-bold hover:bg-[#f0f8ff] transition-colors flex items-center justify-between"
          >
            <span>{loading ? 'CLAIMING...' : 'CLAIM SHIFT'}</span>
            <span>➜</span>
          </button>
        </form>
      </div>
    </div>
  );
}