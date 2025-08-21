"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Clock, MessageSquare } from "lucide-react";

import { getWeekDayLabel } from "@/utils/week-days";
import { UpsertCampaignDialog } from "./upsert-campaign-dialog";
import { ToggleCampaignButton } from "./toggle-campaign-button";
import { DeleteCampaignButton } from "./delete-campaign-button";
import { Exception, Prisma, Template } from "@prisma/client";

const formatLocalHHmm = (dateLike: string | Date) => {
  const d = new Date(dateLike);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

interface CampaignsListProps {
  campaigns: Prisma.CampaignGetPayload<{
    include: {
      keywords: true;
      exceptions: true;
      template: true;
    };
  }>[];
  keywords: Prisma.KeywordGetPayload<{
    include: {
      campaigns: true;
    };
  }>[];
  exceptions: Exception[];
  templates: Template[];
}

export const CampaignsList = ({
  campaigns,
  keywords,
  exceptions,
  templates,
}: CampaignsListProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns?.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <CardTitle className="text-lg font-semibold">
                  {campaign.name}
                </CardTitle>
                <Badge >
                  {campaign.isActive ? "Ativo" : "Pausado"}
                </Badge>
              </div>
              <div className="flex space-x-1">
                <UpsertCampaignDialog
                  campaign={campaign}
                  keywords={keywords}
                  exceptions={exceptions}
                  templates={templates}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </UpsertCampaignDialog>
                <ToggleCampaignButton
                  campaignId={campaign.id}
                  isActive={campaign.isActive}
                />
                <DeleteCampaignButton campaignId={campaign.id} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center space-x-2">
                <MessageSquare className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Template:</span>
              </div>
              <p className="text-muted-foreground text-sm">
                {campaign.template.name}
              </p>
            </div>

            <div className="flex flex-wrap gap-1">
              {campaign.daysOfWeek
                .slice(0, 3)
                .map((day: number, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {getWeekDayLabel(day)}
                  </Badge>
                ))}
              {campaign.daysOfWeek.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{campaign.daysOfWeek.length - 3}
                </Badge>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center space-x-2">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Horário:</span>
              </div>
              <p className="text-muted-foreground text-sm">
                {formatLocalHHmm(campaign.startTime)} -{" "}
                {formatLocalHHmm(campaign.endTime)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
