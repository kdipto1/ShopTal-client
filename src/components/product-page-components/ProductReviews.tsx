"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/shadcn-ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { createReview } from "@/lib/api";
import { Review } from "@/types";
import { Star } from "lucide-react";

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters long"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
}

export function ProductReviews({
  productId,
  reviews: initialReviews,
  averageRating,
}: ProductReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!session?.user?.accessToken) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    try {
      const newReview = await createReview(
        {
          productId,
          rating: data.rating,
          comment: data.comment,
        },
        session?.user.accessToken
      );
      // setReviews([newReview, ...reviews]);
      toast.success("Review submitted successfully!");
      form.reset();
    } catch (error) {
      toast.error("Failed to submit review.");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold">
        Customer Reviews ({reviews?.length})
      </h2>
      <div className="flex items-center my-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(averageRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
            />
          ))}
        </div>
        <p className="ml-2 text-sm text-muted-foreground">
          {averageRating.toFixed(1)} out of 5
        </p>
      </div>
      <div className="space-y-6 mt-6">
        {reviews?.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center mb-1">
              <p className="font-semibold">
                {review.user.firstName} {review.user.lastName}
              </p>
              <div className="flex items-center ml-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2">{review.comment}</p>
          </div>
        ))}
      </div>

      {session?.user && (
        <div className="mt-8">
          <h3 className="text-xl font-bold">Write a review</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit Review</Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
