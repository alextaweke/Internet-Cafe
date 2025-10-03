import type { Computer } from "../types/types";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${hours}h ${mins}m`;
};

export const calculateCost = (minutes: number, rate: number) => {
  const hours = minutes / 60;
  return hours * rate;
};export const calculateCurrentDuration = (computer: Computer) => {
  if (!computer.sessions || computer.sessions.length === 0) return 0;
  
  const activeSession = computer.sessions.find((s: { endTime: any; }) => !s.endTime);
  if (!activeSession) return 0;
  
  return (new Date().getTime() - new Date(activeSession.startTime).getTime()) / (1000 * 60);
};