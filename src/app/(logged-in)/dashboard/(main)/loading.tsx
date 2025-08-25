import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const DashboardLoading = () => {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1>Dashboard</h1>
        <p>Visão geral das suas automações WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-[470px] rounded-2xl" />
        <Skeleton className="h-[470px] rounded-2xl" />
      </div>
    </div>
  );
};

export default DashboardLoading;
