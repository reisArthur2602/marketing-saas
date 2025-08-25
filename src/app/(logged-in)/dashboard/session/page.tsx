export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { ManageSession } from "./features/manage-session";

export const metadata: Metadata = {
  title: "Sessão | Sender.io",
};

const SessionPage = async () => {
  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1>Sessão WhatsApp</h1>
        <p>Gerencie a conexão com o WhatsApp</p>
      </div>

      <ManageSession />
    </div>
  );
};

export default SessionPage;
