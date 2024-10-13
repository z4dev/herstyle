import React from 'react'
import FilterSection from './component/FilterSection'
import ProductGrid from './component/ProductGrid'

function page() {
  return (
    <div className="shop-container">
      <div className="shop-header">
        
      </div>
      <div className="shop-content flex">
        <ProductGrid />
        <FilterSection />
      </div>
    </div>
  )
}

export default page