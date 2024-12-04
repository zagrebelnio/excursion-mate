'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Edit() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log('Selected file:', file);
              }
            }}
          />
          <Image
            src="/placeholders/profile-avatar.svg"
            alt="Profile"
            className="w-full h-full object-cover"
            width={160}
            height={160}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="first-name"
                className="block text-lg text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <label
                htmlFor="last-name"
                className="block text-lg text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </form>

          <Link
            href="/profile"
            className="block mt-4 text-center text-blue-600 hover:underline"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
