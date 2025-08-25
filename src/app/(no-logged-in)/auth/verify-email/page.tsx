import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface VerifyEmailProps {
  searchParams: Promise<{ email?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailProps) => {
  const { email } = await searchParams;

  if (!email) redirect("/auth");
  return (
    <main className="flex flex-1 items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="px-6 pt-8 pb-6">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                <Mail className="text-primary h-8 w-8" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-foreground text-2xl font-semibold">
                Verifique seu email
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Enviamos um link mágico para <strong>{email}</strong>. Clique no
                link para acessar sua conta.
              </p>
            </div>

            <div className="bg-accent/50 rounded-lg p-6 text-left">
              <h4 className="text-accent-foreground mb-2 font-medium">
                O que fazer agora:
              </h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Abra seu email</li>
                <li>• Procure por nossa mensagem</li>
                <li>• Clique no link para fazer login</li>
              </ul>
            </div>

            <p className="text-muted-foreground text-xs">
              Não recebeu o email? Verifique sua pasta de spam ou tente
              novamente.
            </p>

            <Link href="/auth" className={cn(buttonVariants(), "w-full")}>
              Voltar
              <ArrowRight className="mr-2 h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default VerifyEmailPage;
