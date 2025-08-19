import { Button } from "@/components/ui/button";
import { CalendarX, Send, Settings } from "lucide-react";
import { ManageKeywordsSheet } from "./features/manage-keywords-sheet";
import { getKeywords } from "./actions/get-keywords";
import { ManageExceptionsSheet } from "./features/manage-exceptions-sheet";
import { getExceptions } from "./actions/get-exception";

const CampaignsPage = async () => {
  const keywords = await getKeywords();
  const exceptions = await getExceptions();
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
          <Button>
            <Send />
            Criar Campanha
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
