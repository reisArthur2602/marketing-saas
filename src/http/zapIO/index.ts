import { v4 as uuidv4 } from "uuid";

type ZapIOResponse<T> =
  | { success: true; data: T; message: string | null }
  | { success: false; data: null; message: string };

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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
    const res = await fetch(`${API_BASE}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify({ to, message }),
    });

    if (!res.ok) throw new Error("Erro HTTP");

    return { success: true, data: undefined, message: null };
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
    return { success: false, data: null, message: "Erro ao enviar mensagem" };
  }
};

const connectSession = async (): Promise<
  ZapIOResponse<{ sessionId: string; name: string }>
> => {
  try {
    const name = `sender.io-${uuidv4()}`;

    const res = await fetch(`${API_BASE}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Erro HTTP");

    const response: { sessionId: string } = await res.json();

    return {
      success: true,
      data: { sessionId: response.sessionId, name },
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
    const res = await fetch(`${API_BASE}/webhook`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: sessionId,
      },
      body: JSON.stringify({
        onReceive_webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhook/on-receive`,
        onChangeSession_webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhook/on-change-session`,
      }),
    });

    if (!res.ok) throw new Error("Erro HTTP");

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
    const res = await fetch(`${API_BASE}/`, {
      method: "DELETE",
      headers: { Authorization: sessionId },
    });

    if (!res.ok) throw new Error("Erro HTTP");

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

const refresh = async ({
  sessionId,
}: {
  sessionId: string;
}): Promise<ZapIOResponse<void>> => {
  try {
    const res = await fetch(`${API_BASE}/qr/refresh`, {
      method: "PATCH",
      headers: { Authorization: sessionId },
      body: JSON.stringify({}),
    });

    if (!res.ok) throw new Error("Erro HTTP");

    return {
      success: true,
      data: undefined,
      message: "Sessão atualizada com sucesso!",
    };
  } catch (err) {
    console.error("Erro ao atualizar sessão:", err);
    return {
      success: false,
      data: null,
      message: "Erro ao atualizar sessão",
    };
  }
};

export const zapIO = {
  sendMessage,
  connectSession,
  configWebhook,
  logout,
  refresh,
};
