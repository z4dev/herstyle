import { toast } from '@/hooks/use-toast';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';
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
      <div key={index} className="bg-white rounded-lg shadow-md p-4 flex  flex-col sm:flex-row-reverse items-start md:items-center">
        <div className="relative  w-full sm:w-1/2 lg:w-1/4  h-[400px] sm:h-[310px] ">
         <Link href={`/shop/product/${item._id}`}>
          <Image
            src={item.images[0]}
            alt={`Related product ${index}`}
            layout="fill"
            className="rounded-lg w-full h-full"
          />
          </Link>
        </div>
        <div className="mt-4 sm:w-1/2 sm:px-2 lg:mt-0 lg:w-4/5 lg:pr-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
             <span className="font-bold text-lg text-purple">{item.price.finalPrice} ر.س</span>
             <div className='flex md:flex-row flex-col-reverse items-end md:items-center'>
            <div className="flex flex-row-reverse items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i}  className={`w-4 h-4 ${i < item.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <Link href={`/shop/product/${item._id}`}>
            <h3 className="text-lg font-semibold text-right">{item.name}</h3>
            </Link>
            </div>
          </div>
          <p className="text-right text-sm text-gray-600 mb-4" dir='rtl'>
          {item.description.length > 350 ? `${item.description.slice(0, 350)}...` : item.description}
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