"use client"
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Signup from "./Signup";
import axiosInstance from "@/utils/axiosInstance";
import { setCookie } from "cookies-next";
import { User } from "lucide-react";
import Link from "next/link";

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

const loginUser = async (data: LoginFormData) => {
  const response = await axiosInstance.post('/users/login', data );
  console.log("Response headers:", response.headers);
  console.log("response =",response.data)
  return response.data;
};

export function Login() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [user, setUser] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Save the token in a cookie
      setCookie('auth_token', data.accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        sameSite: 'strict'
      });
      console.log('Login successful', data);
      setUser(data.user.name);
      setIsOpen(false);
      localStorage.setItem('user', data.user.name);
      // You might want to purpleirect the user or update the UI here
      localStorage.setItem('role', data.user.role);

    },
    onError: (error) => {
      // Handle login error
      console.error('Login failed', error);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  useEffect(() => {
    setUser(localStorage.getItem('user'));
  }, []);


  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {user ? (
          <Link href={`/${localStorage.getItem('role')=== "OWNER" ? "admin" : "profile"}`} className="flex items-center">
              <User className="text-white mr-2" size={20} />
              <span className="text-white font-semibold">{user}</span>
            </Link>
          ) : (
            <DialogTrigger asChild>
            <button className="bg-purple text-white px-2 lg:px-4 py-2 rounded">
              تسجيل الدخول
            </button>
        </DialogTrigger>
          )}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex justify-between items-end">
            <DialogTitle>دخول</DialogTitle>
            <DialogDescription className="text-right">
              قم بإدخال بيانات تسجيل الدخول الخاصة بك هنا. انقر على دخول عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="email"
                  placeholder="البريد الإلكتروني"
                  className="col-span-4 focus-visible:ring-purple-500 text-right"
                  {...register("email", { required: "Email is requipurple" })}
                />
                {errors.email && <span className="text-purple">{errors.email.message}</span>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="password"
                  placeholder="كلمة المرور"
                  type="password"
                  className="col-span-4 focus-visible:ring-purple-500 text-right text-nowrap"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <span className="text-purple">{errors.password.message}</span>}
              </div>
              <div className="flex items-center justify-end space-x-2 w-full rtl:space-x-reverse">
                <Label htmlFor="remember" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  تذكرني
                </Label>
                <Checkbox id="remember" {...register("remember")} />
              </div>
            </div>
            <DialogFooter>
              <div className="w-full">
                <div>
                  <Button type="submit" className="bg-purple text-white px-4 py-2 rounded w-full" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? 'جاري الدخول...' : 'دخول'}
                  </Button>
                </div>
                <button
                  type="button"
                  className="text-purple px-4 py-2 rounded w-full"
                  onClick={() => setIsSignupOpen(true)}
                >
                  تسجيل جديد
                </button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Signup isSignupOpen={isSignupOpen} setIsSignupOpen={()=>setIsSignupOpen(false)} />
    </>
  );
}
