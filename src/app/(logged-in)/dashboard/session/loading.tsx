import { Metadata } from "next";

import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Sessão | Sender.io",
};

const SessionLoadingPage = () => {
  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1>Sessão WhatsApp</h1>
        <p>Gerencie a conexão com o WhatsApp</p>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-[352px] rounded-2xl" />
        <Skeleton className="h-[352px] rounded-2xl" />
      </section>
    </div>
  );
};

export default SessionLoadingPage;
