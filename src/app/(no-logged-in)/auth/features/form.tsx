import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-js";
import { Chrome, Mail } from "lucide-react";

type Provider = "google" | "nodemailer";

export const AuthForm = () => {
  const handleLogin = async (form: FormData) => {
    "use server";

    const provider = form.get("provider") as Provider;

    switch (provider) {
      case "google":
        await signIn(provider, { redirectTo: "/dashboard" });
        break;
      case "nodemailer":
        const email = form.get("email") as string;
        await signIn(provider, { email, redirectTo: "/dashboard" });
        break;
    }
  };

  return (
    <div className="flex max-w-sm flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Logo />
        <div>
          <h1 className="text-lg font-semibold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground text-sm">
            Acesse sua conta, ou crie gratuitamente
          </p>
        </div>
      </div>

      <form action={handleLogin} className="flex flex-col gap-4">
        <input type="hidden" name="provider" value="nodemailer" />
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
          />
        </div>
        <Button className="w-full">
          <Mail /> Enviar código
        </Button>
      </form>

      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="text-muted-foreground relative z-10 px-2">
          Ou continue com
        </span>
      </div>

      <form action={handleLogin}>
        <input type="hidden" name="provider" value="google" />
        <Button variant="outline" className="w-full">
          <Chrome />
          Continuar com Google
        </Button>
      </form>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  );
};
