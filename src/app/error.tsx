"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <main className="flex flex-1 items-center justify-center p-6 md:p-10">
      <Card className="border-border w-full max-w-md">
        <CardContent className="p-8">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                <AlertTriangle className="text-primary h-8 w-8" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-foreground text-2xl font-bold">
                Ocorreu um erro inesperado
              </h1>
              <p className="text-muted-foreground">
                Não foi possível carregar o conteúdo. Tente novamente em alguns
                instantes.
              </p>
            </div>

            <Link href="/auth" className={cn(buttonVariants(), "w-full")}>
              Voltar ao início <ArrowRight className="mr-2" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ErrorPage;
