import React from "react";
import Product from "@/app/(components)/Product";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "منتج ماسك انزيم",
    rating: 4.5,
    numReviews: 120,
    price: {
      finalPrice: 102.0,
      originalPrice: 120.0,
      discount: 15,
    },
    image: "/products/1.jpg",
  },
  {
    id: 2,
    name: "مجموعة بروتين رابيد",
    rating: 5,
    numReviews: 89,
    price: {
      finalPrice: 150.0,
      originalPrice: 180.0,
      discount: 17,
    },
    image: "/products/2.jpg",
  },
  {
    id: 3,
    name: "منتج سيروم وتر",
    rating: 4.8,
    numReviews: 256,
    price: {
      finalPrice: 85.0,
      originalPrice: 100.0,
      discount: 15,
    },
    image: "/products/3.jpg",
  },
  {
    id: 4,
    name: "كريم مرطب للبشرة",
    rating: 4.2,
    numReviews: 78,
    price: {
      finalPrice: 65.0,
      originalPrice: 75.0,
      discount: 13,
    },
    image: "/products/4.jpg",
  },
  {
    id: 5,
    name: "غسول للوجه منظف",
    rating: 4.7,
    numReviews: 183,
    price: {
      finalPrice: 45.0,
      originalPrice: 50.0,
      discount: 10,
    },
    image: "/products/1.jpg",
  },
  // Add more products as needed
];

function ProductGrid() {
  return (
    <div className="w-full">
      <div className="shop-actions p-4 w-full flex justify-end gap-4">
        <Button className="bg-white text-purple hover:bg-purple hover:text-white border-2 border-purple">
          الأكثر طلبا
        </Button>
        <Button className="bg-purple hover:bg-white hover:text-purple hover:border-purple border-2 border-purple text-white">
          الأحدث{" "}
        </Button>
      </div>

      <div className="product-grid w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 p-6">
        {products.map((product) => (
          <Product
            key={product.id}
            image={product.image}
            title={product.name}
            rating={product.rating}
            reviewCount={product.numReviews}
            price={product.price.finalPrice}
            originalPrice={product.price.originalPrice}
            discount={product.price.discount}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
