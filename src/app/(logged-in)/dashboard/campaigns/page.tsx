import { Button } from "@/components/ui/button";
import {
  CalendarX,
  Clock,
  Edit,
  MessageSquare,
  Pause,
  Send,
  Settings,
  Target,
  Trash2,
  Play,
} from "lucide-react";

import { ManageKeywordsSheet } from "./features/manage-keywords-sheet";
import { getKeywords } from "./actions/get-keywords";
import { ManageExceptionsSheet } from "./features/manage-exceptions-sheet";
import { getExceptions } from "./actions/get-exception";
import { UpsertCampaignDialog } from "./features/upsert-campaign-dialog";
import { getTemplates } from "../templates/actions/get-templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getCampaigns } from "./actions/get-campaigns";
import { getWeekDayLabel } from "@/utils/week-days";

const CampaignsPage = async () => {
  const keywords = await getKeywords();
  const exceptions = await getExceptions();
  const templates = await getTemplates();
  const campaigns = await getCampaigns();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Campanhas</h1>
          <p>Gerencie suas campanhas automatizadas</p>
        </div>

        <div className="space-x-4">
          <ManageKeywordsSheet keywords={keywords}>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Gerenciar Palavras-chave
            </Button>
          </ManageKeywordsSheet>
          <ManageExceptionsSheet exceptions={exceptions}>
            <Button variant="outline">
              <CalendarX className="mr-2 h-4 w-4" />
              Gerenciar Exceções
            </Button>
          </ManageExceptionsSheet>
          <UpsertCampaignDialog
            templates={templates}
            keywords={keywords}
            exceptions={exceptions}
          >
            <Button>
              <Send />
              Criar Campanha
            </Button>
          </UpsertCampaignDialog>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id} className="transition-smooth hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">
                    {campaign.name}
                  </CardTitle>
                  <Badge className="mb-2">Ativo</Badge>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    {campaign.isActive ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                {campaign.daysOfWeek.slice(0, 3).map((day, index) => (
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
                  {new Date(campaign.startTime).toISOString().slice(11, 16)} -{" "}
                  {new Date(campaign.endTime).toISOString().slice(11, 16)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignsPage;
