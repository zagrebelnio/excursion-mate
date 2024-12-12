'use client';
import { useEffect, useState } from "react";
import { getExcursion } from "@/services/excursionService";
import { useSession } from "next-auth/react";
import { ExcursionType } from "@/types/excursion";
import { useParams } from "next/navigation";

export default function ExcursionPage() {
  const { data: session } = useSession();
  const params = useParams();

  const [excursion, setExcursion] = useState<ExcursionType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExcursion() {
      try {
        const excursionData = await getExcursion(session?.accessToken, Number(params.id));
        setExcursion(excursionData);
      } catch (err) {
        console.error("Error fetching excursion:", err);
        setError("Failed to fetch excursion details.");
      } finally {
        setLoading(false);
      }
    }

    fetchExcursion();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <img
          src={excursion.photo ? `data:image/jpeg;base64,${excursion.photo}` : '/placeholders/excursion.png'}
          alt={excursion.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        <h1 className="text-2xl font-bold mb-4">{excursion.title}</h1>

        <p className="text-gray-700 mb-2">
          <strong>Description:</strong> {excursion.description}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>City:</strong> {excursion.city}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> {excursion.location}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Date:</strong> {new Date(excursion.date).toLocaleString()}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Price:</strong> ${excursion.price}
        </p>

        <p className="text-gray-700 mb-2">
          <strong>Max Participants:</strong> {excursion.maxParticipants}
        </p>

        <p className="text-gray-700">
          <strong>Current Participants:</strong> {excursion.currentParticipants}
        </p>
      </div>
    </div>
  );
}
