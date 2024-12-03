'use client';

import { useState, useEffect } from 'react';

interface PhoneNumber {
  id: string;
  name: string;
  number: string;
  category: string;
}

export default function ManagePeoplePage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState({
    name: '',
    number: '',
    category: ''
  });

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const fetchPhoneNumbers = async () => {
    try {
      const response = await fetch('/api/phone-numbers');
      const data = await response.json();
      if (data.phoneNumbers) {
        setPhoneNumbers(data.phoneNumbers);
      }
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
    }
  };

  const handleAddPhoneNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/phone-numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPhoneNumber),
      });

      if (response.ok) {
        setNewPhoneNumber({ name: '', number: '', category: '' });
        setShowAddForm(false);
        fetchPhoneNumbers();
      }
    } catch (error) {
      console.error('Error adding phone number:', error);
    }
  };

  const handleDeletePhoneNumber = async (id: string) => {
    try {
      const response = await fetch('/api/phone-numbers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchPhoneNumbers();
      }
    } catch (error) {
      console.error('Error deleting phone number:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-2xl font-bold text-[#3a73c1] mb-8">
        Manage Your Phone Numbers
      </h1>

      <div className="flex justify-between mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 border-2 border-[#52ace4] text-[#52ace4] rounded-full hover:bg-blue-50"
        >
          {showAddForm ? 'Cancel' : '+ ADD NEW'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddPhoneNumber} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Name"
            value={newPhoneNumber.name}
            onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, name: e.target.value })}
            className="w-full px-4 py-2 rounded-full border-2 border-[#3a73c1] text-center"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newPhoneNumber.number}
            onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, number: e.target.value })}
            className="w-full px-4 py-2 rounded-full border-2 border-[#3a73c1] text-center"
            required
          />
          <select
            value={newPhoneNumber.category}
            onChange={(e) => setNewPhoneNumber({ ...newPhoneNumber, category: e.target.value })}
            className="w-full px-4 py-2 rounded-full border-2 border-[#3a73c1] text-center"
            required
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
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#3a73c1] text-white rounded-full hover:bg-[#2a5fa3]"
          >
            Add Phone Number
          </button>
        </form>
      )}

      <div className="space-y-4">
        {phoneNumbers.map((phone) => (
          <div
            key={phone.id}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
          >
            <div>
              <p className="font-bold text-[#3a73c1]">{phone.name}</p>
              <p className="text-[#52ace4]">{phone.number}</p>
              <p className="text-sm text-gray-500">{phone.category}</p>
            </div>
            <button
              onClick={() => handleDeletePhoneNumber(phone.id)}
              className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}