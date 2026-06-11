import { createContext, ReactNode, useContext } from 'react';
import { PlannerVersion } from '../data/plannerVersions';

interface PlannerContextValue {
  planner: PlannerVersion;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ value, children }: { value: PlannerContextValue; children: ReactNode }) {
  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner muss innerhalb des PlannerProvider verwendet werden.');
  return context;
}
