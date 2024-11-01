import React from "react";
import Product from "@/app/(components)/Product";
import { Button } from "@/components/ui/button";
import ProductSkelton from "@/app/(components)/ProductSkelton";

function ProductGrid({
  products,
  packages,
  isLoading,
  loadMore,
  hasMore,
  isFetchingNext,
}: {
  products: any;
  packages: any;
  isLoading: boolean;
  loadMore: () => void;
  hasMore: boolean;
  isFetchingNext: boolean;
}) {
  return (
    <div className="min-h-screen w-full">
      <div className="product-grid w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 p-6 justify-items-center">
      {isLoading ? (
          Array(6).fill(null).map((_, index) => (
            <ProductSkelton key={index} isLoading={isLoading} />
          ))
        ) : (
          <>
            {products?.map((product: any) => (
              <Product
                key={product._id}
                className="w-[250px]"
                id={`/product/${product._id}`}
                image={product.images[0]}
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
              image={el.images[0]}
              title={el.name}
              rating={el.rating}
              reviewCount={el.numReviews}
              price={el.price.finalPrice}
              originalPrice={el.price.originalPrice}
              discount={el.price.discount}
            />
          ))}
      </div>
      {hasMore && (
        <div className=" my-2 flex justify-center items-center w-full">
          <Button className="bg-purple hover:bg-white hover:text-purple hover:border-purple border-2 border-purple text-white" onClick={loadMore} disabled={isFetchingNext}>
            تحميل المزيد
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
