import React from "react";

function page() {
  return (
    <section className="text-right flex justify-center items-center py-12">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-3/4">
        <h1 className="text-2xl font-bold mb-4">من نحن ؟</h1>
        <p className="mb-4 text-balance">
          هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا
          النص من مولد النص العربى، حيث يمكنك أن تولد مثل إذا كنت تحتاج إلى عدد
          أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد،
          النص لن يبدو مقسما ولا يحوي أخطاء
        </p>
        <p className="mb-4">هذا النص هو مثال لنص</p>
        <p>هذا النص هو مثال لنص </p>
      </div>
    </section>
  );
}

export default page;
