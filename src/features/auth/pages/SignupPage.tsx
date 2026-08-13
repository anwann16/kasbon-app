import { SignupForm } from "../components/SignupForm";
import { BigLogo } from "@/components/shared/Logo";

const SignupPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <BigLogo />
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
