'use client'
import React from 'react'
import { Star, Filter } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"


function FilterSection({
  handleRatingFilter,
  handlePriceFilter,
  filter,
  onlyPackages,
  onlyProducts,
}: {
  filter:any,
  onlyPackages:()=>void,
  onlyProducts:()=>void,
  handleRatingFilter: (rating: number) => void,
  handlePriceFilter: (min: number, max: number) => void
}) {
  const [priceRange, setPriceRange] = React.useState([0, 1000])

  return (
    <div className="filter-section lg:block hidden lg:w-64 bg-white p-4 mt-6 rounded-lg h-fit shadow">
      <div className='flex items-center justify-end text-primary mb-4'>
        <h2 className="text-xl font-bold text-right">الفلترة</h2>
        <Filter className="mr-2" />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="rating">
          <AccordionTrigger className="text-right">التقييم</AccordionTrigger>
          <AccordionContent>
            <RadioGroup defaultValue="5">
              {[5, 4, 3, 2, 1 , 0].map(rating => (
                <div key={rating} className="flex items-center justify-end space-x-1 mb-2">
                  <Label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 mr-2">
                    <p className='text-nowrap'>  {rating === 0 ?  'لا يوجد تقيم': ` أكثر من ${rating - 0.5}`} </p>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>
                    ))}
                  </Label>
                  <RadioGroupItem value={`${rating}`} id={`rating-${rating}`} onClick={() => handleRatingFilter(rating)} />
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
                <RadioGroupItem id="category-packages" value="packages" onClick={onlyPackages} />
              </div>
              <div className="flex items-center justify-end space-x-2 mb-2">
                <Label htmlFor="category-products">منتج</Label>
                <RadioGroupItem id="category-products" value="products" onClick={onlyProducts} />
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

export default FilterSection