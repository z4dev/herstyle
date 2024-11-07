import React, { useState } from 'react'
import { Star, Filter } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Slider } from '@/components/ui/slider'

const FilterContent = ({ onlyPackages, onlyProducts, handlePriceFilter ,  handleRatingFilter}:{ onlyPackages:()=>void, handlePriceFilter: (min: number, max: number) => void, onlyProducts:()=>void,  handleRatingFilter:(rating:number)=>void}) => {
  const [priceRange, setPriceRange] = useState([0, 1000])
  
  return (
    <div className="filter-section bg-white p-4 rounded-lg shadow">
      <div className='flex items-center justify-end text-purple mb-4'>
        <h2 className="text-xl font-bold text-right">الفلترة</h2>
        <Filter />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="rating">
          <AccordionTrigger className="text-right">التقييم</AccordionTrigger>
          <AccordionContent>
            <RadioGroup defaultValue="5">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center justify-end space-x-1  mb-2">
                  <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 mr-2">
                    <p className='text-nowrap'> أكثر من {rating - 0.5} </p>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>
                    ))}
                  </Label>
                  <RadioGroupItem value={`${rating}`} id={`rating-${rating}`} onClick={()=>handleRatingFilter(rating)} />
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories">
          <AccordionTrigger className="text-right">التصنيفات</AccordionTrigger>
          <AccordionContent>
          <RadioGroup defaultValue="packages">
              <div className="flex items-center justify-end space-x-2 mb-2">
                <Label htmlFor="category-packages">بكجات</Label>
                <RadioGroupItem id="category-packages" value="packages" onClick={onlyProducts} />
              </div>
              <div className="flex items-center justify-end space-x-2 mb-2">
                <Label htmlFor="category-products">منتج</Label>
                <RadioGroupItem id="category-products" value="products" onClick={ onlyPackages } />
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
        <AccordionTrigger className="text-right">السعر</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 mt-2" >
              <Slider
                className=''
                defaultValue={[0, 1000]}
                max={1000}
                min={0}
                step={1}
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value)
                  handlePriceFilter(value[0], value[1])
                }}
              />
              <div className="flex justify-between items-center">
                <span>{priceRange[0]} ريال</span>
                <span>{priceRange[1]} ريال</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}


function MobileFilterSection({filter, onlyPackages, onlyProducts, handlePriceFilter, handleRatingFilter}:{filter:any, onlyPackages:()=>void, onlyProducts:()=>void, handlePriceFilter:(min: number, max: number) => void, handleRatingFilter:(rating:number)=>void}) {
  const [open, setOpen] = useState(false)

  return (
      <div className=" block lg:hidden">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              الفلترة
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <FilterContent  onlyPackages={onlyPackages} onlyProducts={onlyProducts} handlePriceFilter={handlePriceFilter} handleRatingFilter={handleRatingFilter} />
          </DrawerContent>
        </Drawer>
      </div>
  )
}

export default MobileFilterSection
