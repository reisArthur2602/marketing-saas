import { Metadata } from "next";
import { StatusSession } from "./features/status-session";
import { ConnectSession } from "./features/connect-session";
import { getWhatsAppSession } from "./actions/get-whatsapp-session";

export const metadata: Metadata = {
  title: "Sessão | Sender.io",
};

const SessionPage = async () => {
  const whatsAppSession = await getWhatsAppSession();
  const connected = !!whatsAppSession?.connected;
  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1>Sessão WhatsApp</h1>
        <p>Gerencie a conexão com o WhatsApp</p>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusSession
          connected={connected}
          createdAt={whatsAppSession && whatsAppSession.createdAt}
          updatedAt={whatsAppSession && whatsAppSession.updatedAt}
        />
        <ConnectSession
          sessionId={whatsAppSession && whatsAppSession.sessionId}
          qrCode={whatsAppSession && whatsAppSession.qrCode}
        />
      </section>
    </div>
  );
};

export default SessionPage;
