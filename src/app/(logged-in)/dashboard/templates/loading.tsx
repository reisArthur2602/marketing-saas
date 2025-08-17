import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircleMoreIcon } from "lucide-react";

const TemplateLoading = () => {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Templates</h1>
          <p>Gerencie suas respostas automáticas</p>
        </div>

        <Button>
          <MessageCircleMoreIcon />
          Criar Template
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton className="h-[270px]" />
        <Skeleton className="h-[270px]" />
        <Skeleton className="h-[270px]" />
        <Skeleton className="h-[270px]" />
      </section>
    </div>
  );
};

export default TemplateLoading;
