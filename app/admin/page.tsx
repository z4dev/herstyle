"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CuponPage from "./components/CuponPage";
import Productpage from "./components/Productpage";
import PackagePage from "./components/PackagePage";
import OrderPage from "./components/OrderPage";

export default function page() {


  return (
    <div className="min-h-screen bg-gray-100 text-right" dir="rtl">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          لوحة التحكم الإدارية
        </h1>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="orders" className="px-4 py-2">
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="products" className="px-4 py-2">
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="packages" className="px-4 py-2">
              الحزم
            </TabsTrigger>
            <TabsTrigger value="coupons" className="px-4 py-2">
              الكوبونات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
           <OrderPage/>
          </TabsContent>

          <TabsContent value="products">
            <Productpage/>
          </TabsContent>

          <TabsContent value="packages">
           <PackagePage/>
          </TabsContent>

          <TabsContent value="coupons">
            <CuponPage/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
