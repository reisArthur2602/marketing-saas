import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL as string;

export const axiosConfig = axios.create({
  baseURL: `${url}`,
});

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data?.error ?? [
      { message: error.response?.data?.message ?? "Erro desconhecido" },
    ];

    return Promise.reject(errorData);
  },
);
