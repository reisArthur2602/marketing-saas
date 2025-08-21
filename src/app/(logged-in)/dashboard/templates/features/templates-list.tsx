import { Template } from "@prisma/client";
import { TemplateCard } from "./template-card";

interface TemplatesListProps {
  templates: Template[];
}

export const TemplatesList = ({ templates }: TemplatesListProps) => {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {templates.map((template) => (
        <TemplateCard template={template} key={template.id} />
      ))}
    </section>
  );
};
