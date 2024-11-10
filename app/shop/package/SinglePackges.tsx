import Product from '@/app/(components)/Product';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import ProductSkelton from "@/app/(components)/ProductSkelton"
import React from 'react'

async function getPackages() {
    const { data } = await axiosInstance.get("packages");
    return data.data;
  }
  

function SinglePackges() {
        // New query for packages
        const { data: packagesData, isLoading: packagesLoading, error: packagesError } = useQuery({
            queryKey: ["single-packages"],
            queryFn: getPackages,
          });
      
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 p-4 justify-items-center'>
    {[...Array(4)].map((_, index) => (
      <ProductSkelton key={index} isLoading={packagesLoading} />
    ))}
    {packagesData &&
      packagesData.packages
        .slice(0, 4) // Get only the first 4 packages
        .map((packageItem: any, i: number) => (
          <Product
            id={`/package/${packageItem._id}`} // Adjusted to use package ID
            key={packageItem._id}
            image={packageItem.images[0]} // Adjusted to use package image
            title={packageItem.name}
            rating={packageItem.stars}
            reviewCount={packageItem.numReviews}
            price={packageItem.price.finalPrice}
            originalPrice={packageItem.price.originalPrice}
            discount={packageItem.price.discount}
          />
        ))}
    </div>
  )
}

export default SinglePackges
