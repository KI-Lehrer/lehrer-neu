import { SCHOOL_INFO, TIMETABLE_DATA, TimetableRow } from './timetable';

const empty = { subject: '', teacherCode: '' };
const cell = (subject: string, teacherCode = subject) => ({ subject, teacherCode });

export interface PlannerVersion {
  id: 'current' | '2526';
  label: string;
  storagePrefix: string;
  schoolInfo: typeof SCHOOL_INFO;
  timetable: TimetableRow[];
  initialDate: Date;
  minDate?: Date;
  maxDate?: Date;
}

export const TIMETABLE_2526: TimetableRow[] = [
  { time: '07:30–08:15', mondayA: cell('X', 'KLP'), mondayB: empty, tuesdayA: empty, tuesdayB: empty, wednesdayA: cell('F'), wednesdayB: empty, thursdayA: cell('X', 'KLP'), thursdayB: empty, fridayA: cell('E'), fridayB: empty },
  { time: '08:20–09:05', mondayA: cell('X', 'KLP'), mondayB: empty, tuesdayA: cell('BS'), tuesdayB: empty, wednesdayA: cell('X', 'KLP'), wednesdayB: empty, thursdayA: cell('F'), thursdayB: empty, fridayA: cell('X', 'KLP'), fridayB: empty },
  { time: '09:10–09:55', mondayA: cell('E'), mondayB: empty, tuesdayA: cell('X', 'KLP'), tuesdayB: empty, wednesdayA: cell('MU'), wednesdayB: empty, thursdayA: cell('X', 'KLP'), thursdayB: empty, fridayA: cell('BS'), fridayB: empty },
  { time: '10:15–11:00', mondayA: cell('BS'), mondayB: empty, tuesdayA: cell('F'), tuesdayB: empty, wednesdayA: cell('X', 'KLP'), wednesdayB: empty, thursdayA: cell('E'), thursdayB: empty, fridayA: cell('X', 'KLP'), fridayB: empty },
  { time: '11:05–11:50', mondayA: cell('X', 'KLP'), mondayB: empty, tuesdayA: cell('X / Pool', 'KLP'), tuesdayB: empty, wednesdayA: cell('X', 'KLP'), wednesdayB: empty, thursdayA: cell('MU'), thursdayB: empty, fridayA: cell('X', 'KLP'), fridayB: empty },
  { time: '13:30–14:15', mondayA: cell('TTG'), mondayB: empty, tuesdayA: cell('Chor', 'MU'), tuesdayB: empty, wednesdayA: empty, wednesdayB: empty, thursdayA: cell('X', 'KLP'), thursdayB: empty, fridayA: empty, fridayB: empty },
  { time: '14:20–15:05', mondayA: cell('TTG'), mondayB: empty, tuesdayA: cell('X', 'KLP'), tuesdayB: empty, wednesdayA: empty, wednesdayB: empty, thursdayA: cell('BS'), thursdayB: empty, fridayA: empty, fridayB: empty },
  { time: '15:20–16:05', mondayA: empty, mondayB: empty, tuesdayA: cell('F'), tuesdayB: empty, wednesdayA: empty, wednesdayB: empty, thursdayA: empty, thursdayB: empty, fridayA: empty, fridayB: empty },
];

export const PLANNER_VERSIONS: Record<PlannerVersion['id'], PlannerVersion> = {
  current: {
    id: 'current',
    label: 'Aktuell',
    storagePrefix: 'lehrerplaner',
    schoolInfo: SCHOOL_INFO,
    timetable: TIMETABLE_DATA,
    initialDate: new Date(),
  },
  '2526': {
    id: '2526',
    label: '25/26',
    storagePrefix: 'lehrerplaner.2526',
    schoolInfo: {
      ...SCHOOL_INFO,
      year: '2025/2026',
      notice: 'Planungszeitraum: 12.06.2026 bis 03.07.2026.',
    },
    timetable: TIMETABLE_2526,
    initialDate: new Date(2026, 5, 12),
    minDate: new Date(2026, 5, 12),
    maxDate: new Date(2026, 6, 3),
  },
};
