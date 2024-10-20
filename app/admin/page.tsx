'use client';

import { deleteCookie } from 'cookies-next';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
]

export default function page() {

    const router = useRouter();

    const handleSignOut = () => {
      localStorage.removeItem('user');
      localStorage.removeItem("role")
      deleteCookie('auth_token');
      router.push('/');
  };


  return (
    <div className="min-h-screen bg-white p-4">


      <main>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Total Users', value: '10,483' },
            { title: 'Total Revenue', value: '$84,382' },
            { title: 'Conversion Rate', value: '3.6%' },
          ].map((metric, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-purple-200">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">{metric.title}</h2>
              <span className="text-2xl font-bold text-purple-900">{metric.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-purple-200">
          <h2 className="text-xl font-semibold text-purple mb-4">Monthly Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#564495" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
      <div className='flex justify-center items-center w-full mt-5'>
        <button onClick={handleSignOut} className="bg-black text-white px-2 lg:px-4 py-2 rounded flex items-center gap-2"> <LogOutIcon/> تسجيل الخروج</button>
        </div>
    </div>
  )
}
