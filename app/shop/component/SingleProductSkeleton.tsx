import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

function SingleProductSkeleton() {
    return (
        <div className="container mx-auto px-24 py-8">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 flex flex-col items-end">
              <Skeleton className="h-40 w-full mb-6" />
              <Skeleton className="h-32 w-full mb-6" />
              <Skeleton className="h-32 w-full mb-6" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="md:w-1/2">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
          <div className="mt-16">
            <div className="flex justify-center mb-6">
              <Skeleton className="h-10 w-80" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="mt-8">
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-6 w-64 mx-auto mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      );
  
}

export default SingleProductSkeleton