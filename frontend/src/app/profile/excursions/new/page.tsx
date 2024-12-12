'use client';
import ExcursionForm from '@/components/excursionForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewExcursionPage() {
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    console.log('Form data:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Create New Excursion</h1>
          <Link
            href="/profile/excursions"
            className="block mt-4 text-center text-blue-600 hover:underline"
          >
            Back to My Excursions
          </Link>
        </div>

        <ExcursionForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </div>
  );
}
