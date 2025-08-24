import { Logo } from "@/components/shared/logo";
import { currentUser } from "@/lib/auth-js";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { StatusSessionBadge } from "./features/status-session-badge";
import { AvatarUser } from "./features/avatar-user";
import { Navigation } from "./features/navigation";
import { WelcomeModal } from "@/components/shared/welcome-modal";

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const user = await currentUser();
  if (!user) redirect("/");

  return (
    <div className="container mx-auto flex flex-1 flex-col">
      <header className="container mx-auto px-4 pt-10">
        <div className="mb-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <StatusSessionBadge />
            <AvatarUser user={user} />
          </div>
        </div>

        <Navigation />
      </header>
      <WelcomeModal />
      <main className="flex flex-1 px-4 py-10">{children}</main>
    </div>
  );
};

export default DashboardLayout;
