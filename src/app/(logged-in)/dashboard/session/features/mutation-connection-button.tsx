"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Smartphone, X } from "lucide-react";
import { useTransition } from "react";
import { zapIO } from "@/http/zapIO";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteWhatsAppSession } from "../actions/delete-whatsapp-session";

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
  const isRemoving = (sessionId && !connected) || (sessionId && connected);

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

  const handleLogout = () => {
    startTransition(async () => {
      if (!sessionId) return;
      const logout = await zapIO.logout({ sessionId });
      if (!logout.success) {
        toast.error(logout.message);
        return;
      }
      await deleteWhatsAppSession({ sessionId });
      toast.success(logout.message);
    });
  };

  const renderButtonContent = () => {
    if (isPending) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {isRemoving ? "Removendo..." : "Conectando..."}
        </>
      );
    }

    if (!sessionId) {
      return (
        <>
          <Smartphone className="h-4 w-4" />
          Conectar WhatsApp
        </>
      );
    }

    return (
      <>
        <X className="h-4 w-4" />
        Remover Sessão
      </>
    );
  };

  return (
    <Button
      className="mt-auto"
      onClick={isRemoving ? handleLogout : handleConnect}
      disabled={isPending} 
     
    >
      {renderButtonContent()}
    </Button>
  );
};
