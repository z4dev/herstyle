"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash, X, Edit, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import axiosInstance from "@/utils/axiosInstance";
import { CldUploadButton } from "next-cloudinary";
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
import axios from "axios";

type Product = {
  _id: string;
  name: string;
  description: string;
  images: string[];
  availableQuantity: number;
  price: {
    originalPrice: number;
    finalPrice: number;
  };
  quantity: number;
  tags: string[];
  packageId?: string;
  packageName?: string;
};

type Package = {
  _id: string;
  name: string;
  price: {
    originalPrice: number;
    finalPrice: number;
  };
};

function Productpage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Product>>({
    _id: "",
    name: "",
    description: "",
    images: [],
    availableQuantity: 0,
    price: { originalPrice: 0, finalPrice: 0 },
    quantity: 0,
    tags: [],
    packageId: "undefined",
    packageName: "",
  });
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const response = await axiosInstance.get("/products");
      return response.data.data.products as Product[];
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowRecommendations(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true);
      setShowRecommendations(true);
      const delayDebounceFn = setTimeout(() => {
        fetchPackages();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setPackages([]);
      setShowRecommendations(false);
    }
  }, [searchTerm]);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(
        "https://api.her-style.com/api/v1/packages"
      );
      const filteredPackages = response.data.data.packages.filter(
        (pkg: Package) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPackages(filteredPackages);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProductMutation = useMutation({
    mutationFn: (newProduct: any) =>
      axiosInstance.post("/products", newProduct),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إضافة المنتج بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      resetForm();
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة المنتج",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: (updatedProduct: Product) =>
      axiosInstance.put(`/products/${updatedProduct._id}`, updatedProduct),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم تحديث المنتج بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      resetForm();
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث المنتج",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) =>
      axiosInstance.delete(`/products/${productId}`),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم حذف المنتج بنجاح",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف المنتج",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedValue =
        name === "originalPrice" || name === "finalPrice"
          ? { ...prev.price, [name]: Number(value) || 0 }
          : name === "tags"
          ? value.split(",").map((tag) => tag.trim())
          : ["quantity", "availableQuantity"].includes(name)
          ? Number(value)
          : value;

      return {
        ...prev,
        [name]: updatedValue,
        ...(name === "originalPrice" || name === "finalPrice"
          ? {
              price: {
                originalPrice: prev.price?.originalPrice || 0,
                finalPrice: prev.price?.finalPrice || 0,
                [name]: Number(value) || 0,
              },
            }
          : {}),
      };
    });
  };

  const handleUploadSuccess = (result: any) => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), result.info.secure_url],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const productData: any = {
      name: formData.name,
      description: formData.description,
      images: formData.images?.filter((img) => img !== "") || [],
      availableQuantity: formData.availableQuantity,
      price: {
        originalPrice: formData.price?.originalPrice || 0,
        finalPrice: formData.price?.finalPrice || 0,
      },
      quantity: formData.quantity,
      tags: formData.tags,
    };
    if (isEditing) {
      if (formData.packageId !== "undefined")
        productData.packageId = formData.packageId;
      if (formData.packageId !== "undefined" && searchTerm == "")
        productData.packageId = "undefined";
      updateProductMutation.mutate({
        ...productData,
        _id: formData._id,
      } as Product);
    } else {
      createProductMutation.mutate({
        ...productData,
      });
    }
  };

  const handleEditClick = (product: Product) => {
    setFormData(product);
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setProductToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      images: [],
      availableQuantity: 0,
      price: { originalPrice: 0, finalPrice: 0 },
      quantity: 0,
      tags: [],
      packageId: "undefined",
    });
    setIsEditing(false);
  };

  const handlePackageSelect = (packageId: string, packageName: string) => {
    setFormData((prev) => ({ ...prev, packageId }));
    setSearchTerm(packageName);
    setShowRecommendations(false);
  };

  const handleDeletepackageId = (e: any) => {
    e.preventDefault();
    setSearchTerm("");
    setFormData((prev) => ({ ...prev, packageId: "undefined" }));
  };

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">
          إدارة المنتجات
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid  lg:grid-cols-3 gap-6 ">
            <div className="relative" ref={searchRef}>
              <Label
                htmlFor="packageSearch"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                البحث عن الباقة
              </Label>
              <div className="flex items-center">
                <Input
                  id="packageSearch"
                  type="text"
                  placeholder="ابحث عن الباقات..."
                  value={searchTerm}
                  dir="rtl"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-right"
                  onClick={() => {
                    if (packages.length > 0) {
                      setSearchTerm(packages[0].name);
                    }
                  }}
                  
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2"
                    onClick={handleDeletepackageId}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {showRecommendations && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : packages.length > 0 ? (
                    packages.map((pkg) => (
                      <div
                        key={pkg._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handlePackageSelect(pkg._id, pkg.name)}
                      >
                        {pkg.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">
                      لم يتم العثور على باقات
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label
                htmlFor="originalPrice"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                السعر الأصلي
              </Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                value={formData.price?.originalPrice}
                onChange={handleInputChange}
                required
                className="w-full text-right"
              />
            </div>
            <div className="order-first lg:order-none">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                اسم المنتج
              </Label>
              <Input
                id="name"
                name="name"
                dir="rtl"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full text-right"
              />
            </div>
            <div>
              <Label
                htmlFor="finalPrice"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                السعر النهائي
              </Label>
              <Input
                id="finalPrice"
                name="finalPrice"
                type="number"
                value={formData.price?.finalPrice}
                onChange={handleInputChange}
                required
                className="w-full text-right"
              />
            </div>

            <div>
              <Label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                الكمية
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="w-full text-right"
              />
            </div>
            <div>
              <Label
                htmlFor="availableQuantity"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                الكمية المتاحة
              </Label>
              <Input
                id="availableQuantity"
                name="availableQuantity"
                type="number"
                value={formData.availableQuantity}
                onChange={handleInputChange}
                required
                className="w-full text-right"
              />
            </div>
            <div className="lg:col-span-3">
              <Label
                htmlFor="tags"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                العلامات (مفصولة بفواصل)
              </Label>
              <Input
                id="tags"
                name="tags"
                dir="rtl"
                value={formData.tags?.join(", ")}
                onChange={handleInputChange}
                className="w-full text-right"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              وصف المنتج
            </Label>
            <Textarea
              id="description"
               dir="rtl"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full h-24 text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images" className="text-lg font-semibold">
              صور المنتج
            </Label>
            <div className="mt-2 flex flex-wrap gap-4 justify-end">
              {formData.images?.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <CldUploadButton
                uploadPreset="ml_default"
                onSuccess={handleUploadSuccess}
                className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Plus size={24} />
              </CldUploadButton>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple-700 text-white"
            disabled={
              createProductMutation.isPending || updateProductMutation.isPending
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            {isEditing
              ? updateProductMutation.isPending
                ? "تحديث..."
                : "تحديث المنتج"
              : createProductMutation.isPending
              ? "إضافة..."
              : "إضافة منتج"}
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            المنتجات الحالية
          </h3>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            {productsLoading ? (
              <p>جاري التحميل...</p>
            ) : productsError ? (
              <p>حدث خطأ أثناء تحميل البيانات</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الصورة</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">السعر النهائي</TableHead>
                    <TableHead className="text-right">الكمية المتاحة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="flex items-center justify-end">
                        <img
                          src={product.images[0] || "/placeholder-image.jpg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.price.finalPrice} ريال</TableCell>
                      <TableCell>{product.availableQuantity}</TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEditClick(product)}
                            disabled={updateProductMutation.isPending}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteClick(product._id)}
                            disabled={deleteProductMutation.isPending}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <AlertDialog open={!!productToDelete} onOpenChange={handleCancelDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد أنك تريد حذف هذا المنتج؟ هذه العملية لا يمكن
                التراجع عنها.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-purple hover:bg-purple-700"
                onClick={handleConfirmDelete}
              >
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

export default Productpage;
