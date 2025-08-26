export const revalidate = 10000


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MessageSquare } from "lucide-react";
import { Metadata } from "next";
import { getDashboardData } from "./actions/get-dashboard-data";
import { RecentMessages } from "./features/recent-messages";
import { TopKeywords } from "./features/top-keywords-usage";

export const metadata: Metadata = {
  title: "Dashboard | Sender.io",
};

const DashboardPage = async () => {
  const {
    messageCount,
    activeCampaignsCount,
    topKeywordsUsage,
    recentMessages,
  } = await getDashboardData();

  const metrics = [
    {
      title: "Mensagens Recebidas",
      value: messageCount,
      change: "+12%",
      icon: MessageSquare,
      trend: "up",
    },
    {
      title: "Campanhas Ativas",
      value: activeCampaignsCount,
      change: "+2",
      icon: Activity,
      trend: "up",
    },
    {
      title: "Em Desenvolvimento",
      value: 0,
      change: "+2",
      icon: Activity,
      trend: "up",
    },
    {
      title: "Em Desenvolvimento",
      value: 0,
      change: "+2",
      icon: Activity,
      trend: "up",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1>Dashboard</h1>
        <p>Visão geral das suas automações WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="transition-smooth hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-foreground text-2xl font-bold">
                  {metric.value}
                </div>
                <p
                  className={`flex items-center space-x-1 text-xs ${
                    metric.trend === "up" ? "text-primary" : "text-destructive"
                  }`}
                >
                  <span>{metric.change}</span>
                  <span className="text-muted-foreground">vs mês anterior</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <TopKeywords keywords={topKeywordsUsage} />
        <RecentMessages messages={recentMessages} />
      </div>
    </div>
  );
};

export default DashboardPage;
