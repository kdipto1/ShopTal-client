"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
import { Button } from "@/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Input } from "@/components/shadcn-ui/input";
import { Label } from "@/components/shadcn-ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn-ui/tabs";
import SignOutButton from "@/components/shared-components/SignOutButton";
import { Loader2, Settings, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "@/lib/cookies";
import { deleteCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";

// Define types
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}

interface ApiResponse {
  data: {
    name: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "/placeholder.svg",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // Initialize user role from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("userRole"));
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }, [user, reset]);

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  };

  const getProfile = async () => {
    try {
      setIsLoading(true);
      setError("");
      const accessToken = getAccessToken();

      if (!accessToken) {
        router.push("/login");
        deleteCookie("accessToken");
        deleteCookie("userRole");
        throw new Error("Please login first!");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = (await response.json()) as ApiResponse;
      setUser({
        avatar: data?.data.name || "/avatar.webp",
        email: data?.data.email || "",
        firstName: data?.data.firstName || "",
        lastName: data?.data.lastName || "",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      setIsUpdating(true);
      setError("");

      const accessToken = await getAccessToken();

      if (!accessToken) {
        await signOut();
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setUser((prev) => ({ ...prev, ...formData }));
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container min-h-[70vh] mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
              <AvatarFallback>
                {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">
              {`${user.firstName} ${user.lastName}`}
            </h2>
            <p className="text-muted-foreground">{user.email}</p>

            {userRole === "admin" && (
              <Link className="mt-4" href="/dashboard">
                <Button>Admin Dashboard</Button>
              </Link>
            )}

            <SignOutButton className="mt-4" />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <Tabs defaultValue="details">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">
                  <User className="mr-2 h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="details">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      disabled={isUpdating}
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      disabled={isUpdating}
                      aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled={isUpdating}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your account activity
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Change your password
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Update
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      Enable
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
