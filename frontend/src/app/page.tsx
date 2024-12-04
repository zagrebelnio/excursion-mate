'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black font-poppins">
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/backgrounds/image 2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <div className="absolute top-8 right-8 text-lg flex space-x-4 items-center z-5 gap-4">
          <Link href="/auth?mode=login" className="px-4 py-1 text-white rounded-full font-semibold hover:bg-white hover:text-black transition duration-300 ease-in-out">
            Увійти
          </Link>
          <Link href="/auth?mode=register" className="px-4 py-1 bg-white rounded-full font-semibold shadow hover:bg-black hover:text-white transition duration-300 ease-in-out">
            Зареєструватись
          </Link>
        </div>

        <h1 className="text-9xl font-bold text-white text-shadow z-5">ExcursionMate</h1>
      </div>
    </div>
  );
}
