import LoginForm from "@/components/login-page-components/LoginForm";
import second from "@/app/assets/undraw_access_account_re_8spm.svg";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="h-screen bg-gray-100 sm:flex-col-reverse flex justify-around md:flex-row items-center">
      <div>
        <Image src={second} alt="login image" width={500} height={500} />
      </div>
      <div className="max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
}
