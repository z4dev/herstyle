'use client'
import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { getCookie } from 'cookies-next';
import { Button } from '@/components/ui/button';

const verifyAccount = async (token:string|undefined) => {
    try {
        const response = await axiosInstance.post(`users/verify-account`, {
          params: { token },
        });
        console.log("verification success = ", response.data);
        return response.data; // Assuming the response data contains the message you need
    } catch(e) {
        console.log("Error in verifying = ", e);
    }
};

function Page() {
    const token = getCookie('auth_token');

    const verificationMutation = useMutation({
     mutationFn: (token:string|undefined)=>verifyAccount(token),
     onSuccess: ()=>{

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

export default Page;
