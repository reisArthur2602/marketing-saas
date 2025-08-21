import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const Empty = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <Card className="bg-card/40 border-2 border-dashed">
      <CardContent className="flex items-center justify-center p-12">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="text-primary bg-primary/30 flex size-18 items-center justify-center rounded-full">
              <Icon className="size-8" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground/50 mx-auto max-w-md text-sm">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
