'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function OrderPage() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => axiosInstance.get('orders'),
  })

  const updateOrderStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      axiosInstance.put(`orders/${orderId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  if (isLoading) return <div>جاري التحميل...</div>
  if (error) return <div>حدث خطأ أثناء تحميل البيانات</div>

  const orders = data?.data?.data?.orders || []

  const filteredOrders = orders.filter((order:any) => order.status !== "CANCELLED")

  const openDialog = (order: any) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-200 text-orange-800"
      case "DELIVERED":
        return "bg-green-200 text-green-800"
      case "CANCELLED":
        return "bg-red-200 text-red-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "قيد الانتظار"
      case "DELIVERED":
        return "تم التوصيل"
      case "CANCELLED":
        return "ملغي"
      default:
        return status
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus.mutate({ orderId, status: newStatus })
  }

  return (
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
              <TableHead className="text-right">حالة الطلب</TableHead>
              <TableHead className="text-right">المشتري</TableHead>
              <TableHead className="text-right">تاريخ الطلب</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell>
                  <button
                    onClick={() => openDialog(order)}
                    className="text-blue-600 hover:underline"
                  >
                    {order._id}
                  </button>
                </TableCell>
                <TableCell>{order.cart.totalPrice} ريال</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-nowrap ${getStatusColor(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </TableCell>
                <TableCell>{order.user?.name}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString('ar-EG-u-nu-arab')}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    {order.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className='bg-purple text-white'
                          onClick={() => handleStatusUpdate(order._id, "DELIVERED")}
                          disabled={updateOrderStatus.isPending}
                        >
                          تم التوصيل
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(order._id, "CANCELLED")}
                          disabled={updateOrderStatus.isPending}
                        >
                          إلغاء
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-right'>تفاصيل الطلب</DialogTitle>
          </DialogHeader>
          {selectedOrder && <CartInfo order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function CartInfo({ order }: { order: any }) {
  return (
    <div className="space-y-4 text-right">
      <div>
        <h3 className="font-semibold">معلومات المشتري</h3>
        <p>{order.user.name} :الاسم</p>
        <p> {order.user.phoneNumber} :رقم الهاتف</p>
      </div>
      <div>
        <h3 className="font-semibold">عنوان التوصيل</h3>
        <p> {order.address.street} :الشارع</p>
        <p>المدينة: {order.address.city}</p>
        <p> {order.address.postalCode} :الرمز البريدي</p>
        <p> {order.address.country}:الدولة</p>
      </div>
      <div>
        <h3 className="font-semibold">المنتجات</h3>
        <ul className="">
          {order.cart.products.map((product: any) => (
            <li key={product._id}>
              {product.productId.name} - الكمية: {product.quantity} - السعر: {product.totalPrice} ريال
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold">إجمالي الطلب: {order.cart.totalPrice} ريال</h3>
      </div>
      <div>
        <h3 className="font-semibold">معلومات الدفع</h3>
        <p>طريقة الدفع : {order.paymentMethod === 'COD' ? 'الدفع عند الاستلام' : 'دفع إلكتروني'}</p>
        <p>حالة الدفع: {order.paymentStatus === 'PENDING' ? 'قيد الانتظار' : 'مكتمل'}</p>
      </div>
    </div>
  )
}

export default OrderPage