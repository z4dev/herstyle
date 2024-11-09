'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
 import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, CalendarIcon, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Coupon = {
  _id: string;
  code: string;
  discount: {
    type: "PERCENTAGE" | "FIXED";
    value: number;
  };
  expiryDate: string;
};

async function getCoupons() {
  const { data } = await axiosInstance.get("/coupons");
  return data;
}

async function addCoupon(couponData: Omit<Coupon, "_id">) {
  const { data } = await axiosInstance.post("/coupons", couponData);
  return data;
}

async function updateCoupon(coupon: Coupon) {
  const { data } = await axiosInstance.put(`/coupons/${coupon._id}`, coupon);
  return data;
}

async function deleteCoupon(couponId: string) {
  const { data } = await axiosInstance.delete(`/coupons/${couponId}`);
  return data;
}

export default function CouponPage() {
  const [coupon, setCoupon] = useState<Partial<Coupon>>({
    code: "",
    discount: { type: "PERCENTAGE", value: 0 },
    expiryDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: coupons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: getCoupons,
  });

  const addCouponMutation = useMutation({
    mutationFn: addCoupon,
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إضافة الكوبون بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      resetForm();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة الكوبون",
        duration: 3000,
        variant: "destructive",
      });
    },
  });

  const updateCouponMutation = useMutation({
    mutationFn: updateCoupon,
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم تحديث الكوبون بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      resetForm();
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الكوبون",
        duration: 3000,
        variant: "destructive",
      });
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم حذف الكوبون بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف الكوبون",
        duration: 3000,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing) {
      updateCouponMutation.mutate(coupon as Coupon);
    } else {
      addCouponMutation.mutate(coupon as Omit<Coupon, "_id">);
    }
  };

  const handleEdit = (couponToEdit: Coupon) => {
    setCoupon(couponToEdit);
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = (couponId: string) => {
    setCouponToDelete(couponId);
  };

  const handleConfirmDelete = () => {
    if (couponToDelete) {
      deleteCouponMutation.mutate(couponToDelete);
      setCouponToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setCouponToDelete(null);
  };

  const resetForm = () => {
    setCoupon({
      code: "",
      discount: { type: "PERCENTAGE", value: 0 },
      expiryDate: "",
    });
  };

  const formRef = React.useRef<HTMLFormElement | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading coupons</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>الكوبونات</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="mb-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">تاريخ انتهاء الصلاحية</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="expiryDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !coupon.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {coupon.expiryDate ? format(new Date(coupon.expiryDate), "PPP") : <span>اختر التاريخ</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={coupon.expiryDate ? new Date(coupon.expiryDate) : undefined}
                    onSelect={(date) => setCoupon({ ...coupon, expiryDate: date?.toISOString() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {coupon.discount?.type === "PERCENTAGE" ? "الخصم (%)" : "الخصم (SAR)"}
              </Label>
              <Input
                id="discountValue"
                type="number"
                required
                value={coupon.discount?.value || ""}
                onChange={(e) => setCoupon({ 
                  ...coupon, 
                  discount: { 
                    type: coupon.discount?.type || "PERCENTAGE", // Default to "PERCENTAGE"
                    value: Number(e.target.value) 
                  } 
                })}
              />
            </div>
            <div className="space-y-2 order-first md:order-last">
              <Label htmlFor="couponCode">رمز الكوبون</Label>
              <Input
                required
                value={coupon.code || ""}
                onChange={(e) => setCoupon({ ...coupon, code: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y flex items-center justify-end">
            <RadioGroup
              value={coupon.discount?.type}
              onValueChange={(value) => setCoupon({ 
                ...coupon, 
                discount: { 
                  type: value as "PERCENTAGE" | "FIXED", 
                  value: coupon.discount?.value ?? 0 // Default to 0 if undefined
                } 
              })}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-1">
                <Label htmlFor="percentage">نسبة مئوية</Label>
                <RadioGroupItem value="PERCENTAGE" id="percentage" />
              </div>
              <div className="flex items-center space-x-1 ">
                <Label htmlFor="fixed">مبلغ ثابت</Label>
                <RadioGroupItem value="FIXED" id="fixed" />
              </div>
            </RadioGroup>
            <Label className="ml-2">نوع الخصم</Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple-700"
            disabled={addCouponMutation.isPending || updateCouponMutation.isPending}
          >
            {isEditing ? (
              updateCouponMutation.isPending ? "تحديث..." : "تحديث الكوبون"
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {addCouponMutation.isPending ? "إضافة..." : "إضافة كوبون"}
              </>
            )}
          </Button>
        </form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الخصم</TableHead>
              <TableHead className="text-right">الرمز</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.data.coupons.map((coupon: Coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>
                  {coupon.discount.type === "PERCENTAGE"
                    ? `${coupon.discount.value}%`
                    : `${coupon.discount.value} SAR`}
                </TableCell>
                <TableCell>{coupon.code}</TableCell>
                <TableCell className="flex items-center justify-end">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(coupon._id)}
                      disabled={deleteCouponMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AlertDialog open={!!couponToDelete} onOpenChange={handleCancelDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد أنك تريد حذف هذا الكوبون؟ هذه العملية لا يمكن التراجع عنها.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-purple hover:bg-purple-700" onClick={handleConfirmDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
