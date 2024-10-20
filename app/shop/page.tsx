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

  const fetchProducts = useCallback(
    async ({ pageParam = 1, limit = 5 }) => {
      const res = await axiosInstance.get("products", {
        params: {
          page: pageParam,
          limit,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
        },
      });
      return res;
    },
    [priceRange]
  );

  const fetchPackages = useCallback(
    async ({ pageParam = 1, limit = 4 }) => {
      const res = await axiosInstance.get("packages", {
        params: {
          page: pageParam,
          limit,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
        },
      });
      return res;
    },
    [priceRange]
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
    queryKey: ["shop-products", priceRange],
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
    queryKey: ["packages", priceRange],
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
    setIsOnlyPackages((prev) => !prev);
  };

  const handleOnlyProducts = () => {
    setIsOnlyProducts((prev) => !prev);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    refetchProducts();
    refetchPackages();
  };

  const hanedleRatingChange = (rating: number) => {
    setFilter((prevFilter) => ({ ...prevFilter, rating: rating }));
  };

  const isLoading = isLoadingProducts || isLoadingPackages;

  console.log("hasNextProducts = ", hasNextProducts);

  const loadMore = () => {
    if (hasNextProducts) fetchNextProducts();
    if (hasNextPackages) fetchNextPackages();
  };

  return (
    <div className="shop-container">
      <div className="shop-header"></div>
      <div className="shop-actions p-4 w-full flex justify-end gap-4">
        <MobileFilterSection
          filter={filter}
          onlyPackages={handleOnlyPackages}
          onlyProducts={handleOnlyProducts}
          priceRange={handlePriceRangeChange}
          handleRatingFilter={hanedleRatingChange}
        />
        <Button className="bg-white text-purple hover:bg-purple hover:text-white border-2 border-purple ">
          الأكثر طلبا
        </Button>
        <Button className="bg-purple hover:bg-white hover:text-purple hover:border-purple border-2 border-purple text-white lg:mr-64">
          الأحدث
        </Button>
      </div>
      <div className="shop-content flex w-full">
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
          onlyPackages={handleOnlyPackages}
          onlyProducts={handleOnlyProducts}
          priceRange={handlePriceRangeChange}
          handleRatingFilter={hanedleRatingChange}
        />
      </div>
    </div>
  );
}

export default Page;
