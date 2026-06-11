import { PlannerTask } from '../types';

export const DEFAULT_TASKS: PlannerTask[] = [
  {
    id: 'task-1',
    title: 'Mathematik-Lernkontrolle korrigieren',
    details: 'Rückmeldungen vorbereiten und Förderbedarf markieren.',
    category: 'Korrekturen',
    priority: 'hoch',
    dueDate: '',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Material für Französisch bereitstellen',
    details: 'Wortschatzkarten und Gruppenmaterial drucken.',
    category: 'Vorbereitung',
    priority: 'mittel',
    dueDate: '',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Elterninformation zum Ausflug verfassen',
    details: 'Treffpunkt, Zeiten und Packliste ergänzen.',
    category: 'Elternarbeit',
    priority: 'normal',
    dueDate: '',
    completed: false,
  },
];

export const TASK_CATEGORIES: PlannerTask['category'][] = [
  'Korrekturen',
  'Vorbereitung',
  'Elternarbeit',
  'Verwaltung',
];
