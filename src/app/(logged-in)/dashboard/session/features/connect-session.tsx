import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Loader2 } from "lucide-react";
import Image from "next/image";

import { getWhatsAppSession } from "../actions/get-whatsapp-session";
import { AutoRefresh } from "./auto-refresh";
import generateQrCode from "qrcode";

export const ConnectSession = async () => {
  const whatsAppSession = await getWhatsAppSession();
  const sessionId = whatsAppSession?.sessionId || null;
  const qrCode = whatsAppSession?.qrCode;

  // Caso não exista sessão ainda
  if (!sessionId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conectar via QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AutoRefresh active={true} intervalMs={2000} />
          <div className="bg-accent/10 flex h-64 w-full items-center justify-center rounded-lg">
            <div className="space-y-3 text-center">
              <Smartphone className="text-muted-foreground mx-auto h-12 w-12" />
              <div>
                <h3 className="text-foreground font-medium">
                  QR Code não disponível
                </h3>
                <p className="text-muted-foreground text-sm">
                  Clique em {"Conectar WhatsApp"} para gerar o QR Code
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sessão existe mas QRCode ainda não foi gerado → Loading
  if (sessionId && !qrCode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conectar via QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AutoRefresh active={true} intervalMs={2000} />
          <div className="bg-accent/10 flex h-64 w-full items-center justify-center rounded-lg">
            <div className="space-y-3 text-center">
              <Loader2 className="text-muted-foreground mx-auto h-10 w-10 animate-spin" />
              <div>
                <h3 className="text-foreground font-medium">
                  Gerando QR Code...
                </h3>
                <p className="text-muted-foreground text-sm">
                  Aguarde alguns instantes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // QRCode pronto
  const qrCodeImage = (await generateQrCode.toDataURL(qrCode!)) as string;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar via QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AutoRefresh active={!whatsAppSession?.connected} intervalMs={2000} />

        {qrCodeImage ? (
          <>
            <Image
              src={qrCodeImage}
              alt="conectar qr-code"
              width={210}
              height={210}
              priority
              className="mx-auto"
            />
            <div className="space-y-2 text-center">
              <h3 className="font-medium">Escaneie o QR Code</h3>
              <ol className="text-muted-foreground space-y-1 text-left text-sm">
                <li>1. Abra o WhatsApp no seu celular</li>
                <li>2. Vá em Menu → Dispositivos conectados</li>
                <li>3. Toque em {"Conectar um dispositivo"}</li>
                <li>4. Aponte o celular para esta tela</li>
              </ol>
            </div>
          </>
        ) : (
          <div className="bg-accent/10 flex h-64 w-full items-center justify-center rounded-lg">
            <div className="space-y-3 text-center">
              <Smartphone className="text-muted-foreground mx-auto h-12 w-12" />
              <div>
                <h3 className="text-foreground font-medium">
                  QR Code não disponível
                </h3>
                <p className="text-muted-foreground text-sm">
                  WhatsApp já está conectado
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
