import LoginForm from "@/components/login-page-components/LoginForm";
import second from "@/app/assets/undraw_login.svg";
import Image from "next/image";
import { Card } from "@/components/shadcn-ui/card";
import { Suspense } from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen p-8  flex flex-col-reverse md:flex-row justify-around items-center gap-4">
      <div className="hidden md:block">
        <Image src={second} alt="login image" width={500} height={500} />
      </div>
      <div className="max-w-lg">
        <Card className="mx-auto p-4">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your phone number and password below to login to your
              account
            </p>
          </div>
          <Suspense fallback={<></>}>
            <LoginForm />
          </Suspense>
          <p className="mt-4">
            Don't have an account?
            <Link className="text-[#6c63ff]" href={"/signup"}>
              {" "}
              Register now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
