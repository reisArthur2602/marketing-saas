"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import {
  UpsertDefaultTemplateForm,
  upsertDefaultTemplateSchema,
} from "../schema/upsert-default-template";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateDefaultTemplate } from "../actions/upsert-default-template";
import { toast } from "sonner";

interface UpdateDefaultTemplateDialogProps {
  children: ReactNode;
  text: string;
  userId: string;
}

export const UpdateDefaultTemplateDialog = ({
  children,
  text,
  userId,
}: UpdateDefaultTemplateDialogProps) => {
  const [open, setOpen] = useState(false);
  const methods = useForm({
    resolver: zodResolver(upsertDefaultTemplateSchema),
    defaultValues: { text: text || "" },
  });

  const handleUpdateDefaultTemplate = async (
    data: UpsertDefaultTemplateForm,
  ) => {
    const { success, message } = await updateDefaultTemplate({
      text: data.text,
      userId,
    });

    if (!success) {
      toast.error(message.title, { description: message.description });
      return;
    }

    toast.success(message.title, { description: message.description });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Template Padrão</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleUpdateDefaultTemplate)}
            className="space-y-4"
          >
            <FormField
              control={methods.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo da Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite o conteúdo da mensagem padrão..."
                      className="min-h-[250px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {" "}
                    Esta mensagem será enviada quando nenhuma palavra-chave for
                    identificada na mensagem do cliente.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button>Salvar Template</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
