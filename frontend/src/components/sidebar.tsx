'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setTimeout(() => setIsButtonVisible(true), 300);
    } else {
      setIsButtonVisible(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-10 bg-black bg-opacity-50 z-20 ${isOpen ? 'block' : 'hidden'}`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`fixed top-0 left-0 z-20 bg-white w-64 h-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">ExcursionMate</h2>
          <button className="text-xl text-black" onClick={toggleSidebar}>
            &#10005;
          </button>
        </div>

        <nav className="mt-4">
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                className={`block px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md ${pathname === '/' ? 'bg-gray-100' : ''}`}
              >
                Головна
              </Link>
            </li>
            <li>
              <Link
                href="/excursions"
                className={`block px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md ${pathname === '/excursions' ? 'bg-gray-100' : ''}`}
              >
                Екскурсії
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`block px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md ${pathname === '/profile' ? 'bg-gray-100' : ''}`}
              >
                Профіль
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block text-left w-full px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md"
              >
                Вийти
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isButtonVisible && (
        <button
          className="fixed top-4 left-4 text-white bg-black py-2 px-3 rounded-full z-20"
          onClick={toggleSidebar}
        >
          &#9776;
        </button>
      )}
    </>
  );
}
