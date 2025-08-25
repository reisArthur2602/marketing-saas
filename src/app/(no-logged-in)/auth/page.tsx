import { Metadata } from "next";
import { AuthForm } from "./features/form";

export const metadata: Metadata = {
  title: "Sign-in | Sender",
};

const AuthPage = async() => {
  throw new Error()
  return (
    <main className="flex flex-1 items-center justify-center p-6 md:p-10">
      <AuthForm />
    </main>
  );
};

export default AuthPage;
