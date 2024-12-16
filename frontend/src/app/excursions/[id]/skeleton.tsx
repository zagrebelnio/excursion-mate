'use client';
import { Skeleton } from '@mui/material';
import React from 'react';

export default function ExcursionPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={320}
          animation="wave"
          className="mb-6 rounded-lg"
        />

        <Skeleton
          variant="text"
          width="60%"
          height={40}
          animation="wave"
          className="mb-4"
        />

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Skeleton variant="text" width="30%" height={30} animation="wave" />
          <Skeleton variant="text" width="30%" height={30} animation="wave" />
          <Skeleton variant="text" width="30%" height={30} animation="wave" />
          <Skeleton variant="text" width="30%" height={30} animation="wave" />
        </div>

        <Skeleton
          variant="rectangular"
          width="100%"
          height={120}
          animation="wave"
          className="mb-6"
        />

        <div className="flex gap-4">
          <Skeleton
            variant="rectangular"
            width={100}
            height={40}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={40}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={40}
            animation="wave"
          />
        </div>
      </div>
    </div>
  );
}
