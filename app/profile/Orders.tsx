import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface Order {
  _id: string;
  user: {
    name: string;
    phoneNumber: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    googleLocation:string;
  };
  cart: {
    totalPrice: number;
    products: {
      productId: {
        _id: string;
        name: string;
      };
      quantity: number;
      totalPrice: number;
    }[];
  };
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const fetchOrders = async () => {
  const response = await axiosInstance.get("orders");
  return response.data;
};

// Utility functions for status handling
const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-orange-200 text-orange-800";
    case "DELIVERED":
      return "bg-green-200 text-green-800";
    case "CANCELLED":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "قيد الانتظار";
    case "DELIVERED":
      return "مكتمل";
    case "CANCELLED":
      return "ملغي";
    default:
      return status;
  }
};

function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ["client-order"],
    queryFn: fetchOrders,
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };


  return (
    <>
      <h2 className="text-2xl font-bold my-4 text-right">طلباتي</h2>
      {isOrdersLoading ? (
        <p>جاري تحميل الطلبات...</p>
      ) : isOrdersError ? (
        <p>حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى.</p>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                  <TableHead className="text-right">حالة الطلب</TableHead>
                  <TableHead className="text-right">طريقة الدفع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData?.data.orders.map((order: Order) => (
                  <TableRow key={order._id}>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            onClick={() => handleOrderClick(order)}
                          >
                            {order._id}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle className="text-right">
                              تفاصيل الطلب
                            </DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                              <div className="grid gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="text-right">
                                    <strong>اسم العميل:</strong>{" "}
                                    {selectedOrder.user.name}
                                  </div>
                                  <div className="text-right">
                                    <strong>رقم الهاتف:</strong>{" "}
                                    {selectedOrder.user.phoneNumber}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="text-right">
                                    <strong>العنوان</strong> <br />{" "}
                                     <Link href={selectedOrder.address.googleLocation}>{`${selectedOrder.address.street}, ${selectedOrder.address.city}, ${selectedOrder.address.country}`}</Link>
                                  </div>
                                  <div className="text-right">
                                    <strong>حالة الطلب:</strong>{" "}
                                    {getStatusText(selectedOrder.status)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="text-right">
                                    <strong>حالة الدفع</strong> <br />{" "}
                                    {selectedOrder.paymentStatus}
                                  </div>
                                  <div className="text-right">
                                    <strong>طريقة الدفع:</strong>{" "}
                                    {selectedOrder.paymentMethod === "COD"
                                      ? "عند الاستلام"
                                      : "دفع إلكتروني"}
                                  </div>
                                </div>
                                <div className="col-span-1">
                                  <h3 className="text-lg font-semibold mb-2 text-right">
                                    تفاصيل السلة
                                  </h3>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="text-right">
                                          المنتج
                                        </TableHead>
                                        <TableHead className="text-right">
                                          الكمية
                                        </TableHead>
                                        <TableHead className="text-right">
                                          السعر
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrder.cart.products.map(
                                        (product) => (
                                          <TableRow key={product.productId._id}>
                                            <TableCell className="text-right">
                                              {product.productId.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                              {product.quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                              {product.totalPrice} ريال
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                  <div className="text-right mt-4 font-bold">
                                    <strong>
                                      المجموع الكلي:{" "}
                                      {selectedOrder.cart.totalPrice} ريال
                                    </strong>
                                  </div>
                                </div>
                              </div>
                            </ScrollArea>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(order.createdAt).toLocaleDateString('ar-EG-u-nu-arab')}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.cart.totalPrice} ريال
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-nowrap ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right ">
                      {order.paymentMethod === "COD"
                        ? "عند الاستلام"
                        : "دفع إلكتروني"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default Orders;
