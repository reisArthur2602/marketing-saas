import { Logo } from "@/components/shared/logo";
import { currentUser } from "@/lib/auth-js";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { AvatarUser } from "./features/avatar-user";
import { Navigation } from "./features/navigation";

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const user = await currentUser();
  if (!user) redirect("/");

  return (
    <div className="container mx-auto">
      <header className="container mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Logo />
          <AvatarUser user={user} />
        </div>
        <Navigation />
      </header>

      <main className="p-6 md:p-10">{children}</main>
    </div>
  );
};

export default DashboardLayout;
