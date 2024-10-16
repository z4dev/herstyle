'use client'
import React from 'react'
import Image from 'next/image'
import { SquarePenIcon, User } from 'lucide-react'
import { deleteCookie } from "cookies-next";
import { useRouter } from 'next/navigation';


function ProfilePage() {

    const router = useRouter();
  const handleSignOut = () => {
   localStorage.removeItem('user');
   deleteCookie('auth_token');
   router.push('/');
  };
  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-8'>
      <div className='flex items-center  mb-6'>
 
        <div className='mr-4 text-right'>
          <h1 className='text-2xl font-bold'>مرحبا بك، مريم الحصري</h1>
          <p className='text-gray-600'>الرئيسة / تعديل المعلومات</p>
        </div>
        {/* <Image
          src="/path-to-profile-image.jpg"
          alt="Profile"
          width={80}
          height={80}
          className='rounded-full'
        /> */}
        <User  size={80} className='text-gray-800 font-thin border-2 border-gray-200 rounded-full p-2' />
      </div>

      <form className='space-y-4'>
        <div className='flex justify-between items-center border-2 rounded-lg border-gray-200 px-2'>
          <div className='flex items-center gap-2'>
            <SquarePenIcon/>
            <input type="text" defaultValue="مريم الحصري" className='p-2 rounded focus:outline-none' />
          </div>
          <label className='font-medium'>الاسم</label>
        </div>
        <div className='flex justify-between items-center border-2 rounded-lg border-gray-200 px-2'>
          <div className='flex items-center gap-2'>
            <SquarePenIcon/>
            <input type="email" defaultValue="marim19@gmail.com" className='p-2 rounded focus:outline-none' />
          </div>
          <label className='font-medium'>البريد الإلكتروني</label>
        </div>
        <div className='flex justify-between items-center border-2 rounded-lg border-gray-200 px-2'>
          <div className='flex items-center gap-2'>
            <SquarePenIcon/>
            <input type="password" defaultValue="123456789" className='p-2 rounded focus:outline-none' />
          </div>
          <label className='font-medium'>كلمة المرور</label>
        </div>
        <button className='w-full bg-purple text-white py-2 rounded'>حفظ التعديلات</button>
        <button className='w-full bg-black text-red py-2 rounded' onClick={handleSignOut}>تسجيل الخروج</button>
      </form>
    </div>
  )
}

export default ProfilePage
