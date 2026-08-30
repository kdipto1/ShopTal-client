"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Card } from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { resetPasswordAPI } from "@/lib/api";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordFormData, any, ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-red-500">
          This reset link is invalid. Please request a new one.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 text-sm py-2 transition-colors duration-150">
            Request New Link
          </Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await resetPasswordAPI({ token, newPassword: data.newPassword });
      toast.success("Password reset successfully. You can now login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...field}
                  disabled={isLoading}
                  className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...field}
                  disabled={isLoading}
                  className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 text-sm py-2 transition-colors duration-150"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Reset Password
        </Button>
      </form>
    </Form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center items-center bg-white dark:bg-gray-950">
      <div className="max-w-md w-full">
        <Card className="mx-auto p-5 border border-gray-100 dark:border-gray-800 shadow-none rounded-xl bg-white dark:bg-gray-950">
          <div className="grid gap-1 text-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choose a new password for your account
            </p>
          </div>
          <Suspense fallback={<></>}>
            <ResetPasswordForm />
          </Suspense>
          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            Remembered your password?
            <Link
              className="text-pink-600 hover:underline ml-1"
              href={"/login"}
            >
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
