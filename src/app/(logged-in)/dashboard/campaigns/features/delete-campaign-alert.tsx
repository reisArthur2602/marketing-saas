"use client";

import { ReactNode } from "react";
import { toast } from "sonner";
import { deleteCampaign } from "../actions/delete-campaign";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteCampaignButtonProps {
  campaignId: string;
  children: ReactNode;
}

export const DeleteCampaignAlert = ({
  campaignId,
  children,
}: DeleteCampaignButtonProps) => {
  const handleDeleteCampaign = async () => {
    const { success, message } = await deleteCampaign(campaignId);
    if (!success) {
      toast.error(message.title, { description: message.description });
      return;
    }
    toast.success(message.title, { description: message.description });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja realmente excluir?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não poderá ser desfeita. O item será removido
            permanentemente do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDeleteCampaign}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteCampaign}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
