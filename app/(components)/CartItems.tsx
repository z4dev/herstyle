import { Button } from '@/components/ui/button'
import React from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useDispatch } from 'react-redux';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/utils/cart';

function CartItems({id,price,name,quantity}:{id:string,price:number,name:string,quantity:number}) {
    const dispatch = useDispatch();

  return (
    <div className="flex items-center space-x-4 mb-4 w-full ">
        <p className="text-sm text-muted-foreground  mr-auto mb-auto">total:
            <span className="text-nowrap">{(quantity*price).toFixed(2)} ريس</span></p>
    <div className="flex flex-col items-end text-right justify-between w-fit">
      <h3 className="font-medium">{name}</h3>
      <p className="text-sm text-muted-foreground">{price.toFixed(2)} ريس</p>
      <div className="flex items-start justify-start space-x-1">
        <div className="flex mt-2">
          <Button
            variant="outline"
            size="sm"
            className=" h-6 w-6 rounded-r-none border-r-0"
            onClick={()=>{quantity>1 && dispatch(decreaseQuantity({id,price}))}}
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
            onClick={()=>{dispatch(increaseQuantity({id,price}))}}  
          >
            +
          </Button>
        </div>
      </div>
    </div>
    <div className="relative">
      <Image
        src="/products/1.jpg"
        width={100}
        height={100}
        alt="Product"
        className=" min-w-16 w-16 h-16 object-cover"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-purple text-white hover:bg-white hover:text-purple"
      >
        <X onClick={()=>{dispatch(removeFromCart({id,price,quantity}))}} className="h-4 w-4" />
      </Button>
    </div>
  </div>
  )
}

export default CartItems