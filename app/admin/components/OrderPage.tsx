import React from 'react'
import { useQuery } from '@tanstack/react-query'
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

function OrderPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => axiosInstance.get('orders'),
  })

  if (isLoading) return <div>جاري التحميل...</div>
  if (error) return <div>حدث خطأ أثناء تحميل البيانات</div>

  const orders = data?.data?.data?.orders || []

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.cart.totalPrice} ريال</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      order.status === "PENDING"
                        ? "bg-orange-200 text-orange-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {order.status === "PENDING" ? "قيد الانتظار" : "مكتمل"}
                  </span>
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default OrderPage
