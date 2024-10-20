"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function page() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "منتج 1",
      price: 100,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "منتج 2",
      price: 200,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]);
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "حزمة 1",
      products: [1, 2],
      image: "/placeholder.svg?height=100&width=100",
    },
  ]);
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SUMMER2023", discount: 20 },
  ]);
  const [orders, setOrders] = useState([
    { id: 1, buyer: "أحمد محمد", total: 300, status: "قيد الشحن" },
    { id: 2, buyer: "فاطمة علي", total: 150, status: "تم التسليم" },
  ]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const addProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newProduct = {
      id: products.length + 1,
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      image: "/placeholder.svg?height=100&width=100",
    };
    setProducts([...products, newProduct]);
    form.reset();
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const addPackage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newPackage = {
      id: packages.length + 1,
      name: formData.get("name") as string,
      products: selectedProducts,
      image: "/placeholder.svg?height=100&width=100",
    };
    setPackages([...packages, newPackage]);
    setSelectedProducts([]);
    form.reset();
  };

  const toggleProductSelection = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addCoupon = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newCoupon = {
      id: coupons.length + 1,
      code: formData.get("code") as string,
      discount: Number(formData.get("discount")),
    };
    setCoupons([...coupons, newCoupon]);
    form.reset();
  };

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
            <Card>
              <CardHeader>
                <CardTitle>الطلبات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                      <TableHead className="text-right">حالة الشحن</TableHead>
                      <TableHead className="text-right">المشتري</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.total} ريال</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full ${
                              order.status === "قيد الشحن"
                                ? "bg-orange-200 text-orange-800"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>{order.buyer}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>المنتجات</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addProduct} className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>&nbsp;</Label>
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="w-4 h-4 mr-2" /> إضافة منتج
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="price">السعر</Label>
                      <Input id="price" name="price" type="number" required />
                    </div>
                    <div>
                      <Label htmlFor="name">الاسم</Label>
                      <Input id="name" name="name" type="text" required />
                    </div>
                  </div>
                </form>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">الصورة</TableHead>
                      <TableHead className="text-center">الاسم</TableHead>
                      <TableHead className="text-center">السعر</TableHead>
                      <TableHead className="text-center">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="text-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover"
                          />
                        </TableCell>
                        <TableCell className="text-center">{product.name}</TableCell>
                        <TableCell className="text-center">{product.price} ريال</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="destructive"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  الحزم
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={addPackage} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="packageName"
                        className="text-sm font-medium text-gray-700 mb-1"
                      >
                        اسم الحزمة
                      </Label>
                      <Input
                        id="packageName"
                        name="name"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">
                        المنتجات
                      </Label>
                      <ScrollArea className="h-fit border rounded-md p-4">
                        <div className="space-y-2">
                          {products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center space-x-3 "
                            >
                              <Checkbox
                                id={`product-${product.id}`}
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={() =>
                                  toggleProductSelection(product.id)
                                }
                              />
                              <Label
                                htmlFor={`product-${product.id}`}
                                className="text-sm text-gray-600"
                              >
                                {product.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> إضافة حزمة
                  </Button>
                </form>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    الحزم الحالية
                  </h3>
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">الصورة</TableHead>
                          <TableHead className="text-right">الاسم</TableHead>
                          <TableHead className="text-right">المنتجات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {packages.map((pkg) => (
                          <TableRow key={pkg.id}>
                            <TableCell>
                              <img
                                src={pkg.image}
                                alt={pkg.name}
                                className="w-12 h-12 object-cover rounded-full"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {pkg.name}
                            </TableCell>
                            <TableCell>
                              {pkg.products
                                .map(
                                  (id) =>
                                    products.find((p) => p.id === id)?.name
                                )
                                .join(", ")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons">
            <Card>
              <CardHeader>
                <CardTitle>الكوبونات</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={addCoupon} className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="couponCode">رمز الكوبون</Label>
                      <Input id="couponCode" name="code" required />
                    </div>
                    <div>
                      <Label htmlFor="couponDiscount">نسبة الخصم (%)</Label>
                      <Input
                        id="couponDiscount"
                        name="discount"
                        type="number"
                        required
                      />
                    </div>
                    <div>
                      <Label>&nbsp;</Label>
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="w-4 h-4 mr-2" /> إضافة كوبون
                      </Button>
                    </div>
                  </div>
                </form>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الرمز</TableHead>
                      <TableHead>نسبة الخصم</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell>{coupon.code}</TableCell>
                        <TableCell>{coupon.discount}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
