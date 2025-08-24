import { Metadata } from "next";

import { ConnectSession } from "./features/connect-session";
import { StatusSession } from "./features/status-session";

export const metadata: Metadata = {
  title: "Sessão | Sender.io",
};

const SessionPage = () => {
  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1>Sessão WhatsApp</h1>
        <p>Gerencie a conexão com o WhatsApp</p>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusSession />
        <ConnectSession />
      </section>
    </div>
  );
};

export default SessionPage;
