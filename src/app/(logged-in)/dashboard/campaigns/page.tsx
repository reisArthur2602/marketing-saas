export const revalidate = 10000;

import { Button } from "@/components/ui/button";
import { CalendarX, Send, SendIcon, Settings } from "lucide-react";

import { ManageKeywordsSheet } from "./features/manage-keywords-sheet";
import { ManageExceptionsSheet } from "./features/manage-exceptions-sheet";
import { UpsertCampaignDialog } from "./features/upsert-campaign-dialog";

import { CampaignsList } from "./features/campaigns-list";
import { Empty } from "@/components/shared/empty";
import { Metadata } from "next";
import { getCampaignsData } from "./actions/get-campaigns-data";

export const metadata: Metadata = {
  title: "Campanhas | Sender.io",
};

const CampaignsPage = async () => {
  const { campaigns, availableKeywords, exceptions, keywords, templates } =
    await getCampaignsData();

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
            availableKeywords={availableKeywords}
            exceptions={exceptions}
          >
            <Button>
              <Send />
              Criar Campanha
            </Button>
          </UpsertCampaignDialog>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <Empty
          icon={SendIcon}
          title="Nenhuma campanha encontrada"
          description="Inicie criando uma campanha para alcançar seus clientes de forma eficiente e organizada."
        />
      ) : (
        <CampaignsList
          templates={templates}
          availableKeywords={availableKeywords}
          exceptions={exceptions}
          campaigns={campaigns}
        />
      )}
    </div>
  );
};

export default CampaignsPage;
