import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppSession } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Loader,
  Loader2,
  LoaderCircle,
  QrCode,
  QrCodeIcon,
  RefreshCcw,
  Smartphone,
  WifiOffIcon,
} from "lucide-react";
import { ScanAnimation } from "@/components/shared/scan-animation/scan-animation";

import { formatDate, timeAgo } from "@/utils/date";
import { connectSession } from "../actions/connect-session";
import { logoutSession } from "../actions/logout-session";

import generateQRCode from "qrcode";
import Image from "next/image";
import { AutoRefresh } from "@/components/shared/auto-refresh";
import { Skeleton } from "@/components/ui/skeleton";
import { isPast } from "date-fns";
import { getWhatsAppSession } from "../actions/get-whatsapp-session";
import { refreshConnection } from "../actions/refresh-connection";

export const ManageSession = async () => {
  const session = await getWhatsAppSession();

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
            <div className="bg-card border-border flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed">
              <div className="space-y-3 text-center">
                <div className="bg-muted flex h-48 w-48 items-center justify-center rounded-lg">
                  <div className="grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`size-3 rounded-sm ${
                          Math.random() > 0.5 && "bg-primary"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <h3>O QR Code aparecerá aqui</h3>

              <ol className="text-muted-foreground space-y-1 text-left text-sm">
                <li>1. Abra o WhatsApp no seu celular</li>
                <li>2. Vá em Menu → Dispositivos conectados</li>
                <li>3. Toque em "Conectar um dispositivo"</li>
                <li>4. Aponte o celular para esta tela</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </section>
    );

  if (session.sessionId && !session.qrCode && !session.connected) {
    const connectionHasLost = isPast(
      new Date(new Date(session.createdAt).getTime() + 60 * 1000),
    );

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
                <Badge variant="secondary">
                  {connectionHasLost ? "Perdida" : "Conectando"}
                </Badge>
              </div>

              <p>
                {connectionHasLost
                  ? "A conexão com o WhatsApp foi perdida"
                  : "Escaneie o QR Code com seu WhatsApp"}
              </p>
            </div>

            {connectionHasLost ? (
              <form
                className="mt-auto"
                action={async () => {
                  "use server";
                  await refreshConnection({ sessionId: session.sessionId });
                }}
              >
                <Button className="w-full">
                  <RefreshCcw /> Reabrir Conexão
                </Button>
              </form>
            ) : (
              <Button disabled className="mt-auto">
                <Loader2 className="animate-spin" />
                Gerando Qr Code
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conectar via QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectionHasLost ? (
              <>
                <div className="bg-card border-border flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="space-y-3 text-center">
                    <Skeleton className="flex h-48 w-48 items-center justify-center">
                      <WifiOffIcon className="text-primary size-28" />
                    </Skeleton>
                  </div>
                </div>
                <div className="space-y-4 text-center">
                  <h3 className="font-medium">A conexão foi perdida</h3>

                  <ol className="text-muted-foreground space-y-1 text-left text-sm">
                    <li>1. Clique em "Reabrir conexão" ao lado.</li>
                    <li>2. Aguarde, um novo QR Code será gerado.</li>
                    <li>3. Escaneie o seu novo QR Code</li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <div className="bg-card border-border flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="space-y-3 text-center">
                    <Skeleton className="flex h-48 w-48 items-center justify-center">
                      <QrCode className="text-primary size-32" />
                    </Skeleton>
                  </div>
                </div>
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <LoaderCircle className="text-primary animate-spin" />
                    <h3 className="font-medium">Aguardando conexão</h3>
                  </div>

                  <ol className="text-muted-foreground space-y-1 text-left text-sm">
                    <li>1. Abra o WhatsApp no seu celular</li>
                    <li>2. Vá em Menu → Dispositivos conectados</li>
                    <li>3. Toque em "Conectar um dispositivo"</li>
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
            <AutoRefresh active intervalMs={8000} />
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
            <div className="bg-card border-border flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed">
              {qrCode && (
                <>
                  <AutoRefresh active />
                  <Image
                    src={qrCode}
                    alt="conectar qr-code"
                    width={256}
                    height={256}
                    priority
                    className="mx-auto size-48 rounded-lg"
                  />
                </>
              )}
            </div>

            <div className="space-y-4 text-center">
              <h3 className="font-medium">Escaneie o QR Code</h3>

              <ol className="text-muted-foreground space-y-1 text-left text-sm">
                <li>1. Abra o WhatsApp no seu celular</li>
                <li>2. Vá em Menu → Dispositivos conectados</li>
                <li>3. Toque em "Conectar um dispositivo"</li>
                <li>4. Aponte o celular para esta tela</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Conectado
  if (session.sessionId && session.connected && !session.qrCode) {
    return (
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AutoRefresh active intervalMs={10000} />
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
