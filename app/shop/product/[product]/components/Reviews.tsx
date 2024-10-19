import React from 'react'
import { Star } from 'lucide-react'
import Date from '@/app/shop/component/Date'
import DateOfComment from '@/app/shop/component/Date';

function Reviews({comments}:{comments:any}) {

    const reviews = [
        {
          id: 1,
          author: "م / مريم الحجري",
          rating: 5,
          content: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكن أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك.",
          date: "منذ يومين"
        },
        {
          id: 2,
          author: "م / مريم الحجري",
          rating: 5,
          content: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكن أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك.",
          date: "منذ يومين"
        },
        {
          id: 3,
          author: "م / مريم الحجري",
          rating: 5,
          content: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكن أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك.",
          date: "منذ يومين"
        },
        {
          id: 4,
          author: "م / مريم الحجري",
          rating: 5,
          content: "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي، حيث يمكن أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك.",
          date: "منذ يومين"
        },
      ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
    {comments.map((review:any) => (
      <div key={review.id} className="  mb-6 pb-6 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm"><DateOfComment date={review.createdAt} /></span>
          <div className="flex items-center">
            <div className='flex flex-col items-end'>
              <h3 className="font-bold text-lg">{review.userId.name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-gray-600 text-sm mr-2">(25)</span>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-300 ml-4"></div>
          </div>
         
        </div>
        <p className="text-gray-700 text-right mr-3 mt-1">{review.content}</p>
      </div>
    ))}
  </div>
  )
}

export default Reviews