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
  IsPersistent: boolean;
};

const loginUser = async (data: LoginFormData) => {
  try {
    const response = await axiosInstance.post('/users/login', data);
    return response.data;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
};

export function Login() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } , reset } = useForm<LoginFormData>();
  const [user, setUser] = useState<string | null>(null)
  const [error , setError] = useState("")

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Save the token in a cookie
      setCookie('auth_token', data.accessToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        sameSite: 'strict'
      });
      setUser(data.user.name);
      setIsOpen(false);
      localStorage.setItem('user', data.user.name);
      // You might want to purpleirect the user or update the UI here
      localStorage.setItem('role', data.user.role);
      reset()

    },
    onError: (error) => {
      // Handle login error
      console.error('Login failed', error);
      setError("بيانات الاعتماد خاطئة"); // Set error message in Arabic for wrong credentials
      reset()
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

//  if(localStorage.getItem("user")  === null) setUser(null)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {user ? (
          <Link href={`/${localStorage.getItem('role') === "OWNER" ? "admin" : "profile"}`} className="flex items-center">
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
                  {...register("email", { required: "البريد الإلكتروني مطلوب" })}
                />
                {errors.email && <span className="text-red justify-end  w-full col-span-3">{errors.email.message}</span>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="password"
                  placeholder="كلمة المرور"
                  type="password"
                  className="col-span-4 focus-visible:ring-purple-500 text-right text-nowrap"
                  {...register("password", { required: "كلمة المرور مطلوبة" })}
                />
                {errors.password && <span className="text-red col-span-3">{errors.password.message}</span>}
              </div>
              <div className="flex items-center justify-end space-x-2 w-full rtl:space-x-reverse">
                <Label htmlFor="IsPersistent" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  تذكرني
                </Label>
                <Checkbox id="IsPersistent" {...register("IsPersistent")} />
              </div>
              {error && <p className="text-red">{error}</p> }
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
