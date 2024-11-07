"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useDispatch, useSelector } from "react-redux";
import { addName } from "@/utils/cart";
import { RootState } from "@/utils/store";
import axios from "axios";

type LoginFormData = {
  email: string;
  password: string;
  IsPersistent: boolean;
};

type ForgotPasswordFormData = {
  email: string;
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

const resetPassword = async (data: ForgotPasswordFormData) => {
  try {
    const response = await axios.post('https://herstyleapi.onrender.com/api/v1/users/reset-password-link', data);
    console.log(response)
    return response.data;
  } catch (error) {
    console.log("Password reset error:", error);
    throw error;
  }
};

export function Login() {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>();
  const { register: registerForgotPassword, handleSubmit: handleSubmitForgotPassword, formState: { errors: forgotPasswordErrors }, reset: resetForgotPassword } = useForm<ForgotPasswordFormData>();
  const [error, setError] = useState("")
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("")
  const user = useSelector((state: RootState) => state.user.name)

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || "";
    dispatch(addName(storedUser));
  }, []);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      setCookie('auth_token', data.accessToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        sameSite: 'strict'
      });
      setIsOpen(false);
      localStorage.setItem('user', data.user.name);
      localStorage.setItem('role', data.user.role);
      reset()
      dispatch(addName(data.user.name));
    },
    onError: (error) => {
      console.error('Login failed', error);
      setError("بيانات الاعتماد خاطئة");
      reset()
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      setForgotPasswordMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
      resetForgotPassword()
    },
    onError: (error) => {
      console.error('Password reset failed', error);
      setForgotPasswordMessage("فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى");
      resetForgotPassword()
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onSubmitForgotPassword = (data: ForgotPasswordFormData) => {
    resetPasswordMutation.mutate(data);
  };

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
                {errors.email && <span className="text-red col-span-4 text-right">{errors.email.message}</span>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="password"
                  placeholder="كلمة المرور"
                  type="password"
                  className="col-span-4 focus-visible:ring-purple-500 text-right text-nowrap"
                  {...register("password", { required: "كلمة المرور مطلوبة" })}
                />
                {errors.password && <span className="text-red col-span-4 text-right">{errors.password.message}</span>}
              </div>
              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  className="text-purple text-sm"
                  onClick={() => {
                    setIsOpen(false);
                    setIsForgotPasswordOpen(true);
                  }}
                >
                  نسيت كلمة المرور؟
                </button>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Label htmlFor="IsPersistent" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    تذكرني
                  </Label>
                  <Checkbox id="IsPersistent" {...register("IsPersistent")} />
                </div>
              </div>
              {error && <p className="text-red">{error}</p>}
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

      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex justify-between items-end">
            <DialogTitle>نسيت كلمة المرور</DialogTitle>
            <DialogDescription className="text-right">
              أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitForgotPassword(onSubmitForgotPassword)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="forgotPasswordEmail"
                  placeholder="البريد الإلكتروني"
                  className="col-span-4 focus-visible:ring-purple-500 text-right"
                  {...registerForgotPassword("email", { required: "البريد الإلكتروني مطلوب" })}
                />
                {forgotPasswordErrors.email && <span className="text-red col-span-4 text-right">{forgotPasswordErrors.email.message}</span>}
              </div>
              {forgotPasswordMessage && <p className="text-green-500">{forgotPasswordMessage}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-purple text-white px-4 py-2 rounded w-full" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Signup isSignupOpen={isSignupOpen} setIsSignupOpen={() => setIsSignupOpen(false)} />
    </>
  );
}