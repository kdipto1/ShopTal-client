import LoginForm from "@/components/login-page-components/LoginForm";
import second from "@/app/assets/undraw_login.svg";
import Image from "next/image";
import { Card } from "@/components/shadcn-ui/card";

export default function LoginPage() {
  return (
    <div className="h-screen p-8  flex flex-col-reverse md:flex-row justify-around items-center gap-4">
      <div>
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
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
