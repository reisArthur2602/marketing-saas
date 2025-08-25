import { Metadata } from "next";

import { getWhatsAppSession } from "./actions/get-whatsapp-session";
import { ManageSession } from "./features/manage-session";

export const metadata: Metadata = {
  title: "Sessão | Sender.io",
};

const SessionPage = async () => {
  const session = await getWhatsAppSession();

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1>Sessão WhatsApp</h1>
        <p>Gerencie a conexão com o WhatsApp</p>
      </div>

      <ManageSession session={session} />
    </div>
  );
};

export default SessionPage;
