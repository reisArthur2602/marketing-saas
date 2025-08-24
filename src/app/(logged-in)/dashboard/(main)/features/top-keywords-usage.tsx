import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopKeywordsProps {
  keywords: {
    keywordId: string | null;
    count: number;
    keyword: string;
  }[];
}
export const TopKeywords = ({ keywords }: TopKeywordsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Palavras Chaves mais usadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keywords.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge
                  variant="secondary"
                  className="flex h-6 w-6 items-center justify-center text-xs"
                >
                  {index + 1}
                </Badge>
                <span className="text-foreground font-medium">
                  {item.keyword}
                </span>
              </div>
              <span className="text-primary text-sm font-semibold">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
