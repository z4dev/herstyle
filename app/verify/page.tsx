'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { getCookie } from 'cookies-next';

const verifyAccount = async (token:string) => {
    try{

        const response = await axiosInstance.post(`users/verify-account`, {
          params: { token },
        });
        console.log("verification success = " , response.data)
        return response.data; // Assuming the response data contains the message you need
    } catch(e){
        console.log("Error in verifying = ",e)
    }
};

function Page() {

  const token = getCookie('auth_token')
    
  const { data, error, isLoading } = useQuery({
    queryKey:['verify'],
    queryFn: ()=>verifyAccount(token as string)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Verification Status</h1>
      <p>{data.message}</p>
    </div>
  );
}

export default Page;
