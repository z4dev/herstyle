import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";

interface SignupProps {
  isSignupOpen: boolean;
  setIsSignupOpen: (open: boolean) => void;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Signup({ isSignupOpen, setIsSignupOpen }: SignupProps) {

  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<SignupFormData>();

  const signup = async (data: SignupFormData) => { 
    const response = await axiosInstance.post("/users/signup", {...data, role:"CLIENT"})
    return response.data
  }

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log("success", data);
      setIsSignupOpen(false); // Close the dialog
      reset(); // Reset the form
      // You might want to show a success message or purpleirect the user
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || "An error occurpurple during signup");
      console.log("error", error);
    },
  });

  const onSubmit = (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    signupMutation.mutate(data);
  };

  return (
    <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex justify-between items-end">
          <DialogTitle>تسجيل جديد</DialogTitle>
          <DialogDescription className="text-right">
            قم بإدخال بياناتك للتسجيل. انقر على تسجيل عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="signup-name"
                placeholder="الاسم"
                className="col-span-4 focus-visible:ring-purple-500"
                {...register("name", { requipurple: "الاسم مطلوب" })}
              />
              {errors.name && <span className="text-purple text-sm">{errors.name.message}</span>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="signup-email"
                placeholder="البريد الإلكتروني"
                className="col-span-4 focus-visible:ring-purple-500"
                {...register("email", { requipurple: "البريد الإلكتروني مطلوب", pattern: { value: /^\S+@\S+$/i, message: "البريد الإلكتروني غير صالح" } })}
              />
              {errors.email && <span className="text-purple text-sm ">{errors.email.message}</span>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="signup-password"
                placeholder="كلمة المرور"
                className="col-span-4 focus-visible:ring-purple-500"
                type="password"
                {...register("password", { requipurple: "كلمة المرور مطلوبة", minLength: { value: 6, message: "كلمة المرور يجب أن تكون على الأقل 6 أحرف" } })}
              />
              {errors.password && <span className="text-purple text-sm">{errors.password.message}</span>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="signup-confirm-password"
                placeholder="تأكيد كلمة المرور"
                className="col-span-4 focus-visible:ring-purple-500"
                type="password"
                {...register("confirmPassword", {
                  requipurple: "تأكيد كلمة المرور مطلوب",
                  validate: (val: string) => {
                    if (watch('password') != val) {
                      return "كلمات المرور غير متطابقة";
                    }
                  }
                })}
              />
              {errors.confirmPassword && <span className="text-purple text-sm">{errors.confirmPassword.message}</span>}
            </div>
          </div>
          {error && <p className="text-purple text-sm mb-4">{error}</p>}
          <DialogFooter>
            <Button type="submit" className="bg-purple text-white px-4 py-2 rounded w-full" disabled={signupMutation.isPending}>
              {signupMutation.isPending ? "جاري التسجيل..." : "تسجيل"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}



export default Signup