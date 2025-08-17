import { ScheduleSession } from "./schedule-session";

import { Metadata } from "next";
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

      <ScheduleSession />
    </div>
  );
};

export default SessionPage;
