'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { UserData } from '@/types/auth';

function LoginForm() {
  const [userData, setUserData] = useState<UserData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      username: userData.username,
      password: userData.password,
    });

    if (res?.error) {
      console.log(res.error);
      setError(res.error);
    } else {
      console.log(res);
      const session = await getSession();
      console.log('Access Token:', session?.accessToken);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-xl p-6 bg-white rounded-md shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Увійти в акаунт
      </h2>

      <label htmlFor="email" className="block text-sm font-medium mb-1">
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="Email"
        required
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <label htmlFor="password" className="block text-sm font-medium mb-1">
        Password
      </label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        required
        minLength={6}
        maxLength={20}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      <button
        type="submit"
        className="w-full py-2 mb-4 text-white bg-black rounded-lg hover:bg-gray-800"
      >
        Увійти
      </button>

      <p className="text-center text-sm mb-4">або</p>

      <button
        type="button"
        className="w-full py-2 mb-2 text-black bg-white border rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100"
      >
        <Image
          src="/socials/google.svg"
          alt="Google"
          className="w-5 h-5"
          width="24"
          height="24"
        />
        <span>Увійти з Google</span>
      </button>

      <button
        type="button"
        className="w-full py-2 mb-6 text-black bg-white border rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100"
      >
        <Image
          src="/socials/facebook.svg"
          alt="Facebook"
          className="w-5 h-5"
          width="24"
          height="24"
        />
        <span>Увійти з Facebook</span>
      </button>

      <p className="text-center text-sm">
        Ще не зареєстровані?{' '}
        <Link
          href="/auth?mode=register"
          className="text-blue-500 hover:underline"
        >
          Зареєструватися
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
