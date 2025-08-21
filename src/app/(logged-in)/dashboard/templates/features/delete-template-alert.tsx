"use client";

import { ReactNode } from "react";
import { toast } from "sonner";

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
import { deleteTemplate } from "../actions/delete-template";

interface DeleteTemplateButtonProps {
  templateId: string;
  children: ReactNode;
}

export const DeleteTemplateAlert = ({
  templateId,
  children,
}: DeleteTemplateButtonProps) => {
  const handleDeleteTemplate = async () => {
    const { success, message } = await deleteTemplate(templateId);
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
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteTemplate}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
