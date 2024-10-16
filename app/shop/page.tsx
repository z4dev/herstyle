"use client";
import React, { useState } from "react";
import FilterSection from "./component/FilterSection";
import ProductGrid from "./component/ProductGrid";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

function page() {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("products");
      return res.data;
    },
  });

  const { data: packages, isLoading: isLoadingPackages } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => { const res = await axiosInstance.get("packages"); return res.data},
  });
 
  return (
    <div className="shop-container">
      <div className="shop-header"></div>
      <div className="shop-content flex">
        <ProductGrid
          packages={packages?.data?.packages}
          products={products?.products }
          isLoading={isLoadingProducts}
        />
        <FilterSection  />
      </div>
    </div>
  );
}

export default page;
