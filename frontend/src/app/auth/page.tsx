'use client';
import { useSearchParams } from 'next/navigation';
import RegistrationForm from '@/components/registrationForm';
import LoginForm from '@/components/loginForm';

export default function Register() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10 min-h-screen">
      <h1 className="text-6xl font-bold text-black">ExcursionMate</h1>
      {mode === 'register' && <RegistrationForm />}
      {mode === 'login' && <LoginForm />}
    </div>
  );
}
