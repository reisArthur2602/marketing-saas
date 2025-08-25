import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const CampaignsLoading = () => {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1>Campanhas</h1>
        <p>Gerencie suas campanhas automatizadas</p>
      </div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[270] rounded-2xl" />
        <Skeleton className="h-[270] rounded-2xl" />
        <Skeleton className="h-[270] rounded-2xl" />
        <Skeleton className="h-[270] rounded-2xl" />
        <Skeleton className="h-[270] rounded-2xl" />
        <Skeleton className="h-[270] rounded-2xl" />
      </section>
    </div>
  );
};

export default CampaignsLoading;
