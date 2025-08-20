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

import { ReactNode } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Calendar, Tags, Trash2 } from "lucide-react";
import {
  createExceptionSchema,
  CreateExceptionSchemaForm,
} from "../schema/create-exception-schema";
import { Exception } from "@prisma/client";
import { createException } from "../actions/create-exception";

interface ManageExceptionsSheetProps {
  exceptions: Exception[];
  children: ReactNode;
}

export const ManageExceptionsSheet = ({
  exceptions,
  children,
}: ManageExceptionsSheetProps) => {
  const methods = useForm<CreateExceptionSchemaForm>({
    resolver: zodResolver(createExceptionSchema),
    defaultValues: {
      date: new Date(),
      description: "",
    },
  });

  const handleCreateExceptions = async (data: CreateExceptionSchemaForm) => {
    const { success, message } = await createException(data);
    if (!success) {
      toast.error(message.title, { description: message.description });
      return;
    }
    methods.reset();
    toast.success(message.title, { description: message.description });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="p-6">
        <SheetHeader className="p-0">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5" />
            Gerenciar Datas de Exceção
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <Form {...methods}>
          <form
            className="flex flex-col gap-2"
            onSubmit={methods.handleSubmit(handleCreateExceptions)}
          >
            <FormField
              control={methods.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Exceção</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Descrição (opcional)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={methods.formState.isSubmitting}>
              Adicionar Nova Data de Exceção
            </Button>
          </form>
        </Form>

        <div className="space-y-3">
          <Label>Datas de Exceção Cadastradas</Label>
          <div className="max-h-[400px] space-y-2 overflow-y-auto">
            {exceptions.map((exception) => (
              <div
                key={exception.id}
                className="border-border bg-card flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {new Date(exception.date).toLocaleDateString("pt-BR")}
                  </span>
                  {exception.description && (
                    <span className="text-muted-foreground text-xs">
                      {exception.description}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
