import { Metadata } from "next";
import { AuthForm } from "./features/form";

export const metadata: Metadata = {
  title: "Sign-in | Sender",
};

const AuthPage = () => {
  return (
    <main className="flex h-full items-center justify-center p-6 md:p-10">
      <AuthForm />
    </main>
  );
};

export default AuthPage;
