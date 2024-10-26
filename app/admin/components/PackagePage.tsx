import React, { useState } from 'react'
import { Plus, Trash, X } from 'lucide-react'
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
import { toast } from '@/hooks/use-toast'

// Add this type definition
type Package = {
  _id: string;
  name: string;
  price: {
    originalPrice: number;
    finalPrice: number;
  };
  images: string[];
  availableQuantity: number;
};

function PackagePage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    finalPrice: '',
    availableQuantity: '',
    images: [] as string[]
  })
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-packages'],
    queryFn: async () => {
      const response = await axiosInstance.get('/packages')
      return response.data.data.packages as Package[]
    },
  })

  const createPackageMutation:any = useMutation({
    mutationFn: (newPackage: any) => axiosInstance.post('/packages', newPackage),
    onSuccess: () => {

      toast({
        title: "نجاح", // عنوان الإشعار
        description: "تم الإضافة بنجاح", // الرسالة التي سيتم عرضها
        duration: 3000, // المدة بالميلي ثانية
      });

      queryClient.invalidateQueries({ queryKey: ['admin-packages'] })
      // Reset form after successful submission
      setFormData({
        name: '',
        originalPrice: '',
        finalPrice: '',
        availableQuantity: '',
        images: [] as string[]
      })
      console.log("package added")
    },
  })

  const deletePackageMutation:any = useMutation({
    mutationFn: (packageId: string) => axiosInstance.delete(`/packages/${packageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-packages'] })
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUploadSuccess = (result: any) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, result.info.secure_url]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const packageData = {
      name: formData.name,
      price: {
        originalPrice: Number(formData.originalPrice),
        finalPrice: Number(formData.finalPrice)
      },
      availableQuantity: Number(formData.availableQuantity),
      images: formData.images.filter(img => img !== '') // Remove empty strings
    }
    createPackageMutation.mutate(packageData)
  }

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

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">
          الحزم
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <Label htmlFor="originalPrice" className="text-sm font-medium text-gray-700 mb-1">
                السعر الأصلي
              </Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                اسم الحزمة
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full"
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
                value={formData.finalPrice}
                onChange={handleInputChange}
                required
                className="w-full"
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
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="images" className="text-lg font-semibold">صور الحزمة</Label>
            <div className="mt-2 flex flex-wrap gap-4 justify-end">
              {formData.images.map((image, index) => (
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
            disabled={createPackageMutation.isLoading}
          >
            <Plus className="w-4 h-4 mr-2" /> 
            {createPackageMutation.isLoading ? 'جاري الإضافة...' : 'إضافة حزمة'}
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            الحزم الحالية
          </h3>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            {isLoading ? (
              <p>جاري التحميل...</p>
            ) : error ? (
              <p>حدث خطأ أثناء تحميل البيانات</p>
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
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteClick(pkg._id)}
                          disabled={deletePackageMutation.isLoading}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
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
                هل أنت متأكد أنك تريد حذف هذه الحزمة؟ لا يمكن التراجع عن هذا الإجراء.
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
