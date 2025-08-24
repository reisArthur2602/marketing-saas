import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPhoneNumber = (number: string | number) => {
  const digits = String(number).replace(/\D/g, "");

  if (digits.length === 13 && digits.startsWith("55")) {
    const country = digits.slice(0, 2);
    const ddd = digits.slice(2, 4);
    const firstPart = digits.slice(4, 9);
    const secondPart = digits.slice(9);
    return `+${country} ${ddd} ${firstPart}-${secondPart}`;
  }

  return String(number);
};
