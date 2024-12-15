'use client';

import Link from 'next/link';
import PeopleIcon from '@mui/icons-material/People';
import TourIcon from '@mui/icons-material/Tour';

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
        {/* Admin Panel Heading */}
        <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
        <p className="text-gray-600 mb-8">
          Manage users and excursions efficiently.
        </p>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Management Link */}
          <Link href="/admin/users" className="group block">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
              <div className="flex flex-col items-center justify-center gap-4">
                <PeopleIcon
                  className="text-blue-500"
                  style={{ fontSize: 64 }}
                />
                <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  User Management
                </h2>
                <p className="text-gray-500 text-center">
                  View and manage user roles, including banning and unbanning
                  users.
                </p>
              </div>
            </div>
          </Link>

          {/* Excursion Management Link */}
          <Link href="/admin/excursions" className="group block">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
              <div className="flex flex-col items-center justify-center gap-4">
                <TourIcon className="text-green-500" style={{ fontSize: 64 }} />
                <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  Excursion Management
                </h2>
                <p className="text-gray-500 text-center">
                  Edit, delete, or manage any excursions available on the
                  platform.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
