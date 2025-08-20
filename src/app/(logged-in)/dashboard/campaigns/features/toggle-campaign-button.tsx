"use client";

import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { toggleCampaignActive } from "../actions/toggle-campaign-active";

interface ToggleCampaignButtonProps {
  campaignId: string;
  isActive: boolean;
}

export const ToggleCampaignButton = ({
  campaignId,
  isActive,
}: ToggleCampaignButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      const { success, message } = await toggleCampaignActive(campaignId);
      if (!success) {
        toast.error(message.title, { description: message.description });
        return;
      }
      toast.success(message.title, { description: message.description });
      router.refresh();
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  );
};
