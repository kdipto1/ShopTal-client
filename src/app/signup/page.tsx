import SignupForm from "@/components/signup-page-components/SignupForm";
import Image from "next/image";
import signup from "@/app/assets/undraw_sign_up.svg";
import { Card } from "@/components/shadcn-ui/card";

const page = () => {
  return (
    <div className="h-screen p-8  flex flex-col-reverse md:flex-row justify-around items-center gap-4">
      <div>
        <Image src={signup} alt="signup page image" width={500} height={500} />
      </div>
      <div className="max-w-lg">
        <Card className="mx-auto p-4">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Signup</h1>
            <p className="text-balance text-muted-foreground">
              Fill up the from for signing up
            </p>
          </div>
          <SignupForm />
        </Card>
      </div>
    </div>
  );
};

export default page;
