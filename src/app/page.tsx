import { buttonVariants } from "@/components/ui/button";
import { Bot, MessageSquare } from "lucide-react";
import Link from "next/link";

const Home = () => {
  return <main className="p-6">
    <div className="border-border bg-card text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-lg border p-10 text-sm">
              <Bot className="h-6 w-6" />
              <span>
                Rota em desenvolvimento, aguarde atualizações...
              </span>
              <Link className={buttonVariants()} href='/auth'>Ir para pagina de login</Link>
            </div>


  </main>;
};

export default Home;
