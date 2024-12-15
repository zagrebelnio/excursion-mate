'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function BanPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (session?.user?.role !== 'Banned') {
    router.back();
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">You Are Banned</h1>
        <p className="text-gray-700 mb-6">
          Your account has been banned. Please contact support for assistance.
        </p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
