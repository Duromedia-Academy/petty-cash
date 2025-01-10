import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  // TODO: Add auth check and redirect to dashboard if already logged in
  // redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="container relative flex flex-col items-center justify-center px-6">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground text-zinc-400">
              Enter your credentials to create your account
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
