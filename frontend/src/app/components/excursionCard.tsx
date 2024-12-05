import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import { ExcursionType } from '../types/excursion';

const ExcursionCard: React.FC<{ excursion: ExcursionType }> = ({
  excursion,
}) => {
  return (
    <div
      key={excursion.id}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
    >
      <Link href={`/excursions/${excursion.id}`}>
        <Image
          src={excursion.image}
          alt={excursion.title}
          width={1000}
          height={600}
          className="w-full h-60 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-bold">{excursion.title}</h3>
          <p className="text-gray-600 mt-2">{excursion.description}</p>
          <div className="mt-4">
            <p className="text-gray-500">{excursion.location}</p>
            <p className="text-gray-500">
              {format(new Date(excursion.date), 'dd.MM.yyyy')}
            </p>
            <p className="text-gray-500">Price: ₴{excursion.price}</p>
            <div className="flex items-center mt-2 gap-4">
              <button className="flex items-center gap-1 hover:text-blue-500">
                <ThumbUp fontSize="small" />
                <span className="text-gray-500">{excursion.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-500">
                <ThumbDown fontSize="small" />
                <span className="text-gray-500">{excursion.dislikes}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ExcursionCard;
