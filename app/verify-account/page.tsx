'use client'
import React, { ReactNode, Suspense } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useSearchParams , useRouter } from 'next/navigation'




const verifyAccount = async (token:string|null) => {
    try {
        const response = await axios.post(`https://herstyleapi.onrender.com/api/v1/users/verify-account`,  { token });
        return response.data; // Assuming the response data contains the message you need
    } catch(e) {
        console.error("Error in verifying = ", e);
    }
};

function VerifyPage() {

  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token')

    const verificationMutation = useMutation({
     mutationFn: (token:string|null)=>verifyAccount(token),
     onSuccess: ()=>{
      router.push('/')
     }
    })

    return (
        <div className='flex items-center justify-center h-screen'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold'>تحقق من بريدك الإلكتروني</h2>
            <p className='mt-2'>يرجى التحقق من صندوق بريدك الإلكتروني لتفعيل حسابك.</p>
            <Button className='bg-purple mt-4 px-8 hover:bg-purple-900' onClick={() => verificationMutation.mutate(token) }>
                { verificationMutation.isPending ? "قيد الانتظار" : verificationMutation.isSuccess ? "تم التفعيل بنجاح!" : 'متابعة'}
            </Button>
            </div>
        </div>  
    );
}

function Page(){
  return(<Suspense fallback={<div>Loading...</div>}>
    <VerifyPage />
  </Suspense>)
}

export default Page;
