import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Template } from "@prisma/client";
import React, { ReactNode } from "react";

interface PreviewTemplateDialogProps {
  template: Template;
  children: ReactNode;
}
export const PreviewTemplateDialog = ({
  template,
  children,
}: PreviewTemplateDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Preview do Template</DialogTitle>
        </DialogHeader>
        {template && (
          <div className="space-y-4">
            <Label className="text-muted-foreground text-sm font-medium">
              {template.name}
            </Label>

            <div className="bg-primary/5 border-primary rounded border-l-4 p-4">
              <div className="text-sm whitespace-pre-wrap">{template.text}</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
