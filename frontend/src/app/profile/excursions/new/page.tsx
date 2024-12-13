'use client';
import { CreateExcursionForm } from '@/components/excursionForms';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createExcursion } from '@/services/excursionService';
import { useSession } from 'next-auth/react';

export default function NewExcursionPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (formData: FormData) => {
    await createExcursion(session?.accessToken as string, formData as FormData);
    router.push('/profile/excursions');
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

        <CreateExcursionForm
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
