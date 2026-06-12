import { createContext, Dispatch, ReactNode, SetStateAction, useContext } from 'react';
import { PlannerVersion } from '../data/plannerVersions';
import { TimetableRow } from '../data/timetable';
import { CalendarEvent } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PlannerContextValue {
  planner: PlannerVersion;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  timetable: TimetableRow[];
  setTimetable: Dispatch<SetStateAction<TimetableRow[]>>;
  events: CalendarEvent[];
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({
  planner,
  selectedDate,
  setSelectedDate,
  children,
}: {
  planner: PlannerVersion;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  children: ReactNode;
}) {
  const [timetable, setTimetable] = useLocalStorage<TimetableRow[]>(`${planner.storagePrefix}.timetable`, planner.timetable);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>(`${planner.storagePrefix}.calendar-events`, planner.initialEvents);
  return <PlannerContext.Provider value={{ planner, selectedDate, setSelectedDate, timetable, setTimetable, events, setEvents }}>{children}</PlannerContext.Provider>;
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) throw new Error('usePlanner muss innerhalb des PlannerProvider verwendet werden.');
  return context;
}
