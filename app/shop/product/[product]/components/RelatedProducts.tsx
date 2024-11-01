import { toast } from '@/hooks/use-toast';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const addToCartMutation = async (productId: string) => {
const response = await axiosInstance.post(
  `cart/add-product/${productId}`,
  { quantity: 1 }
);
return response.data;
};

function RelatedProducts({data}:{data:any}) {

  const queryClient = useQueryClient()


  const mutation = useMutation({
    mutationFn: (productId: string) => addToCartMutation(productId),
    onSuccess: () => {

      toast({
        title: "نجاح",
        description: "تم إضافة العنصر إلى السلة",
        // يمكنك إضافة المزيد من الخصائص هنا إذا لزم الأمر
      });
      
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log(" item added to cart successfully")
    },
    onError: (error) => {
      console.error('Error adding product to cart:', error);
      // Handle error (e.g., show an error message to the user)
    },
  });


  const handleAddToCart = (id: string) => {
    mutation.mutate(id);
  };



  return (
    <div className="space-y-6">
    {data.map((item:any, index:number) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-row-reverse items-start md:items-center">
        <div className="relative  w-1/3   md:w-1/4 h-[175px]">
          <Image
            src={item.images[0]}
            alt={`Related product ${index}`}
            layout="fill"
            className="rounded-lg w-full h-full"
          />
        </div>
        <div className="w-4/5 pr-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
             <span className="font-bold text-lg text-purple">{item.price.finalPrice} ر.س</span>
             <div className='flex md:flex-row flex-col-reverse items-end md:items-center'>
            <div className="flex items-center mr-2">
                <span className="text-sm text-gray-600 mr-2">(25)</span>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <h3 className="text-lg font-semibold text-right">{item.name}</h3>
            </div>
          </div>
          <p className="text-right text-sm text-gray-600 mb-4">
           {item.description}
          </p>
          <div className="flex justify-end items-center">
          <button 
          onClick={()=>handleAddToCart(item._id)}
          disabled={mutation.isPending} 
          className=" hidden mt-3 border-2 md:flex items-center border-purple text-purple px-4 py-2 rounded-lg hover:bg-purple hover:text-white transition duration-300 disabled:opacity-50"
        >
          <p>{mutation.isPending ? 'جاري الإضافة...' : 'إضافة للسلة'}</p>
          <ShoppingBag className='ml-2' />
        </button>
            
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}

export default RelatedProducts