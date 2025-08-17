import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-js";
import { Chrome, Mail } from "lucide-react";

export const AuthForm = () => {
  const handleLogin = async (form: FormData) => {
    "use server";
    const provider = form.get("provider") as "google";
    await signIn(provider, { redirectTo: "/dashboard" });
  };

  return (
    <form action={handleLogin} className="flex max-w-sm flex-col gap-6">
      <div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Logo />
            <h2>Bem-vindo de volta</h2>
            <p>Acesse sua conta, ou crie gratuitamente</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
            <Button className="w-full">
              <Mail /> Entrar com email
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="text-muted-foreground relative z-10 px-2">
              Ou continue com
            </span>
          </div>

          <Button variant="outline" value="google" name="provider">
            <Chrome />
            Continuar com Google
          </Button>
        </div>
      </div>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </form>
  );
};
