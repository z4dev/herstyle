'use client'

import React, { useState } from 'react'
import { Plus, Trash, X, Edit } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import axiosInstance from '@/utils/axiosInstance'
import { CldUploadButton } from 'next-cloudinary'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'

type Package = {
  _id: string;
  name: string;
  price: {
    originalPrice: number;
    finalPrice: number;
  };
  images: string[];
  availableQuantity: number;
  tags: string[]; // Add tags to Package type
  description: string; // Add description to Package type
};

function PackagePage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [formData, setFormData] = useState<Partial<Package>>({
    name: '',
    price: { originalPrice: 0, finalPrice: 0 },
    availableQuantity: 0,
    images: [],
    tags: [], // Add tags to formData
    description: '', // Add description to formData
  })
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const formRef = React.useRef<HTMLFormElement | null>(null); // Create a ref for the form

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: async () => {
      const response = await axiosInstance.get('/packages')
      return response.data.data.packages as Package[]
    },
  })

  const createPackageMutation = useMutation({
    mutationFn: (newPackage: Partial<Package>) => axiosInstance.post('/packages', newPackage),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إضافة الحزمة بنجاح",
        duration: 3000,
      })
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] })
      resetForm()
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة الحزمة",
        variant: "destructive",
        duration: 3000,
      })
    },
  })

  const updatePackageMutation = useMutation({
    mutationFn: (updatedPackage: Package) => axiosInstance.put(`/packages/${updatedPackage._id}`, updatedPackage),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم تحديث الحزمة بنجاح",
        duration: 3000,
      })
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] })
      resetForm()
      setIsEditing(false)
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الحزمة",
        variant: "destructive",
        duration: 3000,
      })
    },
  })

  const deletePackageMutation = useMutation({
    mutationFn: (packageId: string) => axiosInstance.delete(`/packages/${packageId}`),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم حذف الحزمة بنجاح",
        duration: 3000,
      })
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] })
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف الحزمة",
        variant: "destructive",
        duration: 3000,
      })
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedValue = 
        name === 'originalPrice' || name === 'finalPrice'
          ? { ...prev.price, [name]: Number(value) || 0 } // Ensure a number is always set
          : name === 'tags'
          ? value.split(',').map(tag => tag.trim()) // Handle tags input
          : ['quantity', 'availableQuantity'].includes(name)
          ? Number(value)
          : value;

      return {
        ...prev,
        [name]: updatedValue,
        ...(name === 'originalPrice' || name === 'finalPrice' ? { price: { originalPrice: prev.price?.originalPrice || 0, finalPrice: prev.price?.finalPrice || 0, [name]: Number(value) || 0 } } : {}),
        ...(name === 'description' ? { description: value } : {}) // Handle description input
      };
    });
  }

  const handleUploadSuccess = (result: any) => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), result.info.secure_url]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const packageData = {
      ...formData,
      price: {
        originalPrice: formData.price?.originalPrice || 0,
        finalPrice: formData.price?.finalPrice || 0
      },
      images: formData.images?.filter(img => img !== '') || []
    }
    if (isEditing) {
      updatePackageMutation.mutate(packageData as Package)
    } else {
      createPackageMutation.mutate(packageData)
    }
  }

  const handleEditClick = (pkg: Package) => {
    setFormData(pkg);
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll to the form
  };

  const handleDeleteClick = (id: string) => {
    setPackageToDelete(id)
  }

  const handleConfirmDelete = () => {
    if (packageToDelete) {
      deletePackageMutation.mutate(packageToDelete)
      setPackageToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setPackageToDelete(null)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: { originalPrice: 0, finalPrice: 0 },
      availableQuantity: 0,
      images: [],
      tags: [], // Add tags to formData
      description: '', // Add description to formData
    })
    setIsEditing(false)
  }

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">
          الحزم
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <div>
              <Label htmlFor="originalPrice" className="text-sm font-medium text-gray-700 mb-1">
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
            <div className='order-first lg:order-none'>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                اسم الحزمة
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label htmlFor="finalPrice" className="text-sm font-medium text-gray-700 mb-1">
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
              <Label htmlFor="availableQuantity" className="text-sm font-medium text-gray-700 mb-1">
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
            <div className='lg:col-span-2'>
              <Label htmlFor="tags" className="text-sm font-medium text-gray-700 mb-1">
                العلامات (مفصولة بفواصل)
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags?.join(', ')}
                onChange={handleInputChange}
                className="w-full text-right"
                dir="rtl"
              />
            </div>
            <div className='lg:col-span-2'>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">
                وصف الحزمة
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full h-24 text-right"
                dir="rtl"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="images" className="text-lg font-semibold">صور الحزمة</Label>
            <div className="mt-2 flex flex-wrap gap-4 justify-end">
              {formData.images?.map((image, index) => (
                <div key={index} className="relative group">
                  <img src={image} alt={`Uploaded ${index + 1}`} className="w-32 h-32 object-cover rounded-lg shadow-md" />
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
            disabled={createPackageMutation.isPending || updatePackageMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" /> 
            {isEditing
              ? (updatePackageMutation.isPending ? 'تحديث...' : 'تحديث الحزمة')
              : (createPackageMutation.isPending ? 'إضافة...' : 'إضافة حزمة')}
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            الحزم الحالية
          </h3>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading data</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الصورة</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">السعر الأصلي</TableHead>
                    <TableHead className="text-right">السعر النهائي</TableHead>
                    <TableHead className="text-right">الكمية المتاحة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((pkg) => (
                    <TableRow key={pkg._id}>
                      <TableCell className='flex items-center justify-end'>
                        <img
                          src={pkg.images[0] || '/placeholder-image.jpg'}
                          alt={pkg.name}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell>{pkg.price.originalPrice}</TableCell>
                      <TableCell>{pkg.price.finalPrice}</TableCell>
                      <TableCell>{pkg.availableQuantity}</TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEditClick(pkg)}
                            disabled={updatePackageMutation.isPending}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteClick(pkg._id)}
                            disabled={deletePackageMutation.isPending}
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

        <AlertDialog open={!!packageToDelete} onOpenChange={handleCancelDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد أنك تريد حذف هذه الحزمة؟ هذه العملية لا يمكن التراجع عنها.
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
  )
}

export default PackagePage
