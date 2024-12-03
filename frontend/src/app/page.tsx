'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/backgrounds/image 2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <div className="absolute top-8 right-8 flex space-x-4 items-center z-10 gap-4">
          <Link href="/login" className="text-white font-semibold">
            Log in
          </Link>
          <Link href="/register" className="px-4 py-1 bg-white rounded-full font-semibold shadow">
            Sign up
          </Link>
        </div>

        <h1 className="text-9xl font-bold text-white text-shadow z-10">ExcursionMate</h1>
      </div>
    </div>
  );
}
