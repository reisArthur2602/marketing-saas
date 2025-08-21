import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Template } from "@prisma/client";
import { Edit, Eye, MessageSquare, Trash2 } from "lucide-react";
import { UpsertTemplateDialog } from "./upsert-template-dialog";
import { PreviewTemplateDialog } from "./preview-template-dialog";
import { DeleteTemplateAlert } from "./delete-template-alert";

interface TemplateCardProps {
  template: Template;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <Card key={template.id} className="transition-smooth hover:shadow-md">
      <CardHeader className="flex items-start justify-between">
        <CardTitle>{template.name}</CardTitle>

        <div className="flex gap-2">
          <UpsertTemplateDialog template={template}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </UpsertTemplateDialog>
          <DeleteTemplateAlert templateId={template.id}>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteTemplateAlert>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center space-x-2">
            <MessageSquare className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Preview:</span>
          </div>
          <div className="bg-accent/20 rounded-lg p-3">
            <p className="text-muted-foreground line-clamp-3 text-sm">
              {template.text}
            </p>
          </div>
        </div>

        <PreviewTemplateDialog template={template}>
          <Button variant="outline" size="sm">
            <Eye className="h-3 w-3" />
            Ver Completo
          </Button>
        </PreviewTemplateDialog>
      </CardContent>
    </Card>
  );
};
