import { createWhatsAppSession } from "@/app/(logged-in)/dashboard/session/actions/create-whatsapp-session";
import { axiosConfig } from "@/lib/axios";

type ZapIOResponse<T> =
  | { success: true; data: T; message: string }
  | { success: false; data: null; message: string };

const sendMessage = async ({
  message,
  to,
  sessionId,
}: {
  message: string;
  to: string;
  sessionId: string;
}): Promise<ZapIOResponse<void>> => {
  try {
    await axiosConfig.post(
      "/send",
      { to, message },
      { headers: { Authorization: sessionId } },
    );

    return {
      success: true,
      data: undefined,
      message: "Mensagem enviada com sucesso!",
    };
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
    return { success: false, data: null, message: "Erro ao enviar mensagem" };
  }
};

const getQrCode = async ({
  sessionId,
}: {
  sessionId: string;
}): Promise<ZapIOResponse<{ qr: string }>> => {
  try {
    const response = await axiosConfig.get<{ qr: string }>("/qr", {
      headers: { Authorization: sessionId },
    });

    return {
      success: true,
      data: response.data,
      message: "QR Code obtido com sucesso!",
    };
  } catch (err) {
    console.error("Erro ao buscar QR Code:", err);
    return { success: false, data: null, message: "Erro ao buscar QR Code" };
  }
};

const connectSession = async (): Promise<
  ZapIOResponse<{ sessionId: string }>
> => {
  try {
    const name = `sender.io-${crypto.randomUUID()}`;
    const response = (
      await axiosConfig.post<{ sessionId: string }>("/", { name })
    ).data;

    await createWhatsAppSession({ name, sessionId: response.sessionId });

    return {
      success: true,
      data: response,
      message: "Sessão conectada com sucesso!",
    };
  } catch (err) {
    console.error("Erro ao conectar sessão:", err);
    return { success: false, data: null, message: "Erro ao conectar sessão" };
  }
};

const configWebhook = async ({
  sessionId,
}: {
  sessionId: string;
}): Promise<ZapIOResponse<void>> => {
  try {
    await axiosConfig.patch(
      "/webhook",
      {
        onReceive_webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhook/on-receive`,
        onChangeSession_webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhook/on-change-session`,
      },
      { headers: { Authorization: sessionId } },
    );

    return {
      success: true,
      data: undefined,
      message: "Webhook configurado com sucesso!",
    };
  } catch (err) {
    console.error("Erro ao configurar webhook:", err);
    return {
      success: false,
      data: null,
      message: "Erro ao configurar webhook",
    };
  }
};

const logout = async ({
  sessionId,
}: {
  sessionId: string;
}): Promise<ZapIOResponse<void>> => {
  try {
    await axiosConfig.patch(
      "/disconnect",
      {},
      { headers: { Authorization: sessionId } },
    );

    return {
      success: true,
      data: undefined,
      message: "Sessão desconectada com sucesso!",
    };
  } catch (err) {
    console.error("Erro ao desconectar sessão:", err);
    return {
      success: false,
      data: null,
      message: "Erro ao desconectar sessão",
    };
  }
};

export const zapIO = {
  sendMessage,
  getQrCode,
  connectSession,
  configWebhook,
  logout,
};
