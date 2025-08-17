import { Button } from "@/components/ui/button";
import {
  Edit,
  Eye,
  MessageCircleMoreIcon,
  MessageSquare,
  Trash2,
} from "lucide-react";

import React from "react";
import { UpsertTemplateDialog } from "./features/upsert-template-dialog";
import { getTemplates } from "./actions/get-templates";

import { TemplateCard } from "./features/template-card";

const TemplatesPage = async () => {
  const templates = await getTemplates();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Templates</h1>
          <p>Gerencie suas respostas automáticas</p>
        </div>
        <UpsertTemplateDialog>
          <Button>
            <MessageCircleMoreIcon />
            Criar Template
          </Button>
        </UpsertTemplateDialog>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {templates.map((template) => (
          <TemplateCard template={template} key={template.id} />
        ))}
      </section>
    </div>
  );
};

export default TemplatesPage;
