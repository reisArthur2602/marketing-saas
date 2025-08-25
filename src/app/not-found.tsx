"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileQuestion, Home } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <main className="flex flex-1 items-center justify-center p-6 md:p-10">
      <Card className="border-border w-full max-w-md">
        <CardContent className="p-8">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                <FileQuestion className="text-primary h-8 w-8" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-foreground text-2xl font-bold">
                Página não encontrada
              </h1>
              <p className="text-muted-foreground">
                A página que você está procurando não existe ou foi movida
              </p>
            </div>

            <Link href="/auth" className={buttonVariants()}>
              Voltar ao início <ArrowRight className="mr-2" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default NotFoundPage;
