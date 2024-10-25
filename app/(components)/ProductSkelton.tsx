import Image from 'next/image';
import { ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton"

interface ProductProps {
  isLoading?: boolean;
}

const Product: React.FC<ProductProps> = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white w-[250px] rounded-lg shadow-md p-4">
        <Skeleton className="h-[300px] w-full rounded-t-lg mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2 ml-auto" />
        <div className="flex items-center justify-end mb-2">
          <Skeleton className="h-4 w-8 mr-1" />
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-4 h-4 mr-1" />
            ))}
          </div>
        </div>
        <div className="flex flex-col-reverse items-end">
          <Skeleton className="h-10 w-32 mt-3" />
          <div className="text-right">
            <Skeleton className="h-6 w-20 mb-1" />
            <div className='flex items-center justify-end'>
              <Skeleton className="h-4 w-8 mr-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ... existing Product component code ...
}

export default Product;