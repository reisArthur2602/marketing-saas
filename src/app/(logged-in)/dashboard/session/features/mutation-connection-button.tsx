"use client";

import { Button } from "@/components/ui/button";
import { Loader2, QrCode, Smartphone, WifiOff } from "lucide-react";
import { useTransition } from "react";
import { zapIO } from "@/http/zapIO";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MutationConnectionButtonProps {
  connected: boolean;
  sessionId?: string;
}

export const MutationConnectionButton = ({
  connected,
  sessionId,
}: MutationConnectionButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleConnect = () => {
    startTransition(async () => {
      const connectSession = await zapIO.connectSession();
      if (!connectSession.success) {
        toast.error(connectSession.message);
        return;
      }
      toast.success(connectSession.message);

      const configWebhook = await zapIO.configWebhook({
        sessionId: connectSession.data.sessionId,
      });
      if (!configWebhook.success) {
        toast.error(configWebhook.message);
        return;
      }
      toast.success(configWebhook.message);
      router.refresh();
    });
  };

  const handleDisconnect = () => {
    startTransition(async () => {
      if (!sessionId) return;
      const logout = await zapIO.logout({ sessionId });
      if (!logout.success) {
        toast.error(logout.message);
        return;
      }
      toast.success(logout.message);
      router.refresh();
    });
  };

  // Disable only while pending or when a session exists but is not yet connected (waiting for QR)
  const isDisabled = isPending || (!!sessionId && !connected);

  const renderButtonContent = () => {
    if (isPending) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Conectando...
        </>
      );
    }

    if (connected) {
      return (
        <>
          <WifiOff className="h-4 w-4" />
          Desconectar
        </>
      );
    }

    if (!!sessionId && !connected) {
      return (
        <>
          <QrCode className="h-4 w-4" />
          Aguardando QR Code
        </>
      );
    }

    return (
      <>
        <Smartphone className="h-4 w-4" />
        Conectar WhatsApp
      </>
    );
  };

  return (
    <Button
      className="mt-auto"
      onClick={connected ? handleDisconnect : handleConnect}
      disabled={isDisabled}
    >
      {renderButtonContent()}
    </Button>
  );
};
