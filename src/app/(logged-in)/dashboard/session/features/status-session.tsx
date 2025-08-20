import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, timeAgo } from "@/utils/date";

import { getWhatsAppSession } from "../actions/get-whatsapp-session";
import { MutationConnectionButton } from "./mutation-connection-button";
import { AutoRefresh } from "./auto-refresh";

export const StatusSession = async () => {
  const whatsAppSession = await getWhatsAppSession();
  const connected = !!whatsAppSession?.connected;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Status da Sessão</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
        <AutoRefresh active={!connected} intervalMs={2000} />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Estado:</span>
          {connected ? (
            <Badge>Conectado</Badge>
          ) : (
            <Badge variant="outline">Desconectado</Badge>
          )}
        </div>

        {connected ? (
          <p>WhatsApp está conectado</p>
        ) : (
          <p>WhatsApp não está conectado</p>
        )}

        {connected &&
          whatsAppSession?.createdAt &&
          whatsAppSession?.updatedAt && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conectado desde:</span>
                <span className="font-medium">
                  {formatDate(whatsAppSession.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atividade:</span>
                <span className="font-medium">
                  {timeAgo(whatsAppSession.updatedAt)}
                </span>
              </div>
            </div>
          )}

        <MutationConnectionButton
          connected={connected}
          sessionId={whatsAppSession?.sessionId}
        />
      </CardContent>
    </Card>
  );
};
