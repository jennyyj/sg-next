'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PhoneNumber {
  name: string;
  number: string;
  category: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    { name: '', number: '', category: '' }
  ]);

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { name: '', number: '', category: '' }]);
  };

  const handlePhoneNumberChange = (index: number, field: keyof PhoneNumber, value: string) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers[index][field] = value;
    setPhoneNumbers(updatedPhoneNumbers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty phone numbers
    const validPhoneNumbers = phoneNumbers.filter(phone => 
      phone.name && phone.number && phone.category
    );

    if (validPhoneNumbers.length === 0) {
      alert('Please add at least one phone number');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phoneNumbers: validPhoneNumbers,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        router.push('/auth/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error registering. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-[#3a73c1]">SHIFT</span>
          <span className="text-[#52ace4]">GRAB</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-center text-[#52ace4] placeholder-[#52ace4] focus:outline-none focus:border-[#52ace4]"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-center text-[#52ace4] placeholder-[#52ace4] focus:outline-none focus:border-[#52ace4]"
          />

          <h2 className="text-xl font-bold text-[#3a73c1] mt-6">Add Phone Numbers</h2>

          {phoneNumbers.map((phone, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                placeholder="Name"
                value={phone.name}
                onChange={(e) => handlePhoneNumberChange(index, 'name', e.target.value)}
                className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-center text-[#52ace4] placeholder-[#52ace4] focus:outline-none focus:border-[#52ace4]"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone.number}
                onChange={(e) => handlePhoneNumberChange(index, 'number', e.target.value)}
                className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-center text-[#52ace4] placeholder-[#52ace4] focus:outline-none focus:border-[#52ace4]"
              />
              <select
                value={phone.category}
                onChange={(e) => handlePhoneNumberChange(index, 'category', e.target.value)}
                className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-center text-[#52ace4] focus:outline-none focus:border-[#52ace4]"
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
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddPhoneNumber}
            className="w-1/3 mx-auto px-4 py-2 rounded-full border-2 border-[#52ace4] text-[#52ace4] font-bold hover:bg-blue-50 transition-colors"
          >
            + ADD MORE
          </button>

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-full border-2 border-[#3a73c1] text-[#3a73c1] font-bold hover:bg-[#f0f8ff] transition-colors flex items-center justify-between mt-6"
          >
            <span>REGISTER</span>
            <span>➜</span>
          </button>
        </form>

        <p className="mt-6 text-[#3a73c1] font-bold">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#52ace4]">
            LOGIN HERE
          </Link>
        </p>
      </div>
    </div>
  );
}