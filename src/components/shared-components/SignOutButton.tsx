"use client";
import { signOut } from "@/lib/cookies";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../shadcn-ui/button";
import { deleteCookie } from "cookies-next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../shadcn-ui/alert-dialog";
import { useRouter } from "next/navigation";

interface SignOutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function SignOutButton({
  variant = "ghost",
  size = "default",
  className,
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // const handleSignOut = async () => {
  //   try {
  //     setIsLoading(true);
  //     // Clear client-side storage
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("userRole");
  //     deleteCookie("accessToken");
  //     deleteCookie("userRole");
  //     document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  //     document.cookie = `userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  //     // Call server action to clear cookies and redirect
  //     await signOut();

  //     toast.success("Signed out successfully");
  //     router.push("/");
  //   } catch (error) {
  //     toast.error("Error signing out");
  //     console.error("Sign out error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSignOut = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    deleteCookie("accessToken");
    deleteCookie("userRole");
    document.cookie = `accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // Call server action to clear cookies and redirect
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isLoading}
        >
          {size === "icon" ? (
            <LogOut className="h-4 w-4" />
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to sign out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will need to sign in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSignOut}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Signing out..." : "Sign out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
