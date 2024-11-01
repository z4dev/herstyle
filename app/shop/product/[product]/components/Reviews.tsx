"use client";

import React, { useState } from "react";
import { Star, User } from "lucide-react";
import DateOfComment from "@/app/shop/component/Date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "@/hooks/use-toast";

export default function Reviews({
  comments = [],
  id = "",
}: {
  comments: any[];
  id: string;
}) {
  const queryClient = useQueryClient();

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const handleRatingChange = (rating: number) => {
    setNewRating(rating);
  };

  const addComment = useMutation({
    mutationFn: async ({ productId, content, stars }: any) =>
      await axiosInstance.post("/comments", { productId, content, stars }),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إضافة التعليق",
      });
      queryClient.invalidateQueries({ queryKey: ["view-package"] });
      queryClient.invalidateQueries({ queryKey: ["view-product"] });
      setNewComment("");
      setNewRating(0);
    },
    onError: (e: any) => {
      if (e.status === 401) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إضافة التعليق. يرجى تسجيل الدخول أولاً.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إضافة التعليق",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = () => {
    if (newRating === 0) {
      toast({
        title: "تنبيه",
        description: "يرجى اختيار تقييم",
      });
      return;
    }
    addComment.mutate({ content: newComment, productId: id, stars: newRating });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {comments.length === 0 ? (
        <div className="h-[50vh] flex items-center justify-center">
          <p className="text-gray-500 text-center">لا توجد تعليقات بعد.</p>
        </div>
      ) : (
        <div
          className={`cart-items ${
            comments.length > 5 ? "h-[100vh] overflow-y-scroll" : ""
          }`}
          style={{ direction: "rtl", textAlign: "right" }}
        >
          {comments.map((review: any) => (
            <div
              key={review.id}
              className="mb-6 pb-6 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <User
                    className="mx-auto mb-4 text-purple border-2 border-purple rounded-full p-2"
                    size={64}
                  />
                  <div className="flex flex-col items-start mr-2">
                    <h3 className="font-bold text-lg">{review.userId.name}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.stars
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-gray-600 text-sm ml-2">
                        ({review.stars})
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-gray-500 text-sm">
                  <DateOfComment date={review.createdAt} />
                </span>
              </div>
              <p className="text-gray-700 mt-1">{review.content}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex-col">
        <h4 className="font-bold mb-2 text-right">أضف تعليقك</h4>
        <div className="ml-auto flex items-center justify-end mb-2">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-6 h-6 cursor-pointer ${
                index < newRating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
              onClick={() => handleRatingChange(index + 1)}
            />
          ))}
        </div>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 text-right"
          rows={4}
          value={newComment}
          onChange={handleCommentChange}
          placeholder="اكتب تعليقك هنا..."
          required
        />
        <button
          onClick={handleSubmit}
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          disabled={addComment.isPending}
        >
          {addComment.isPending ? "...جاري الإرسال" : "إرسال"}
        </button>
      </div>
    </div>
  );
}
