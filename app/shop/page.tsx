"use client";
import React, { useState, useCallback } from "react";
import FilterSection from "./component/FilterSection";
import ProductGrid from "./component/ProductGrid";
import axiosInstance from "@/utils/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import MobileFilterSection from "./component/MobileFilter";
import { Button } from "@/components/ui/button";

function Page() {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [stars, setStars] = useState<number | null>(null);

  const fetchProducts = useCallback(
    async ({ pageParam = 1, limit = 4 }) => {
      const res = await axiosInstance.get("products", {
        params: {
          page: pageParam,
          limit,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          stars,
        },
      });
      return res;
    },
    [priceRange, stars]
  );

  const fetchPackages = useCallback(
    async ({ pageParam = 1, limit = 3 }) => {
      const res = await axiosInstance.get("packages", {
        params: {
          page: pageParam,
          limit,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          stars,
        },
      });
      return res;
    },
    [priceRange, stars]
  );

  const [isOnlyPackages, setIsOnlyPackages] = useState(false);
  const [isOnlyProducts, setIsOnlyProducts] = useState(false);

  const {
    data: productsData,
    fetchNextPage: fetchNextProducts,
    hasNextPage: hasNextProducts,
    isFetchingNextPage: isFetchingNextProducts,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useInfiniteQuery({
    queryKey: ["shop-products", priceRange, stars],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, pages) => {
      const currentPage = lastPage.data.data.options.page;
      const totalPages = Math.ceil(
        lastPage.data.data.options.count / lastPage.data.data.options.limit
      );
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const {
    data: packagesData,
    fetchNextPage: fetchNextPackages,
    hasNextPage: hasNextPackages,
    isFetchingNextPage: isFetchingNextPackages,
    isLoading: isLoadingPackages,
    refetch: refetchPackages,
  } = useInfiniteQuery({
    queryKey: ["packages", priceRange, stars],
    queryFn: fetchPackages,
    getNextPageParam: (lastPage, pages) => {
      const currentPage = lastPage.data.data.options.page;
      const totalPages = Math.ceil(
        lastPage.data.data.options.count / lastPage.data.data.options.limit
      );
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const [filter, setFilter] = useState({
    rating: 0,
    productsChecked: false,
    packagesChecked: false,
    priceRange: { min: 0, max: 5000 },
  });

  const handleOnlyPackages = () => {
    setIsOnlyPackages(true);
    setIsOnlyProducts(false)
  };

  const handleOnlyProducts = () => {
    setIsOnlyPackages(false);
    setIsOnlyProducts(true)
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    refetchProducts();
    refetchPackages();
  };

  const handleStarsChange = (rating: number) => {
    setStars(rating);
    refetchProducts();
    refetchPackages();
  };

  const isLoading = isLoadingProducts || isLoadingPackages;



  const loadMore = () => {
    if (hasNextProducts) fetchNextProducts();
    if (hasNextPackages) fetchNextPackages();
  };

  return (
    <div className="shop-container w-full  mx-auto px-4 lg:px-24 py-8">
      <div className="shop-header"></div>
      <div className="shop-actions p-4 w-full flex justify-end gap-4">
        <MobileFilterSection
          filter={filter}
          onlyPackages={handleOnlyPackages}
          onlyProducts={handleOnlyProducts}
          handlePriceFilter={handlePriceRangeChange}
          handleRatingFilter={handleStarsChange}
        />
      </div>
      <div className="shop-content flex w-full flex-1">
        <ProductGrid
          packages={
            !isOnlyPackages
              ? packagesData?.pages.flatMap(
                  (page) => page.data.data.packages
                ) || []
              : []
          }
          products={
            !isOnlyProducts
              ? productsData?.pages.flatMap(
                  (page) => page.data.data.products
                ) || []
              : []
          }
          isLoading={isLoading}
          loadMore={loadMore}
          hasMore={hasNextProducts || hasNextPackages}
          isFetchingNext={isFetchingNextProducts || isFetchingNextPackages}
        />
        <FilterSection
          filter={filter}
          onlyPackages={handleOnlyProducts}
          onlyProducts={ handleOnlyPackages }
          handlePriceFilter={handlePriceRangeChange}
          handleRatingFilter={handleStarsChange}
        />
      </div>
    </div>
  );
}

export default Page;
