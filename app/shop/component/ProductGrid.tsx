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
      <div className="product-grid w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 p-6">
      {isLoading ? (
          Array(6).fill(null).map((_, index) => (
            <ProductSkelton key={index} isLoading={isLoading} />
          ))
        ) : (
          <>
            {products?.map((product: any) => (
              <Product
                key={product._id}
                id={`/product/${product._id}`}
                image={product.image}
                title={product.name}
                rating={product.rating}
                reviewCount={product.numReviews}
                price={product.price.finalPrice}
                originalPrice={product.price.originalPrice}
                discount={product.price.discount}
              />
            ))}
          </>
        )}

        {packages &&
          packages.map((el: any) => (
            <Product
              key={el._id}
              id={`/package/${el._id}`}
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
