'use client';

import Link from 'next/link';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <div className="bg-white shadow-md rounded-lg p-8">
        <ErrorOutlineIcon style={{ fontSize: 80, color: '#FF5722' }} />
        <h1 className="text-3xl font-bold mt-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mt-2">
          Sorry, the page you are looking for doesn&apos;t exist.
        </p>
        <div className="mt-6">
          <Link href="/">
            <button className="px-4 py-2 bg-blue-500 text-white text-lg font-medium rounded-md shadow-md hover:bg-blue-600 transition">
              Go Back Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
