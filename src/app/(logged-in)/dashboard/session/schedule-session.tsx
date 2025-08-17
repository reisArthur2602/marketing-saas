"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Smartphone, WifiOff } from "lucide-react";
import React from "react";

export const ScheduleSession = () => {
  const isLoading = false;
  const sessionStatus: "connected" | "disconnected" = "connected";

  const handleConnect = async () => {
    console.log("conectei");
  };
  const handleDisconnect = async () => {
    console.log("Desconectei");
  };
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Status da Sessão</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            {sessionStatus === "connected" ? (
              <Badge>Conectado</Badge>
            ) : (
              <Badge variant="outline">Desconectado</Badge>
            )}
          </div>

          <p>WhatsApp não está conectado</p>

          {sessionStatus === "connected" && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conectado desde:</span>
                <span className="font-medium">Hoje, 14:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atividade:</span>
                <span className="font-medium">2 min atrás</span>
              </div>
            </div>
          )}

          {sessionStatus === "connected" ? (
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="mt-auto "
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Smartphone className="h-4 w-4" />
                  Conectar WhatsApp
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="mt-auto "
            >
              <WifiOff className="h-4 w-4" />
              Desconectar
            </Button>
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conectar via QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          {sessionStatus === "connected" ? (
            <div className="space-y-4">
              <div className="bg-card border-border flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed">
                <div className="space-y-3 text-center">
                  <div className="bg-muted flex h-48 w-48 items-center justify-center rounded-lg">
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-3 w-3 rounded-sm ${
                            Math.random() > 0.5
                              ? "bg-foreground"
                              : "bg-background"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <h3 className="font-medium">Escaneie o QR Code</h3>
                <ol className="text-muted-foreground space-y-1 text-left text-sm">
                  <li>1. Abra o WhatsApp no seu celular</li>
                  <li>2. Vá em Menu → Dispositivos conectados</li>
                  <li>3. Toque em {"Conectar um dispositivo"}</li>
                  <li>4. Aponte o celular para esta tela</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="bg-accent/10 flex h-64 w-full items-center justify-center rounded-lg">
              <div className="space-y-3 text-center">
                <Smartphone className="text-muted-foreground mx-auto h-12 w-12" />
                <div>
                  <h3 className="text-foreground font-medium">
                    QR Code não disponível
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {sessionStatus === "connected"
                      ? "WhatsApp já está conectado"
                      : 'Clique em "Conectar WhatsApp" para gerar o QR Code'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
