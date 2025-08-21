"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign, Exception, Template } from "@prisma/client";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createCampaignSchema,
  CreateCampaignSchemaForm,
} from "../schema/create-campaign-schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MultiSelect } from "./multi-select";
import { ReturnAsyncType } from "@/utils/return-async-type";
import { getKeywords } from "../actions/get-keywords";
import { toast } from "sonner";
import { upsertCampaign } from "../actions/upsert-campaign";

interface UpsertCampaignDialogProps {
  campaign?: Campaign & {
    keywords: { id: string }[];
    exceptions: { id: string }[];
  };
  keywords: ReturnAsyncType<typeof getKeywords>;
  templates: Template[] | [];
  exceptions: Exception[];
  children: ReactNode;
}

export const weekDaysOptions = [
  { id: 1, label: "Segunda-feira" },
  { id: 2, label: "Terça-feira" },
  { id: 3, label: "Quarta-feira" },
  { id: 4, label: "Quinta-feira" },
  { id: 5, label: "Sexta-feira" },
  { id: 6, label: "Sábado" },
  { id: 0, label: "Domingo" },
];

const formatTimeLocalHHmm = (dateLike: string | Date) => {
  const d = new Date(dateLike);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

export const UpsertCampaignDialog = ({
  campaign,
  exceptions,
  children,
  templates,
  keywords,
}: UpsertCampaignDialogProps) => {
  const [open, setOpen] = useState(false);
  const methods = useForm<CreateCampaignSchemaForm>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: campaign
      ? {
          name: campaign.name,
          templateId: campaign.templateId,
          daysOfWeek: campaign.daysOfWeek,
          startTime: formatTimeLocalHHmm(campaign.startTime),
          endTime: formatTimeLocalHHmm(campaign.endTime),
          keywords: campaign.keywords.map((k) => k.id),
          exceptions: campaign.exceptions.map((e) => e.id),
        }
      : {
          name: "",
          templateId: "",
          daysOfWeek: [],
          startTime: "08:00",
          endTime: "18:00",
          keywords: [],
          exceptions: [],
        },
  });

  const isLoading = methods.formState.isSubmitting;

  const keywordOptions = keywords.filter((k) => {
    const isActive = k.campaigns.some((c) => c.isActive);

    if (campaign?.keywords.some((kw) => kw.id === k.id)) {
      return true;
    }

    return !isActive;
  });

  const handleUpsertCampaign = async (data: CreateCampaignSchemaForm) => {
    const { success, message } = await upsertCampaign({
      ...data,
      id: campaign?.id,
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
          <DialogTitle>
            {campaign ? "Editar Campanha" : "Nova Campanha"}
          </DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleUpsertCampaign)}
            className="space-y-4"
          >
            {/* Nome */}
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Campanha</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Campanha de Preços" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Template */}
            <FormField
              control={methods.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Vinculado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dias da semana */}
            <FormField
              control={methods.control}
              name="daysOfWeek"
              render={() => (
                <FormItem>
                  <FormLabel>Dias da Semana</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {weekDaysOptions.map((day) => (
                      <FormField
                        key={day.id}
                        control={methods.control}
                        name="daysOfWeek"
                        render={({ field }) => (
                          <FormItem
                            key={day.id}
                            className="flex flex-row items-start space-y-0 space-x-3"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(day.id)}
                                onCheckedChange={(checked) =>
                                  checked
                                    ? field.onChange([...field.value, day.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== day.id,
                                        ),
                                      )
                                }
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {day.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Horários */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={methods.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Inicial</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Final</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Keywords */}
            <FormField
              control={methods.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palavras-chave</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={keywordOptions.map((k) => ({
                        value: k.id,
                        label: k.word,
                      }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Selecione palavras-chave"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Exceptions */}
            <FormField
              control={methods.control}
              name="exceptions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exceções</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={exceptions.map((ex) => ({
                        value: ex.id,
                        label:
                          ex.description ||
                          new Date(ex.date).toLocaleDateString("pt-BR"),
                      }))}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Selecione exceções"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ações */}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {campaign ? "Salvando..." : "Criando..."}
                </>
              ) : campaign ? (
                "Salvar alterações"
              ) : (
                "Criar Campanha"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
