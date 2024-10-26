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
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, CalendarIcon, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import { toast } from "@/hooks/use-toast";

async function getCoupons() {
  const { data } = await axiosInstance.get("/coupons");
  return data;
}

async function addCoupon(couponData: { code: string; discount: {type:string; value:number}; expiryDate: Date }) {
  try {
    const { data } = await axiosInstance.post("/coupons", couponData);
    return data;
  } catch (error) {
    console.log("Error adding coupon:", error);
  }
}

async function deleteCoupon(couponId: string) {
  try {
    const { data } = await axiosInstance.delete(`/coupons/${couponId}`);
    return data;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
}

function CuponPage() {
  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">(
    "PERCENTAGE"
  );
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

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
        title: "نجاح", // عنوان الإشعار
        description: "تم الإضافة بنجاح", // الرسالة التي سيتم عرضها
        duration: 3000, // المدة بالميلي ثانية
      });

      
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      console.log("coupons success");
      setCouponCode("");
      setDiscountValue(""); // Changed from setCouponDiscount to setDiscountValue
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      ("Coupon deleted successfully");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!expiryDate) return; // Ensure expiryDate is set
    addCouponMutation.mutate({
      code: couponCode,
      discount: {
        type: discountType,
        value: Number(discountValue),
      },
      expiryDate: expiryDate,
    });
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>الكوبونات</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4 space-y-6">
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
                      !expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : <span>اختر تاريخ</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {discountType === "PERCENTAGE"
                  ? "نسبة الخصم (%)"
                  : "قيمة الخصم (SAR)"}
              </Label>
              <Input
                id="discountValue"
                name="discountValue"
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>
            <div className="space-y-2 order-first md:order-last">
              <Label htmlFor="couponCode">رمز الكوبون</Label>
              <Input
                id="couponCode"
                name="code"
                required
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y flex items-center justify-end">
           
            <RadioGroup
              value={discountType}
              onValueChange={(value) =>
                setDiscountType(value as "PERCENTAGE" | "FIXED")
              }
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-1">
                <Label htmlFor="percentage">نسبة مئوية</Label>
                <RadioGroupItem value="PERCENTAGE" id="percentage" />
              </div>
              <div className="flex items-center space-x-1 ">
                <Label htmlFor="fixed">قيمة ثابتة</Label>
                <RadioGroupItem value="FIXED" id="fixed" />
              </div>
            </RadioGroup>
            <Label className="ml-2 ">نوع الخصم</Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple-700"
            disabled={addCouponMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            {addCouponMutation.isPending ? "جاري الإضافة..." : "إضافة كوبون"}
          </Button>
        </form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">نسبة الخصم</TableHead>
              <TableHead className="text-right">الرمز</TableHead>
              <TableHead className="text-right">حذف</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.data.coupons.map((coupon: any) => (
              <TableRow key={coupon._id}>
                <TableCell>
                  {coupon.discount.type === "PERCENTAGE"
                    ? `${coupon.discount.value}%`
                    : `${coupon.discount.value} SAR`}
                </TableCell>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(coupon._id)}
                    disabled={deleteCouponMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                هل أنت متأكد أنك تريد حذف هذا الكوبون؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>إلغاء</AlertDialogCancel>
              <AlertDialogAction className="bg-purple hover:bg-purple-700" onClick={handleConfirmDelete}>حذف</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export default CuponPage;
