"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Smartphone, WifiOff } from "lucide-react";
import { createWhatsAppSession } from "../actions/create-whatsapp-session";
import { useTransition } from "react";
import axiosClient from "@/lib/axios";

interface StatusSessionProps {
  connected: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const StatusSession = ({
  connected,
  createdAt,
  updatedAt,
}: StatusSessionProps) => {
  const [isPending, startTransition] = useTransition();

  const formatDate = (date: Date) => {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const timeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes} min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h atrás`;
    const days = Math.floor(hours / 24);
    return `${days} dia(s) atrás`;
  };

  const handleConnect = () => {
    startTransition(async () => {
      try {
        const name = `sender.io-${crypto.randomUUID()}`;

        const { sessionId } = await axiosClient
          .post("/", { name })
          .then((res) => res.data);

        await createWhatsAppSession({ name, sessionId });

        await axiosClient.patch(
          "/webhook",
          {
            onReceive_webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhook/on-receive`,
            onChangeSession_webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhook/on-change-session`,
          },
          {
            headers: { Authorization: sessionId },
          },
        );

        console.log("Sessão conectada com sucesso!");
      } catch (error) {
        console.error("Erro ao conectar:", error);
      }
    });
  };

  const handleDisconnect = () => {
    startTransition(async () => {
      console.log("desconectei");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Status da Sessão</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4">
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

        {connected && createdAt && updatedAt && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Conectado desde:</span>
              <span className="font-medium">{formatDate(createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Última atividade:</span>
              <span className="font-medium">{timeAgo(updatedAt)}</span>
            </div>
          </div>
        )}

        <Button
          className="mt-auto"
          onClick={connected ? handleDisconnect : handleConnect}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Conectando...
            </>
          ) : connected ? (
            <>
              <WifiOff className="h-4 w-4" />
              Desconectar
            </>
          ) : (
            <>
              <Smartphone className="h-4 w-4" />
              Conectar WhatsApp
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
