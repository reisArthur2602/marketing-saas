"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Template } from "@prisma/client";
import { ReactNode } from "react";
import { upsertTemplate } from "../actions/upsert-template";
import {
  UpsertTemplateForm,
  upsertTemplateSchema,
} from "../schema/upsert-template";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface UpsertTemplateDialogProps {
  template?: Template;
  children: ReactNode;
}

export const UpsertTemplateDialog = ({
  children,
  template,
}: UpsertTemplateDialogProps) => {
  const isEditing = !!template;

  const methods = useForm<UpsertTemplateForm>({
    resolver: zodResolver(upsertTemplateSchema),
    defaultValues: {
      name: template?.name || "",
      text: template?.text || "",
    },
  });

  const handleUpsertTemplate = async (data: UpsertTemplateForm) => {
    await upsertTemplate({
      name: data.name,
      text: data.text,
      templateId: template?.id,
    });

    toast.success(isEditing ? "Template atualizado!" : "Template criado!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Template" : "Novo Template"}
          </DialogTitle>
          <DialogDescription>
            Gerencie seus modelos de mensagem
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit(handleUpsertTemplate)}
          >
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Template</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Template de Boas-vindas"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo da Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite o conteúdo da mensagem automática..."
                      className="min-h-[200px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Você pode usar emojis e quebras de linha para tornar a
                    mensagem mais atrativa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button>{isEditing ? "Editar Template" : "Criar Template"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
