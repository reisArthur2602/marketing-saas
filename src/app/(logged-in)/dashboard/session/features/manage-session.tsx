import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppSession } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Loader2, QrCode, Smartphone, WifiOffIcon } from "lucide-react";
import { ScanAnimation } from "@/components/shared/scan-animation/scan-animation";

import { formatDate, timeAgo } from "@/utils/date";
import { connectSession } from "../actions/connect-session";
import { logoutSession } from "../actions/logout-session";

import generateQRCode from "qrcode";
import Image from "next/image";
import { AutoRefresh } from "@/components/shared/auto-refresh";

interface ManageSessionProps {
  session: WhatsAppSession | null;
}

export const ManageSession = async ({ session }: ManageSessionProps) => {
  if (!session)
    return (
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Status da Sessão</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-full flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>

                <Badge variant="outline">Desconectado</Badge>
              </div>

              <p>WhatsApp não está conectado</p>
            </div>

            <form
              className="mt-auto"
              action={async () => {
                "use server";
                await connectSession();
              }}
            >
              <Button className="w-full">
                <Smartphone /> Conectar WhatsApp
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conectar via QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="border-muted-foreground/30 bg-muted flex size-60 items-center justify-center rounded-lg border-2 border-dashed">
                <div className="space-y-2 text-center">
                  <QrCode className="mx-auto size-14" />
                  <p>Seu QR Code aparecerá aqui</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );

  // loading
  if (session.sessionId && !session.qrCode && !session.connected) {
    return (
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AutoRefresh active />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Status da Sessão</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-full flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <Badge variant="secondary">Conectando...</Badge>
              </div>

              <p>Escaneie o QR Code com seu WhatsApp</p>
            </div>

            <Button disabled className="mt-auto">
              <Loader2 className="animate-spin" />
              Gerando Qr Code
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conectar via QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mx-auto w-fit">
              <ScanAnimation />
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Esperando escanear qrCode
  if (session.sessionId && !session.connected && session.qrCode) {
    const qrCode = await generateQRCode.toDataURL(session.qrCode);

    return (
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Status da Sessão</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-full flex-col gap-4">
            <AutoRefresh active intervalMs={10000} />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <Badge variant="secondary">Conectando...</Badge>
              </div>

              <p>Escaneie o QR Code com seu WhatsApp</p>
            </div>

            <Button disabled className="mt-auto">
              <QrCode />
              Aguardando Conexão
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conectar via QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {qrCode && (
              <>
                <AutoRefresh active />
                <Image
                  src={qrCode}
                  alt="conectar qr-code"
                  width={256}
                  height={256}
                  priority
                  className="mx-auto rounded-lg"
                />
                <div className="space-y-2 text-center">
                  <h3>Escaneie o QR Code</h3>
                  <ol className="text-muted-foreground space-y-2 text-left text-sm">
                    <li>1. Abra o WhatsApp no seu celular</li>
                    <li>2. Vá em Menu → Dispositivos conectados</li>
                    <li>3. Toque em {"Conectar um dispositivo"}</li>
                    <li>4. Aponte o celular para esta tela</li>
                  </ol>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    );
  }

  // Conectado
  if (session.sessionId && session.connected && !session.qrCode) {
    return (
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Status da Sessão</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-full flex-col gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <Badge>Conectado</Badge>
              </div>

              <p>Sua sessão está ativa e funcionando</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conectado desde:</span>
                <span className="font-medium">
                  {formatDate(session.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atividade:</span>
                <span className="font-medium">
                  {timeAgo(session.updatedAt)}
                </span>
              </div>
            </div>

            <form
              className="mt-auto"
              action={async () => {
                "use server";
                await logoutSession({ sessionId: session.sessionId });
              }}
            >
              <Button className="w-full" variant="secondary">
                <WifiOffIcon /> Desconectar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conectar via QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/10 flex h-64 w-full items-center justify-center rounded-lg">
              <div className="space-y-3 text-center">
                <Smartphone className="text-muted-foreground mx-auto size-12" />
                <div>
                  <h3>WhatsApp Conectado!</h3>
                  <p>Sua sessão está ativa e funcionando</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
};
