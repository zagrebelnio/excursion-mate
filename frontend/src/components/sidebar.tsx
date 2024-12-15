'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useUser } from '@/context/userContext';
import { useSession } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const { user, loading, error } = useUser();

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

  if (role === 'Banned') {
    return null;
  }

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
                className={`flex items-center gap-4 px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md ${pathname === '/' ? 'bg-gray-100' : ''}`}
              >
                <HomeIcon /> Головна
              </Link>
            </li>
            <li>
              <Link
                href="/excursions"
                className={`flex items-center gap-4 px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md ${pathname === '/excursions' ? 'bg-gray-100' : ''}`}
              >
                <MapIcon /> Екскурсії
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className={`flex items-center gap-4 px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md ${pathname === '/profile' ? 'bg-gray-100' : ''}`}
                  >
                    <PersonIcon /> Профіль
                  </Link>
                </li>
                {role === 'Admin' && (
                  <li>
                    <Link
                      href="/admin"
                      className={`flex items-center gap-4 px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md ${pathname === '/admin' ? 'bg-gray-100' : ''}`}
                    >
                      <AdminPanelSettingsIcon /> Адмін Панель
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-4 text-left w-full px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md"
                  >
                    <ExitToAppIcon /> Вийти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/auth?mode=login"
                    className={`flex items-center gap-4 px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md ${pathname === '/auth' && searchParams.get('mode') === 'login' ? 'bg-gray-100' : ''}`}
                  >
                    <LoginIcon /> Вхід
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth?mode=register"
                    className={`flex items-center gap-4 px-6 py-2 text-lg text-black hover:bg-gray-100 rounded-md ${pathname === '/auth' && searchParams.get('mode') === 'register' ? 'bg-gray-100' : ''}`}
                  >
                    <HowToRegIcon /> Реєстрація
                  </Link>
                </li>
              </>
            )}
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
