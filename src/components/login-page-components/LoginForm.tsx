// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../shadcn-ui/form";
// import { Input } from "../shadcn-ui/input";
// import { Button } from "../shadcn-ui/button";
// import { toast } from "sonner";
// import { useState } from "react";
// import { LoginResponse } from "@/types";
// import setCookie from "@/lib/nextCookies";
// import { useSearchParams, useRouter } from "next/navigation";

// // import { cookies } from "next/headers";

// const formSchema = z.object({
//   phone: z.string().min(10, {
//     message: "Username must be at least 2 characters.",
//   }),
//   password: z.string().min(6, {
//     message: "Password must be at least 2 characters.",
//   }),
// });

// const LoginForm = () => {
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
//   // const [token, setToken, removeToken] = useToken("accessToken");
//   // const cookieStore = cookies();
//   const searchParams = useSearchParams();

//   const callbackUrl = searchParams.get("callbackUrl") || "/";

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       phone: "",
//       password: "",
//     },
//   });
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//   // const onSubmit = async (values: z.infer<typeof formSchema>) => {
//   //   const phone = `${values.phone.slice(0, 3)}-${values.phone.slice(
//   //     3,
//   //     6
//   //   )}-${values.phone.slice(6, 10)}`;
//   //   const password = values.password;
//   //   const response = await fetch(`${API_BASE_URL}/auth/login`, {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify({ phone, password }),
//   //   });
//   //   const data = await response.json();

//   //   if (data) {
//   //     localStorage.setItem("accessToken", data?.data?.accessToken);
//   //     localStorage.setItem("role", data?.data?.role);
//   //   }
//   //   toast(data.message, { duration: 960 });
//   // };

//   function checkRouteAccess(route: string, userRole: string): boolean {
//     const matchingRoute = Object.entries(protectedRoutes).find(([path]) =>
//       route.startsWith(path)
//     );
//     console.log(route, userRole);
//     if (!matchingRoute) return true; // If route is not protected, allow access
//     return matchingRoute[1].includes(userRole);
//   }

//   const handleLogin = async (values: z.infer<typeof formSchema>) => {
//     const phone = `${values.phone.slice(0, 3)}-${values.phone.slice(
//       3,
//       6
//     )}-${values.phone.slice(6, 10)}`;
//     const password = values.password;
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ phone, password }),
//       });

//       const data: LoginResponse = await response.json();

//       if (data.success) {
//         // Store both token and role in localStorage and cookies
//         localStorage.setItem("accessToken", data.data.accessToken);
//         localStorage.setItem("userRole", data.data.role);
//         setCookie(data.data);
//         // cookieStore.set("accessToken", data.data.accessToken, {
//         //   expires: 1, // 1 day
//         //   path: "/",
//         // });
//         // cookieStore.set("userRole", data.data.role, {
//         //   expires: 1,
//         //   path: "/",
//         // });

//         // Redirect based on role
//         // if (data.data.role === "admin") {
//         //   router.push("/admin");
//         // } else {
//         //   router.push("/dashboard");
//         // }
//         const canAccess = await checkRouteAccess(callbackUrl, data.data.role);

//         // Redirect to callback URL if accessible, otherwise to default route
//         if (canAccess) {
//           router.push(callbackUrl);
//         } else {
//           router.push("/");
//         }
//       } else {
//         setError(data.message);
//       }
//     } catch (error) {
//       setError("An error occurred during login");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="phone"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Phone</FormLabel>
//               <FormControl>
//                 <Input type="tel" placeholder="1234567890" {...field} />
//               </FormControl>
//               {/* <FormDescription>
//                   This is your public display name.
//                 </FormDescription> */}
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input type="password" placeholder="******" {...field} />
//               </FormControl>
//               {/* <FormDescription>
//                   This is your public display name.
//                 </FormDescription> */}
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   );
// };

// export default LoginForm;

/** ++++++++++++++++++++++++++++++++++++++++++++---------------------------------------- */

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PROTECTED_ROUTES } from "@/middleware";
import { setCookie } from "@/lib/cookies";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn-ui/form";
import { Input } from "../shadcn-ui/input";
import { Button } from "../shadcn-ui/button";

// Form validation schema
const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must not exceed 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const formatPhoneNumber = (phone: string): string => {
    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const checkRouteAccess = (route: string, userRole: string): boolean => {
    const matchingRoute = Object.entries(PROTECTED_ROUTES).find(([path]) =>
      route.startsWith(path)
    );
    return matchingRoute ? matchingRoute[1].includes(userRole) : true;
  };

  const handleLogin = async (values: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formatPhoneNumber(values.phone),
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store auth data
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("userRole", data.data.role);

        // Set cookies and handle redirect
        await setCookie(data.data, {
          redirect: checkRouteAccess(callbackUrl, data.data.role)
            ? callbackUrl
            : "/",
        });

        toast.success("Login successful");
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = "An error occurred during login";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="1234567890"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
