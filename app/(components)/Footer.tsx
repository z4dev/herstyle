import React from 'react'

function Footer() {
  return (
    <footer className="bg-purple text-white p-8">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-bold mb-4">Herstyle</h3>
        <p>وصف موجز عن الشركة وخدماتها</p>
      </div>
      <div>
        <h3 className="font-bold mb-4">روابط سريعة</h3>
        <ul>
          <li>جميع المنتجات</li>
          <li>سياسة الاستخدام</li>
          <li>من نحن</li>
          <li>اتصل بنا</li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-4">تواصل معنا</h3>
        <div className="flex space-x-4">
          {/* Add social media icons here */}
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer