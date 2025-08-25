import { Metadata } from "next";
import { AuthForm } from "./features/form";
import { currentUser } from "@/lib/auth-js";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign-in | Sender",
};

const AuthPage = async () => {
  const user = await currentUser();
  if (user) redirect("/dashboard");
  return (
    <main className="flex flex-1 items-center justify-center p-6 md:p-10">
      <AuthForm />
    </main>
  );
};

export default AuthPage;
