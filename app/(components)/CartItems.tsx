import { Button } from '@/components/ui/button'
import React from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/utils/axiosInstance';






function CartItems({id,price,name,quantity,onDelete,stateOfDeleting,type,image}:{id:string,price:number,name:string,quantity:number,onDelete:()=>void,stateOfDeleting:boolean,type:string , image:string}) {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    async function updatePackageQuantity(id: any, type: string, newQuantity: number) {
      try {
        const response = await axiosInstance.put(`cart/update-${type}/${id._id}`, {
          quantity: newQuantity
        });
        return response.data;
      } catch (error) {
      }
    }

    const updateMutation = useMutation({
        mutationFn: ({ id, type, newQuantity }: { id: string, type: string, newQuantity: number }) => 
            updatePackageQuantity(id, type, newQuantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const arrayOfName = name.split(' ');

  return (
    <div className={`flex items-center space-x-4 mb-4 w-full ${stateOfDeleting ? 'opacity-50' : ''}`}>
        <p className="text-sm text-muted-foreground  mr-auto mb-auto">
            <span className="text-nowrap text-xs"> الإجمالي:{(quantity*price).toFixed(2)}ر.س</span></p>
    <div className="flex flex-col items-end text-right justify-between w-fit">
      <h3 className="font-medium">{arrayOfName[0]&&arrayOfName[0]} {arrayOfName[1]&&arrayOfName[1]}</h3>
      <p className="text-sm text-muted-foreground">{price.toFixed(2)} ريس</p>
      <div className="flex items-start justify-start space-x-1">
        <div className="flex mt-2">
          <Button
            variant="outline"
            size="sm"
            className=" h-6 w-6 rounded-r-none border-r-0"
            onClick={() => updateMutation.mutate({ id, type, newQuantity: quantity - 1 })}
            disabled={updateMutation.isPending || quantity <= 1}
          >
            -
          </Button>
          <div className="flex items-center justify-center h-6 w-6 border-y border-input px-2">
            {quantity}
          </div>
          <Button
            variant="outline"
            size="sm"
            className=" h-6 w-6 rounded-l-none border-l-0"
            onClick={() => updateMutation.mutate({ id, type, newQuantity: quantity + 1 })}
            disabled={updateMutation.isPending}
          >
            +
          </Button>
        </div>
      </div>
    </div>
    <div className="relative">
      <Image
        src={image}
        width={100}
        height={100}
        alt="Product"
        className=" min-w-16 w-16 h-16 object-cover"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-4 -right-0 h-6 w-6 p-0 bg-purple text-white hover:bg-white hover:text-purple"
      >
        <X onClick={onDelete} className="h-4 w-4" />
      </Button>
    </div>
  </div>
  )
}

export default CartItems
