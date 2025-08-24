import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPhoneNumber } from "@/lib/utils";
import { Prisma } from "@prisma/client";

interface RecentMessagesProps {
  messages: Prisma.MessageLogGetPayload<{ include: { keyword: true } }>[];
}
export const RecentMessages = ({ messages }: RecentMessagesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensagens Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className="border-border border-b py-2 last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center space-x-2">
                    <span className="text-foreground text-sm font-medium">
                      {formatPhoneNumber(message.phone)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {message.receivedAt.toLocaleTimeString("pt-br", {
                        minute: "2-digit",
                        hour: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm">{message.content}</p>

                  <Badge variant="outline" className="text-xs">
                    {message.keyword?.word}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
