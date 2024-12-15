'use client';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useUser } from '@/context/userContext';

export default function ProfilePage() {
  const { user, loading, error } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl p-6 bg-white rounded-lg shadow-lg">
        <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-gray-300">
          <Image
            src={
              user?.photo
                ? `data:image/jpeg;base64,${user.photo}`
                : '/placeholders/profile-avatar.svg'
            }
            alt="Profile"
            width={160}
            height={160}
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-500 mb-6">{user?.email}</p>

          <div className="flex flex-col gap-4">
            <Link
              href="/profile/edit"
              className="px-4 py-2 border border-black text-black text-center rounded-lg hover:bg-gray-100 transition"
            >
              Edit profile
            </Link>
            <Link
              href="/profile/excursions"
              className="px-4 py-2 border border-black text-black text-center rounded-lg hover:bg-gray-100 transition"
            >
              My excursions
            </Link>
            <Link
              href="/profile/saved"
              className="px-4 py-2 border border-black text-black text-center rounded-lg hover:bg-gray-100 transition"
            >
              Saved
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 border border-black text-black text-center rounded-lg hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
