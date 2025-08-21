"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ReactNode, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  createKeywordSchema,
  CreateKeywordSchemaForm,
} from "../schema/create-keyword-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createKeyword } from "../actions/create-keyword";
import { toast } from "sonner";
import { getKeywords } from "../actions/get-keywords";
import { ReturnAsyncType } from "@/utils/return-async-type";
import { MessageSquare, Tags, Trash2 } from "lucide-react";
import { deleteKeyword } from "../actions/delete-keyword";

interface ManageKeywordsSheetProps {
  keywords: ReturnAsyncType<typeof getKeywords>;
  children: ReactNode;
}

export const ManageKeywordsSheet = ({
  keywords,
  children,
}: ManageKeywordsSheetProps) => {
  const methods = useForm<CreateKeywordSchemaForm>({
    resolver: zodResolver(createKeywordSchema),
    defaultValues: {
      word: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const word = methods.watch("word");

  const handleCreateKeyword = async (data: CreateKeywordSchemaForm) => {
    const { success, message } = await createKeyword({ word: data.word });
    if (!success) {
      toast.error(message.title, { description: message.description });
      return;
    }
    methods.reset();
    toast.success(message.title, { description: message.description });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const { success, message } = await deleteKeyword(id);
      if (!success) {
        toast.error(message.title, { description: message.description });
        return;
      }
      toast.success(message.title, { description: message.description });
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader className="text-base">
          <SheetTitle className="text-base">Gerenciar Palavras-chave</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <Form {...methods}>
          <form
            className="flex flex-col gap-2"
            onSubmit={methods.handleSubmit(handleCreateKeyword)}
          >
            <FormField
              control={methods.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palavra-chave</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a palavra-chave" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!word || methods.formState.isSubmitting}>
              Adicionar Nova Palavra-chave
            </Button>
          </form>
        </Form>
        {keywords.length > 0 && (
          <>
            <div className="space-y-3">
              <Label>Palavras-chave Cadastradas</Label>
              {keywords.length === 0 ? (
                <div className="border-border text-muted-foreground bg-card flex flex-col items-center justify-center gap-2 rounded-lg border p-6 text-sm">
                  <MessageSquare className="h-5 w-5" />
                  <span>Nenhuma palavra-chave cadastrada.</span>
                </div>
              ) : (
                <div className="max-h-[400px] space-y-2 overflow-y-auto">
                  {keywords.map((keyword) => (
                    <div
                      key={keyword.id}
                      className="border-border bg-card flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span>{keyword.word}</span>
                        {keyword.campaigns.some((c) => c.isActive) && (
                          <Badge>Em uso</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive h-8 w-8"
                        onClick={() => handleDelete(keyword.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
