'use client';
import { EditExcursionForm } from '@/components/excursionForms';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { editExcursion, getExcursion } from '@/services/excursionService';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LocationOn, Event, AttachMoney, Group } from '@mui/icons-material';

export default function NewExcursionPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();

  const [excursion, setExcursion] = useState<any>(null);

  useEffect(() => {
    async function fetchExcursion() {
      try {
        const excursionData = await getExcursion(
          session?.accessToken as string,
          Number(params.id)
        );
        setExcursion(excursionData);
        console.log(excursionData);
      } catch (err) {
        console.error('Error fetching excursion:', err);
      }
    }

    fetchExcursion();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    try {
      await editExcursion(
        session?.accessToken as string,
        Number(params.id),
        formData
      );
      const updatedExcursion = await getExcursion(
        session?.accessToken as string,
        Number(params.id)
      );
      setExcursion(updatedExcursion);
    } catch (err) {
      console.error('Error updating excursion:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit Excursion</h1>
          <Link
            href="/admin/excursions"
            className="block mt-4 text-center text-blue-600 hover:underline"
          >
            Back to Excursions Management
          </Link>
        </div>

        {excursion && (
          <>
            <Image
              src={
                excursion.photo
                  ? `data:image/jpeg;base64,${excursion.photo}`
                  : '/placeholders/excursion.png'
              }
              alt={excursion.title}
              width={1000}
              height={1000}
              className="w-full h-80 object-cover rounded-lg mb-6"
            />

            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              {excursion.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-700 mb-6">
              <div className="flex items-center gap-2">
                <LocationOn /> <span>{excursion.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <LocationOn /> <span>{excursion.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Event />{' '}
                <span>{new Date(excursion.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <AttachMoney /> <span>₴{excursion.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Group />
                <span>
                  {excursion.currentParticipants} Current Participants
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Group />
                <span>{excursion.maxParticipants} Max Participants</span>
              </div>
            </div>

            <p className="text-gray-700">{excursion.description}</p>
          </>
        )}

        <div className="mt-8">
          <EditExcursionForm
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
