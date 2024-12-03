'use client';
import { useSearchParams } from 'next/navigation';
import RegistrationForm from '../components/registrationForm';

export default function Register() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  return (
    <div>
      <h1>ExcursionMate</h1>
      {mode === 'register' && <RegistrationForm />}  
    </div>
  );
}