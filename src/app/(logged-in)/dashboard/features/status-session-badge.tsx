import { Badge } from "@/components/ui/badge";
import { getWhatsAppSession } from "../session/actions/get-whatsapp-session";

export const StatusSessionBadge = async () => {
  const session = await getWhatsAppSession();
  const isConnected = session?.connected;

  const badgeClass = isConnected
    ? "text-primary gap-1.5"
    : "text-destructive gap-1.5";

  const dotClass = isConnected
    ? "bg-primary size-1.5 rounded-full"
    : "bg-destructive size-1.5 rounded-full";

  return (
    <Badge variant="outline" className={badgeClass}>
      <span className={dotClass} aria-hidden="true" />
      {isConnected ? "Online" : "Offline"}
    </Badge>
  );
};
