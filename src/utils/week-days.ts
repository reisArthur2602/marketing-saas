// utils/week-days.ts
export const weekDaysOptions = [
  { id: 1, label: "Segunda" },
  { id: 2, label: "Terça" },
  { id: 3, label: "Quarta" },
  { id: 4, label: "Quinta" },
  { id: 5, label: "Sexta" },
  { id: 6, label: "Sábado" },
  { id: 0, label: "Domingo" },
];

export const getWeekDayLabel = (dayId: number) =>
  weekDaysOptions.find((d) => d.id === dayId)?.label ?? dayId.toString();
