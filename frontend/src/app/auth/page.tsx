'use client';
import { useSearchParams } from 'next/navigation';
import RegistrationForm from '../components/registrationForm';

export default function Register() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-6xl font-bold text-black">ExcursionMate</h1>
      {mode === 'register' && <RegistrationForm />}  
    </div>
  );
}