import { Bot } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Sender.io",
};

const DashboardPage = () => {
  return (
    <div>
      <div className="border-border bg-card text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-lg border p-10 text-sm">
        <Bot className="h-6 w-6" />
        <span>Rota em desenvolvimento, aguarde atualizações...</span>
      </div>
    </div>
  );
};

export default DashboardPage;
