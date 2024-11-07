import React from "react";

function page() {
  return (
    <section className="text-right flex justify-center items-center py-12">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-3/4">
        <h1 className="text-2xl font-bold mb-4">
          <span className="text-purple mr-2 font-normal">Herstyle</span>
          سياسة استخدام{" "}
        </h1>
        <ul className="mb-4 text-balance space-y-8">
          <li className="flex flex-row-reverse justify-start items-start">
            <span className="text-3xl font-bold ml-2">.</span>
            المدفوعات: نقبل جميع طرق الدفع الإلكترونية، بالإضافة إلى الدفع
            النقدي عند الاستلام. يُرجى التأكد من صحة معلومات الدفع لتجنب أي
            تأخير في عملية الشراء.
          </li>
          <li className="flex flex-row-reverse justify-start items-center">
            <span className="text-3xl font-bold ml-2 mb-2">.</span>
            حقوق الملكية: جميع الحقوق محفوظة. لا يجوز نسخ أو إعادة إنتاج أي جزء
            من موقعنا بدون موافقتنا
          </li>
        </ul>
      </div>
    </section>
  );
}

export default page;
