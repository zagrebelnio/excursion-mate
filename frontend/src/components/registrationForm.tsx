'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import axios from '@/lib/axios/axiosInstance';

function RegistrationForm() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await axios.post('/api/Auth/Register', userData);

      if (response.status === 200) {
        console.log('Registration successful');

        const loginResponse = await signIn('credentials', {
          redirect: false,
          username: userData.username,
          password: userData.password,
        });

        if (loginResponse?.error) {
          console.error('Auto-login failed:', loginResponse.error);
        } else {
          console.log('Auto-login successful:', loginResponse);
          const session = await getSession();
          console.log('Access Token:', session?.accessToken);
        }
      } else {
        console.error('Registration failed', response.data);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      className="w-full max-w-xl p-6 bg-white rounded-md shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Створити акаунт
      </h2>

      <label htmlFor="firstName" className="block text-sm font-medium mb-1">
        First Name
      </label>
      <input
        id="firstName"
        type="text"
        placeholder="First Name"
        value={userData.firstName}
        onChange={(e) =>
          setUserData({ ...userData, firstName: e.target.value })
        }
        required
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <label htmlFor="lastName" className="block text-sm font-medium mb-1">
        Last Name
      </label>
      <input
        id="lastName"
        type="text"
        placeholder="Last Name"
        value={userData.lastName}
        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
        required
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <label htmlFor="email" className="block text-sm font-medium mb-1">
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="Email"
        value={userData.username}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
        required
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
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <button
        type="submit"
        className="w-full py-2 mb-4 text-white bg-black rounded-lg hover:bg-gray-800"
      >
        Зареєструватися
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
        <span>Зареєструватися з Google</span>
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
        <span>Зареєструватися з Facebook</span>
      </button>

      <p className="text-center text-sm">
        Вже маєте акаунт?{' '}
        <Link href="/auth?mode=login" className="text-blue-500 hover:underline">
          Увійти
        </Link>
      </p>
    </form>
  );
}

export default RegistrationForm;
