"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCampaign } from "../actions/delete-campaign";
import { useRouter } from "next/navigation";

interface DeleteCampaignButtonProps {
  campaignId: string;
}

export const DeleteCampaignButton = ({
  campaignId,
}: DeleteCampaignButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const { success, message } = await deleteCampaign(campaignId);
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
      className="text-destructive h-8 w-8"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};
