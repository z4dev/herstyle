'use client'

import { Suspense, useState  } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

 function WrapResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }

    if (newPassword.length < 8) {
      setError('يجب أن تكون كلمة المرور على الأقل 8 أحرف')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('https://api.her-style.com/api/v1/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()


      if (response.ok) {
        setSuccess('تم إعادة تعيين كلمة المرور بنجاح')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(()=>{
          router.push("/")
        },1000)
      } else {
        setError(data.message || 'فشل في إعادة تعيين كلمة المرور')
      }
    } catch (err) {
      setError('حدث خطأ. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className='text-right'>إعادة تعيين كلمة المرور</CardTitle>
          <CardDescription className='text-right'>يرجى إدخال كلمة المرور الجديدة أدناه</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-right">
              <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pr-10 text-right"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-0 h-full"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">
                    {showPassword ? 'إخفاء كلمة المرور' : 'عرض كلمة المرور'}
                  </span>
                </Button>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-right"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full bg-purple hover:bg-black" disabled={isLoading}>
              {isLoading ? 'جارٍ إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

 export default function ResetPassword(){
  return(
    <Suspense fallback={<div> ... تحميل</div>} >
      <WrapResetPassword />
    </Suspense>
  )
}
