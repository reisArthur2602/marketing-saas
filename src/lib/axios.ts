import axios from "axios";
import axiosRetry from "axios-retry";

const url = process.env.NEXT_PUBLIC_API_URL as string;

export const axiosConfig = axios.create({
  baseURL: url,
  timeout: 8000, 
});


axiosRetry(axiosConfig, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    error.code === "ECONNABORTED" || error.response?.status! >= 500,
});


axiosConfig.interceptors.response.use(
  (response) => {
 
    return response;
  },
  (error) => {
    const errorData = error.response?.data?.error ?? [
      { message: error.response?.data?.message ?? "Erro desconhecido" },
    ];

    console.error(
      `[API ${error.config?.url}] Falhou ->`,
      error.response?.status,
      errorData,
    );

    return Promise.reject(errorData);
  }
);
