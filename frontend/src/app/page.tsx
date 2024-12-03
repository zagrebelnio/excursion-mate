'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-200 relative">
        {/* Navigation Buttons */}
        <div className="absolute top-8 right-8 flex space-x-4 items-center">
          <Link href="/login" className="text-black font-semibold">Log in</Link>
          <Link href="/register" className="px-4 py-1 bg-white rounded-full font-semibold shadow">
            Sign up
          </Link>
        </div>

        {/* Background Placeholder */}
        <h1 className="text-3xl font-bold text-black">background image</h1>
      </div>
    </div>
  );
}