'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getExcursion } from '@/services/excursionService';
import { useSession } from 'next-auth/react';
import { ExcursionType } from '@/types/excursion';
import { useParams } from 'next/navigation';
import {
  LocationOn,
  Event,
  AttachMoney,
  Group,
  ThumbUp,
  ThumbDown,
  TurnedIn,
  TurnedInNot,
} from '@mui/icons-material';
import { useExcursions } from '@/hooks/useExcursions';

export default function ExcursionPage() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const params = useParams();

  const { addToSaved, removeFromSaved } = useExcursions();
  const [excursion, setExcursion] = useState<ExcursionType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    async function fetchExcursion() {
      if (!session?.accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const excursionData = await getExcursion(
          session?.accessToken,
          Number(params.id)
        );
        setExcursion(excursionData);
        setIsFavorite(excursionData.isFavorite);
        setLikes(excursionData.likes);
        setDislikes(excursionData.dislikes);
      } catch (err) {
        console.error('Error fetching excursion:', err);
        setError('Failed to fetch excursion details.');
      } finally {
        setLoading(false);
      }
    }

    fetchExcursion();
  }, [params.id, token]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromSaved(token as string, excursion?.id as number);
    } else {
      addToSaved(token as string, excursion?.id as number);
    }
    setIsFavorite((prev) => !prev);
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
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
            <Event /> <span>{new Date(excursion.date).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <AttachMoney /> <span>{excursion.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <Group />
            <span>
              {excursion.maxParticipants - excursion.currentParticipants} places
              left
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{excursion.description}</p>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-700 hover:text-blue-500">
            <ThumbUp fontSize="small" />
            <span>{likes ?? 0}</span>
          </button>

          <button className="flex items-center gap-1 text-gray-700 hover:text-red-500">
            <ThumbDown fontSize="small" />
            <span>{dislikes ?? 0}</span>
          </button>

          <button
            onClick={handleFavoriteToggle}
            className="flex items-center gap-1 text-gray-700 hover:text-green-500"
          >
            {isFavorite ? (
              <TurnedIn fontSize="medium" />
            ) : (
              <TurnedInNot fontSize="medium" />
            )}
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
