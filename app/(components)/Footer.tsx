import React from "react";
import Image from "next/image";
import Link from "next/link";
function Footer() {
  return (
    <footer className="bg-purple text-white p-8 text-right ">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:text-right text-center mx-auto">
            <h3 className="font-bold mb-4">طرق الدفع لدينا</h3>
            <div className="flex lg:justify-end justify-center space-x-2 space-x-reverse">
              <Image
                className="mr-2 hover:opacity-80"
                src="/mada.png"
                alt="mada"
                width={40}
                height={25}
              />
              <Image
                className="hover:opacity-80"
                src="/visa.png"
                alt="Visa"
                width={40}
                height={25}
              />
            </div>


         
            <h3 className="font-bold mt-4 mb-2">التواصل الاجتماعي</h3>
            <div className="flex lg:justify-end justify-center space-x-2 space-x-reverse">
              <Link
                href="https://snapchat.com/t/sq45IYG3"
                className="mr-2 hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5.829 4.533c-.6 1.344-.363 3.752-.267 5.436-.648.359-1.48-.271-1.951-.271-.49 0-1.075.322-1.167.802-.066.346.089.85 1.201 1.289.43.17 1.453.37 1.69.928.333.784-1.71 4.403-4.918 4.931-.251.041-.43.265-.416.519.056.975 2.242 1.357 3.211 1.507.099.134.179.7.306 1.131.057.193.204.424.582.424.493 0 1.312-.38 2.738-.144 1.398.233 2.712 2.215 5.235 2.215 2.345 0 3.744-1.991 5.09-2.215.779-.129 1.448-.088 2.196.058.515.101.977.157 1.124-.349.129-.437.208-.992.305-1.123.96-.149 3.156-.53 3.211-1.505.014-.254-.165-.477-.416-.519-3.154-.52-5.259-4.128-4.918-4.931.236-.557 1.252-.755 1.69-.928.814-.321 1.222-.716 1.213-1.173-.011-.585-.715-.934-1.233-.934-.527 0-1.284.624-1.897.286.096-1.698.332-4.095-.267-5.438-1.135-2.543-3.66-3.829-6.184-3.829-2.508 0-5.014 1.268-6.158 3.833z" />
                </svg>
              </Link>
              <Link
                href="http://www.tiktok.com/@herstylee.9"
                className="hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/herstyle.9?igsh=NDR0N3J1amg3dWZh&utm_source=qr"
                className="hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
            </div>
          

            <h3 className="font-bold mt-4 mb-2">التواصل للعميل</h3>
            <p className="text-sm">
              المملكة العربية السعودية - الرياض - حي العليا
            </p>

         <div className="flex items-center justify-center lg:justify-end mt-4">
          <p>الرقم الضريبي : 0</p>
          <Image className="ml-2" width={30} height={30} src='/rkm.png' alt="rkm" />
         </div>

         <p className="mt-2">FL-129067621 : رقم السجل</p>

        </div>
        <div className="text-center lg:text-right mx-auto order-last  mt-4">
          <ul className="space-y-3">
            <li>الرئيسية</li>
            <li>جميع المنتجات</li>
            <li>سياسة الاستخدام</li>
            <li>من نحن</li>
          </ul>
        </div>
        <div className="flex flex-col  order-first lg:order-last lg:items-end items-center col-span-1 lg:col-span-1">
          <Image src="/footerImg.png" alt="Herstyle" width={100} height={50} />
          <p className="lg:text-right text-center mt-4 text-pretty w-full lg:w-3/4">
            هو منصة المتجر الذي يناسب الجمال والأناقة وتستطيع تسوق في أي وقت من
            الخدمات الشاملة والمتنوعة لتناسب الجميع، لتتمتع الحرية المطلقة
            الخاصة بك وتصبح شريك في النجاح لدينا.
          </p>
        </div>
      </div>
      <div className="mt-8 text-center flex items-center justify-center">
        <Link
          href="https://rab-t.com/"
          className="text-center flex items-center flex-col"
        >
         <p>2024 sep  جميع الحقوق محفوظة  </p> <span>لدى</span> <Image src='/company.png' className="mr-3" alt="company logo" height={180} width={180}/>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
