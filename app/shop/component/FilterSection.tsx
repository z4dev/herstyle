import React from 'react'
import { Star, ChevronDown, Filter } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

function FilterSection({filter, onlyPackages, onlyProducts, priceRange, handleRatingFilter}:{filter:any, onlyPackages:()=>void, onlyProducts:()=>void, priceRange:(min: number, max: number) => void, handleRatingFilter:(rating:number)=>void}) {
  return (
    <div className="filter-section w-64 bg-white p-4 rounded-lg shadow">
        <div className='flex items-center justify-end text-purple mb-4'>
      <h2 className="text-xl font-bold  text-right">الفلترة</h2>
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
            <div className="space-y-2">
              <div className="flex items-center justify-end space-x-2 ">
                <Label htmlFor="category-1">بكجات</Label>
                <Checkbox id="category-1"  onClick={onlyPackages} />
              </div>
              <div className="flex items-center justify-end space-x-2 ">
                <Label htmlFor="category-2">منتج</Label>
                <Checkbox id="category-2"  onClick={onlyProducts} />
              </div>
              {/* Add more categories as needed */}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-right">السعر</AccordionTrigger>
          <AccordionContent>
            <RadioGroup defaultValue="50-60">
              <div className="flex items-center justify-end space-x-2  mb-2">
                <Label htmlFor="price-1">يبدأ من 50 إلى 60 ريال</Label>
                <RadioGroupItem onClick={()=>priceRange(50,60)} value="50-60" id="price-1" />
              </div>
              <div className="flex items-center justify-end space-x-2  mb-2">
                <Label htmlFor="price-2">يبدأ من 70 إلى 80 ريال</Label>
                <RadioGroupItem onClick={()=>priceRange(70,80)} value="70-80" id="price-2" />
              </div>
              <div className="flex items-center justify-end space-x-2  mb-2">
                <Label htmlFor="price-3">يبدأ من 80 إلى 90 ريال</Label>
                <RadioGroupItem onClick={()=>priceRange(80,90)} value="80-90" id="price-3" />
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default FilterSection