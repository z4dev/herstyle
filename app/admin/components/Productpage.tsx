"use client";
import React, { useState, useCallback } from "react";
import { Plus, Trash, X, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/utils/axiosInstance";
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
import { CldUploadButton } from "next-cloudinary";

import { debounce } from "lodash";

// Function to fetch products
const fetchProducts = async () => {
  const { data } = await axiosInstance.get("products");
  return data.data.products;
};

const fetchRecommendations = async (term: string) => {
  if (!term.trim()) return { data: { packages: [] } }; // Return empty packages if no term

  const { data } = await axiosInstance.get(`packages?search=${term}`);

  // Assuming the response structure is as provided
  if (data.success) {
    return data.data.packages; // Return the packages directly
  } else {
    throw new Error("Failed to fetch recommendations");
  }
};

function Productpage() {
  const queryClient = useQueryClient();
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    images: [] as string[],
    availableQuantity: 0,
    price: {
      originalPrice: 0,
      finalPrice: 0,
    },
    quantity: 0,
    tags: [] as string[],
    packageId: "undefined",
  });
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Add state for editing

  const debouncedSetSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  async function adminAddProduct(newProduct: any) {
    try {
      const response = await axiosInstance.post("products", newProduct);
      return response.data;
    } catch (error) {
      console.log("Error adding product:", error);
      throw error;
    }
  }

  const addProductMutation: any = useMutation({
    mutationFn: adminAddProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setNewProduct({
        name: "",
        description: "",
        images: [],
        availableQuantity: 0,
        price: {
          originalPrice: 0,
          finalPrice: 0,
        },
        quantity: 0,
        tags: [] as string[],
        packageId:"undefined",
      });
      console.log("success");
    },
  });

  const updateProductMutation:any = useMutation({
    mutationFn: (updatedProduct: any) => axiosInstance.put(`/products/${updatedProduct._id}`, updatedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      resetForm(); // Reset form after successful update
      setIsEditing(false); // Reset editing state
    },
    onError: () => {
      console.log("Error updating product");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "originalPrice" || name === "finalPrice") {
      setNewProduct((prev) => ({
        ...prev,
        price: { ...prev.price, [name]: Number(value) },
      }));
    } else if (name === "tags") {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value.split(",").map((tag) => tag.trim()),
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: ["quantity", "availableQuantity"].includes(name)
          ? Number(value)
          : value,
      }));
    }
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProductMutation.mutate(newProduct);
  };

  const deleteProductMutation: any = useMutation({
    mutationFn: (productId: string) =>
      axiosInstance.delete(`products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

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

  const handleUploadSuccess = (result: any) => {
    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, result.info.secure_url],
    }));
  };

  const removeImage = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const fetchRecommendationsQuery = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: () => fetchRecommendations(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm.trim(), // Only run if there's a search term
  });

  const recommendations = fetchRecommendationsQuery.data || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowRecommendations(true);
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSetSearch(term);
  };

  const handleEditClick = (product: any) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      images: product.images,
      availableQuantity: product.availableQuantity,
      price: {
        originalPrice: product.price.originalPrice,
        finalPrice: product.price.finalPrice,
      },
      quantity: product.quantity,
      tags: product.tags,
      packageId: product.packageId,
    }); // Set the product data to the form
    setIsEditing(true); // Set editing state to true
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateProductMutation.mutate(newProduct); // Call update mutation if editing
    } else {
      addProductMutation.mutate(newProduct); // Call add mutation if not editing
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      images: [],
      availableQuantity: 0,
      price: {
        originalPrice: 0,
        finalPrice: 0,
      },
      quantity: 0,
      tags: [] as string[],
      packageId: "undefined",
    });
  };

  if (isLoading) return <div>جاري التحميل...</div>;
  if (isError) return <div>حدث خطأ أثناء تحميل المنتجات</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المنتجات</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">السعر الأصلي</Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                className="text-right"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalPrice">السعر النهائي</Label>
              <Input
                id="finalPrice"
                name="finalPrice"
                type="number"
                className="text-right"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">اسم المنتج</Label>
              <Input
                id="name"
                name="name"
                value={newProduct.name}
                className="text-right"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                className="text-right"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableQuantity">الكمية المتاحة</Label>
              <Input
                id="availableQuantity"
                name="availableQuantity"
                type="number"
                className="text-right"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">العلامات (مفصولة بفواصل)</Label>
              <Input
                id="tags"
                name="tags"
                value={newProduct.tags.join(", ")}
                className="text-right"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="relative w-full space-y-2 lg:col-span-3">
              <Label htmlFor="packageId">حزمة</Label>
              <Input
                type="text"
                placeholder="...البحث"
                className="py-1 lg:py-2 p-2 pr-10 pl-4 rounded-md text-black w-full   text-right"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm.trim() !== "" &&
                recommendations.length > 0 &&
                !fetchRecommendationsQuery.isLoading &&
                showRecommendations && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-purple rounded-md shadow-lg">
                    {recommendations.map(
                      (item: { _id: string; name: string }) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            setSearchTerm(item.name);
                            setNewProduct((prev) => ({
                              ...prev,
                              packageId: item._id,
                            }));
                            setShowRecommendations(false);
                          }}
                        >
                          <div className="p-2 hover:bg-gray-100 cursor-pointer text-right">
                            <div className="font-semibold">{item.name}</div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف المنتج</Label>
            <Textarea
              id="description"
              name="description"
              value={newProduct.description}
              className="text-right w-full h-24"
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">صور المنتج</Label>
            <div className="mt-2 flex justify-end flex-wrap gap-4">
              {newProduct.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <CldUploadButton
                uploadPreset="ml_default"
                onSuccess={handleUploadSuccess}
                className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Plus size={24} />
              </CldUploadButton>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple hover:bg-purple-700"
            disabled={addProductMutation.isLoading}
          >
            <Plus className="w-4 h-4 mr-2" />
            {addProductMutation.isLoading ? "جاري الإضافة..." : "إضافة منتج"}
          </Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الصورة</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">السعر</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products &&
              products.map((product: any) => (
                <TableRow key={product._id}>
                  <TableCell className="flex items-center justify-end">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price.finalPrice} ريال</TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEditClick(product)} // Add edit button
                        disabled={updateProductMutation.isLoading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteClick(product._id)}
                        disabled={deleteProductMutation.isLoading}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <AlertDialog open={!!productToDelete} onOpenChange={handleCancelDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد أنك تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا
                الإجراء.
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
