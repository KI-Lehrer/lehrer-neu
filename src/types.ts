export type ViewTab = 'dashboard' | 'stundenplan' | 'jahresuebersicht' | 'wochenuebersicht' | 'tagesuebersicht' | 'aufgaben';

export interface LessonPlan {
  topic: string;
  homework: string;
  notes: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'holiday' | 'public-holiday' | 'event';
  startDate: string;
  endDate: string;
}

export interface PlannerTask {
  id: string;
  title: string;
  details: string;
  category: 'Korrekturen' | 'Vorbereitung' | 'Elternarbeit' | 'Verwaltung';
  priority: 'hoch' | 'mittel' | 'normal';
  dueDate: string;
  completed: boolean;
}
