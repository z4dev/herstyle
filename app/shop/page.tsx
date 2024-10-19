"use client";
import React, { useEffect, useState } from "react";
import FilterSection from "./component/FilterSection";
import ProductGrid from "./component/ProductGrid";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import MobileFilterSection from "./component/MobileFilter";
import { Button } from "@/components/ui/button"

function Page() {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["shop-products"],
    queryFn: async () => {
      const res = await axiosInstance.get("products");
      return res.data;
    },
  });

  const { data: packages, isLoading: isLoadingPackages } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => { 
      const res = await axiosInstance.get("packages");
       return res.data},
  });

  const[filter, setFilter] = useState({
    rating: 0,
    productsChecked: false,
    packagesChecked: false,
    priceRange: { min: 0, max: 5000 },
  })

  const handleOnlyPackages = () => {
    setFilter(prevFilter => ({...prevFilter, packagesChecked: !prevFilter.packagesChecked}))
  }

  const handleOnlyProducts = () => {
    setFilter(prevFilter => ({...prevFilter, productsChecked: !prevFilter.productsChecked}))
  }

  const handlePriceRangeChange = ( min: number, max: number) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      priceRange: { min, max },
    }));
  };

  const elementsInPriceRange = (min:number, max:number , data:any) => {
    return data.filter((item:any) => item.price.finalPrice >= min && item.price.finalPrice <= max)
  }

  const hanedleRatingChange = (rating:number) => {
    setFilter(prevFilter => ({...prevFilter, rating: rating}))
  }


  const [filteredData, setFilteredData] = useState({
    products: [],
    packages: []
  });


  useEffect(() => {
    if (products && packages) {
      setFilteredData({
        products: products.data.products,
        packages: packages.data.packages
      })
    }
    if(filter.productsChecked){
      setFilteredData(prevData => ({
        ...prevData,
        packages: []
      }))
    }
    if(filter.packagesChecked){
      setFilteredData(prevData => ({
        ...prevData,
        products: []
      }))
    }
    if(filter.priceRange.min === 50 && filter.priceRange.max === 60){
      setFilteredData(prevData => ({
        ...prevData,
        products: elementsInPriceRange(filter.priceRange.min, filter.priceRange.max, prevData.products),
        packages: elementsInPriceRange(filter.priceRange.min, filter.priceRange.max, prevData.packages)
      }))
    }
    if(filter.priceRange.min === 70 && filter.priceRange.max === 80){
      setFilteredData(prevData => ({
        ...prevData,
        products: elementsInPriceRange(filter.priceRange.min, filter.priceRange.max, prevData.products),
        packages: elementsInPriceRange(filter.priceRange.min, filter.priceRange.max, prevData.packages)
      }))
    }
    if(filter.priceRange.min === 80 && filter.priceRange.max === 90){
      setFilteredData(prevData => ({
        ...prevData,
        products: elementsInPriceRange(filter.priceRange.min, filter.priceRange.max, prevData.products),
        packages: elementsInPriceRange(filter.priceRange.min, filter.priceRange.max, prevData.packages)
      }))
    }

    if(filter.rating >= 1 && filter.rating <= 5){
      setFilteredData(prevData => ({
        ...prevData,
        products: prevData.products.filter((product:any) => product.rating >= filter.rating),
        packages: prevData.packages.filter((el:any) => el.rating >= filter.rating)
      }))
    }

  }, [products, packages , filter]);




  const isLoading = isLoadingProducts || isLoadingPackages;

  return (
    <div className="shop-container">
      <div className="shop-header"></div>
      <div className="shop-actions p-4 w-full flex justify-end gap-4">
      <MobileFilterSection filter={filter} onlyPackages={handleOnlyPackages} onlyProducts={handleOnlyProducts} priceRange={handlePriceRangeChange} handleRatingFilter={hanedleRatingChange} />
        <Button className="bg-white text-purple hover:bg-purple hover:text-white border-2 border-purple ">
          الأكثر طلبا
        </Button>
        <Button className="bg-purple hover:bg-white hover:text-purple hover:border-purple border-2 border-purple text-white lg:mr-64">
          الأحدث
        </Button>
      </div>
      <div className="shop-content flex w-full">
        <ProductGrid
          packages={filteredData.packages}
          products={filteredData.products}
          isLoading={isLoading}
        />
        <FilterSection filter={filter} onlyPackages={handleOnlyPackages} onlyProducts={handleOnlyProducts} priceRange={handlePriceRangeChange} handleRatingFilter={hanedleRatingChange} />
      </div>
    </div>
  );
}

export default Page;
