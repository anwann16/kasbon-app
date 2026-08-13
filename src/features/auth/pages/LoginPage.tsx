import { LoginForm } from "../components/LoginForm";
import { BigLogo } from "@/components/shared/Logo";

const LoginPage = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <BigLogo />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
