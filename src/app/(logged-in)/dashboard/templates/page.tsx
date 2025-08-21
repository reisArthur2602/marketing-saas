import { Button } from "@/components/ui/button";
import {
  MessageCircleMore,
  MessageCircleMoreIcon,
  Settings,
} from "lucide-react";

import React from "react";
import { UpsertTemplateDialog } from "./features/upsert-template-dialog";
import { getTemplates } from "./actions/get-templates";

import { TemplatesList } from "./features/templates-list";
import { Empty } from "@/components/shared/empty";

import { currentUser } from "@/lib/auth-js";

import { UpdateDefaultTemplateDialog } from "./features/update-default-template-dialog";

const TemplatesPage = async () => {
  const templates = await getTemplates();
  const user = await currentUser();
  const defaultTemplate = user?.defaultFallbackMessage || "";

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Templates</h1>
          <p>Gerencie suas respostas automáticas</p>
        </div>
        <div className="space-x-4">
          <UpdateDefaultTemplateDialog
            text={defaultTemplate}
            userId={user?.id as string}
          >
            <Button variant="outline">
              <Settings />
              Configurar Template Padrão
            </Button>
          </UpdateDefaultTemplateDialog>
          <UpsertTemplateDialog>
            <Button>
              <MessageCircleMoreIcon />
              Criar Template
            </Button>
          </UpsertTemplateDialog>
        </div>
      </div>

      {templates.length === 0 ? (
        <Empty
          icon={MessageCircleMore}
          title="Nenhum template criado"
          description="Crie seu primeiro template para começar a enviar mensagens personalizadas e automatizar sua comunicação."
        />
      ) : (
        <TemplatesList templates={templates} />
      )}
    </div>
  );
};

export default TemplatesPage;
