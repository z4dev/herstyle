import React from "react";
import Product from "@/app/(components)/Product";
import { Button } from "@/components/ui/button";
import ProductSkelton from "@/app/(components)/ProductSkelton";

function ProductGrid({
  products,
  packages,
  isLoading,
}: {
  products: any;
  packages: any;
  isLoading: boolean;
}) {
  return (
    <div className="w-full">
      <div className="shop-actions p-4 w-full flex justify-end gap-4">
        <Button className="bg-white text-purple hover:bg-purple hover:text-white border-2 border-purple">
          الأكثر طلبا
        </Button>
        <Button className="bg-purple hover:bg-white hover:text-purple hover:border-purple border-2 border-purple text-white">
          الأحدث
        </Button>
      </div>

      <div className="product-grid w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 p-6">
        {products
          ? products.map((product: any) => (
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
            ))
          : isLoading &&
            [...Array(4)].map((_, index) => (
              <ProductSkelton key={index} isLoading={isLoading} />
            ))}

        {packages &&
          packages.map((el: any) => (
            <Product
              key={el.id}
              image={el.image}
              title={el.name}
              rating={el.rating}
              reviewCount={el.numReviews}
              price={el.price.finalPrice}
              originalPrice={el.price.originalPrice}
              discount={el.price.discount}
            />
          ))}
      </div>
    </div>
  );
}

export default ProductGrid;
