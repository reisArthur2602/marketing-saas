import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosClient from "@/lib/axios";
import { Smartphone } from "lucide-react";
import Image from "next/image";

interface ConnectSessionProps {
  qrCode: string | null;
  sessionId: string | null;
}
interface QrCodeResponse {
  qr: string;
}
export const ConnectSession = async ({
  qrCode,
  sessionId,
}: ConnectSessionProps) => {
  const getQrCode = async () => {
    try {
      const response = await axiosClient.get<QrCodeResponse>("/qr", {
        headers: {
          Authorization: sessionId,
        },
      });

      return response.data.qr;
    } catch (error) {
      console.error("Erro ao buscar QR Code:", error);
      return null;
    }
  };
  const qrCodeImage = (qrCode && (await getQrCode())) || "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conectar via QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {qrCode ? (
          <>
            <Image
              src={qrCodeImage}
              alt="conectar qr-code"
              width={220}
              height={220}
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
                  {!qrCode
                    ? "WhatsApp já está conectado"
                    : 'Clique em "Conectar WhatsApp" para gerar o QR Code'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
