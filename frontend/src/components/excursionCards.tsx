import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { ExcursionType } from '@/types/excursion';
import { Skeleton, Box } from '@mui/material';

export const ExcursionCard: React.FC<{ excursion: ExcursionType }> = ({
  excursion,
}: {
  excursion: ExcursionType;
}) => {
  return (
    <div
      key={excursion.id}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
    >
      <Link href={`/excursions/${excursion.id}`}>
        <Image
          src={
            excursion.photo
              ? `data:image/jpeg;base64,${excursion.photo}`
              : '/placeholders/excursion.png'
          }
          alt={excursion.title}
          width={1000}
          height={600}
          className="w-full h-60 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold">{excursion.title}</h3>
          <p className="text-gray-600 mt-2">{excursion.description}</p>
          <div className="mt-4">
            <p className="text-gray-500">{excursion.city}</p>
            <p className="text-gray-500">
              {format(new Date(excursion.date), 'dd.MM.yyyy')}
            </p>
            <p className="text-gray-500">Price: ₴{excursion.price}</p>
            <div className="flex items-center mt-2 gap-4">
              <button className="flex items-center gap-1 hover:text-blue-500">
                <ThumbUp fontSize="small" />
                <span className="text-gray-500">{excursion.likes ?? 0}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-500">
                <ThumbDown fontSize="small" />
                <span className="text-gray-500">{excursion.dislikes ?? 0}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const WideExcursionCard: React.FC<{ excursion: ExcursionType }> = ({
  excursion,
}: {
  excursion: ExcursionType;
}) => {
  return (
    <Link href={`/excursions/${excursion.id}`}>
      <div className="flex bg-white rounded-lg shadow-md overflow-hidden cursor-pointer">
        <div className="w-1/3">
          <Image
            src={
              excursion.photo
                ? `data:image/jpeg;base64,${excursion.photo}`
                : '/placeholders/excursion.png'
            }
            alt={excursion.title}
            width={1000}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col justify-between w-2/3">
          <h3 className="text-2xl font-bold text-gray-800 hover:underline">
            {excursion.title}
          </h3>

          <p className="text-gray-600 mt-4 text-justify">
            {excursion.description}
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <p>
              <strong>City:</strong> {excursion.city}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {format(new Date(excursion.date), 'dd.MM.yyyy')}
            </p>
            <p>
              <strong>Price:</strong> ₴{excursion.price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ExcursionCardSkeleton: React.FC = () => {
  return (
    <Box
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height={240}
        animation="wave"
      />

      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={32} animation="wave" />
        <Skeleton variant="text" width="80%" height={20} animation="wave" />
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          animation="wave"
          sx={{ mb: 2 }}
        />

        <Skeleton variant="text" width="50%" height={20} animation="wave" />
        <Skeleton variant="text" width="50%" height={20} animation="wave" />
        <Skeleton variant="text" width="50%" height={20} animation="wave" />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Skeleton
            variant="rectangular"
            width={40}
            height={20}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            width={40}
            height={20}
            animation="wave"
          />
        </Box>
      </Box>
    </Box>
  );
};
