'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  getExcursion,
  bookExcursion,
  cancelBooking,
  postView,
} from '@/services/excursionService';
import { useSession } from 'next-auth/react';
import { ExcursionType } from '@/types/excursion';
import { useParams } from 'next/navigation';
import {
  LocationOn,
  LocationCity,
  Event,
  AccessTime,
  AttachMoney,
  Group,
  ThumbUp,
  ThumbDown,
  TurnedIn,
  TurnedInNot,
  EventNote,
  WbSunny,
  Air,
  Opacity,
  Thermostat,
} from '@mui/icons-material';
import { useExcursions } from '@/hooks/useExcursions';
import ExcursionPageSkeleton from './skeleton';

export default function ExcursionPage() {
  const { data: session } = useSession();
  const token = session?.accessToken ?? null;
  const params = useParams();

  const { addToSaved, removeFromSaved, reactToExcursion } = useExcursions();
  const [excursion, setExcursion] = useState<ExcursionType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [reaction, setReaction] = useState<null | 'Like' | 'Dislike'>(null);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    async function fetchExcursion() {
      setLoading(true);
      setError(null);

      try {
        const excursionData = await getExcursion(token, Number(params.id));
        setExcursion(excursionData);
        setIsFavorite(excursionData.isFavorite);
        setLikes(excursionData.likes);
        setDislikes(excursionData.dislikes);
        setReaction(excursionData.reaction);
        setIsBooked(!excursionData.canRegister);
      } catch (err) {
        console.error('Error fetching excursion:', err);
        setError('Failed to fetch excursion details.');
      } finally {
        setLoading(false);
      }
    }

    fetchExcursion();
  }, [params.id, token]);

  useEffect(() => {
    if (excursion) {
      postView(token as string, excursion.id);
    }
  }, [excursion, token]);

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await removeFromSaved(token as string, excursion?.id as number);
      } else {
        await addToSaved(token as string, excursion?.id as number);
      }
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLike = async () => {
    try {
      console.log(token);
      await reactToExcursion(token as string, excursion?.id as number, 'Like');
      if (reaction === 'Like') {
        setReaction(null);
        setLikes((prev) => prev - 1);
      } else if (reaction === 'Dislike') {
        setReaction('Like');
        setLikes((prev) => prev + 1);
        setDislikes((prev) => prev - 1);
      } else {
        setReaction('Like');
        setLikes((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error liking excursion:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await reactToExcursion(
        token as string,
        excursion?.id as number,
        'Dislike'
      );
      if (reaction === 'Dislike') {
        setReaction(null);
        setDislikes((prev) => prev - 1);
      } else if (reaction === 'Like') {
        setReaction('Dislike');
        setDislikes((prev) => prev + 1);
        setLikes((prev) => prev - 1);
      } else {
        setReaction('Dislike');
        setDislikes((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error disliking excursion:', error);
    }
  };

  const handleBook = async () => {
    try {
      await bookExcursion(token as string, excursion?.id as number);
      setIsBooked(true);
    } catch (error) {
      console.error('Error booking excursion:', error);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await cancelBooking(token as string, excursion?.id as number);
      setIsBooked(false);
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  if (loading) return <ExcursionPageSkeleton />;

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
            <LocationCity /> <span>{excursion.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <LocationOn /> <span>{excursion.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Event />
            <span>{new Date(excursion.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <AccessTime />
            <span>
              {new Date(excursion.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
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

        {excursion.weather && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <WbSunny /> Weather Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center gap-2">
                <Thermostat /> Temperature: {excursion.weather.temperature}°C
              </div>
              <div className="flex items-center gap-2">
                <Air /> Wind Speed: {excursion.weather.windSpeed} km/h
              </div>
              <div className="flex items-center gap-2">
                <Thermostat /> Feels Like: {excursion.weather.feelsLike}°C
              </div>
              <div className="flex items-center gap-2">
                <Opacity /> Humidity: {excursion.weather.humidity}%
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Description:</span>{' '}
                {excursion.weather.weatherDescription}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={token ? handleLike : undefined}
            className={`flex items-center gap-1 ${
              reaction === 'Like' ? 'text-green-500' : 'text-gray-700'
            } hover:text-blue-500`}
          >
            <ThumbUp fontSize="small" />
            <span>{likes ?? 0}</span>
          </button>

          <button
            onClick={token ? handleDislike : undefined}
            className={`flex items-center gap-1 ${
              reaction === 'Dislike' ? 'text-green-500' : 'text-gray-700'
            } hover:text-red-500`}
          >
            <ThumbDown fontSize="small" />
            <span>{dislikes ?? 0}</span>
          </button>

          <button
            onClick={token ? handleFavoriteToggle : undefined}
            className="flex items-center gap-1 text-gray-700 hover:text-green-500"
          >
            {isFavorite ? (
              <TurnedIn fontSize="medium" />
            ) : (
              <TurnedInNot fontSize="medium" />
            )}
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>

          {!isBooked ? (
            <button
              onClick={token ? handleBook : undefined}
              disabled={
                excursion.maxParticipants - excursion.currentParticipants <= 0
              }
              className="flex items-center gap-1 text-white bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2"
            >
              <EventNote fontSize="small" />
              <span>Book Excursion</span>
            </button>
          ) : (
            <button
              onClick={token ? handleCancelBooking : undefined}
              className="flex items-center gap-1 text-white bg-red-500 hover:bg-red-600 rounded-lg px-4 py-2"
            >
              <EventNote fontSize="small" />
              <span>Cancel Booking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
