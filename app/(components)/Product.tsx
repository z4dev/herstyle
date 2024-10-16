import Image from 'next/image';
import { ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';

interface ProductProps {
  image: string;
  title: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discount: number;
}

const Product: React.FC<ProductProps> = ({ image, title, rating, reviewCount, price, originalPrice, discount }) => {
  return (

    <div className="bg-white  rounded-lg shadow-md">
      <div className="relative mb-4">
        <Image src={image} alt={title} width={200} height={200} className="object-cover h-[300px] w-full rounded-t-lg" />
      </div>
      <div className='p-4'>
      <Link href={`/shop/${title}`} className='hover:text-purple hover:underline'>
      <h3 className="font-bold text-lg mb-2 text-right">{title}</h3>
      </Link>
      <div className="flex items-center justify-end mb-2">
        <span className="text-sm text-gray-600 mr-1">({reviewCount ? reviewCount : '0'})</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          ))}
        </div>
      </div>
      <div className="flex flex-col-reverse  items-end">
        <button className="mt-3 border-2 flex items-center border-purple text-purple px-4 py-2 rounded-lg hover:bg-purple hover:text-white  transition duration-300">
          <p>إضافة للسلة</p>   <ShoppingBag className='ml-2' />
        </button>
        <div className="text-right">
          <p className="text-purple font-bold">{price.toFixed(2)} ر.س</p>
           <div className='flex items-center'>
          <p className="text-red text-sm mr-2">{Math.floor((price/originalPrice)*100)}%</p>
          <p className="text-gray-500 line-through text-sm">{originalPrice.toFixed(2)} ر.س</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Product;