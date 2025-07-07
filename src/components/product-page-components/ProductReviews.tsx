"use client";
import { useState, useEffect } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn-ui/pagination";
import { Textarea } from "@/components/shadcn-ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { createReview, getProductReviews, updateReview } from "@/lib/api";
import { Review } from "@/types";
import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../shadcn-ui/avatar";
import { Separator } from "../shadcn-ui/separator";
import { Skeleton } from "../shadcn-ui/skeleton";

const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .min(1, "Rating is required")
    .max(5, "Rating must be 5 or less"),
  comment: z.string().min(10, "Comment must be at least 10 characters long"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ProductReviewsProps {
  productId: string;
  canReview: boolean;
  initialAverageRating: number;
}

export function ProductReviews({
  productId,
  canReview,
  initialAverageRating,
}: ProductReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(initialAverageRating);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await getProductReviews(productId, currentPage);
        setReviews(response.data.data);
        setTotalReviews(response.data.meta.total);
        setTotalPages(
          Math.ceil(response.data.meta.total / response.data.meta.limit)
        );
      } catch (error) {
        toast.error("Failed to load reviews.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [productId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (!session?.user?.accessToken) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    try {
      if (editingReviewId) {
        await updateReview(
          editingReviewId,
          {
            rating: data.rating,
            comment: data.comment,
          },
          session.user.accessToken
        );
        toast.success("Review updated successfully!");
        setEditingReviewId(null);
      } else {
        if (!canReview) {
          toast.error("You can only review products that you have purchased.");
          return;
        }
        try {
          const response = await createReview(
            {
              productId,
              rating: data.rating,
              comment: data.comment,
            },
            session.user.accessToken
          );
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }

      // Refetch reviews to show the update/new review
      const response = await getProductReviews(productId, 1);
      setReviews(response.data.data);
      setTotalReviews(response.data.meta.total);
      setTotalPages(
        Math.ceil(response.data.meta.total / response.data.meta.limit)
      );
      setCurrentPage(1);

      form.reset();
      setSelectedRating(0);
    } catch (error) {
      toast.error((error as Error).message || "Failed to submit review.");
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review.id);
    form.setValue("rating", review.rating);
    form.setValue("comment", review.comment || "");
    setSelectedRating(review.rating);
  };

  return (
    <div className="mt-16">
      <Separator className="my-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(averageRating)
                      ? "text-primary"
                      : "text-muted-foreground/30"
                  }`}
                  fill="currentColor"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {(averageRating || 0).toFixed(1)} out of 5 ({totalReviews}{" "}
              reviews)
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          {/* Review Form */}
          {session?.user && canReview && !editingReviewId && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Write a review</h3>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Rating</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-7 w-7 cursor-pointer transition-colors ${
                                  (hoveredRating || selectedRating) > i
                                    ? "text-primary"
                                    : "text-muted-foreground/30"
                                }`}
                                fill="currentColor"
                                onMouseEnter={() => setHoveredRating(i + 1)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => {
                                  setSelectedRating(i + 1);
                                  field.onChange(i + 1);
                                }}
                              />
                            ))}
                          </div>
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
                        <FormLabel>Your Review</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your thoughts on the product..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full md:w-auto">
                    Submit Review
                  </Button>
                </form>
              </Form>
            </div>
          )}
          {/* Display Reviews */}
          {isLoading ? (
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) =>
                editingReviewId === review.id ? (
                  <div key={review.id} className="mb-12">
                    <h3 className="text-xl font-bold mb-4">Edit your review</h3>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Rating</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-7 w-7 cursor-pointer transition-colors ${
                                        (hoveredRating || selectedRating) > i
                                          ? "text-primary"
                                          : "text-muted-foreground/30"
                                      }`}
                                      fill="currentColor"
                                      onMouseEnter={() =>
                                        setHoveredRating(i + 1)
                                      }
                                      onMouseLeave={() => setHoveredRating(0)}
                                      onClick={() => {
                                        setSelectedRating(i + 1);
                                        field.onChange(i + 1);
                                      }}
                                    />
                                  ))}
                                </div>
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
                              <FormLabel>Your Review</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Share your thoughts on the product..."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex gap-4">
                          <Button type="submit" className="w-full md:w-auto">
                            Update Review
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingReviewId(null);
                              form.reset();
                              setSelectedRating(0);
                            }}
                            className="w-full md:w-auto"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                ) : (
                  <div key={review?.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            {review?.user.firstName} {review?.user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review?.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-primary"
                                  : "text-muted-foreground/30"
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {review?.comment}
                      </p>

                      {session?.user?.userId === review?.userId && (
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2"
                          onClick={() => handleEditClick(review)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.max(1, currentPage - 1));
                      }}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(Math.min(totalPages, currentPage + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
