"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, Target, LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Automações Inteligentes",
    description: "Configure respostas automáticas baseadas em palavras-chave",
  },
  {
    icon: Target,
    title: "Campanhas Personalizadas",
    description: "Crie campanhas com horários e exceções específicas",
  },
  {
    icon: MessageSquare,
    title: "Métricas em Tempo Real",
    description: "Acompanhe o desempenho das suas automações",
  },
];

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleStart()}>
      <DialogContent className="border-border">
        <DialogHeader>
          <DialogTitle>Bem-vindo a plataforma🎉</DialogTitle>
          <DialogDescription>
            Gerencie suas automações de WhatsApp de forma simples e eficiente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="bg-accent text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                <feature.icon className="text-accent-foreground h-4 w-4" />
              </div>
              <div>
                <h6 className="text-foreground font-medium">{feature.title}</h6>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleStart}
          className="transition-smooth w-full"
          size="lg"
        >
          Começar agora
        </Button>
      </DialogContent>
    </Dialog>
  );
};
