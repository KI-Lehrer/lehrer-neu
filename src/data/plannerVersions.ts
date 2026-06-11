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
  { time: '07:25–08:10', mondayA: empty, mondayB: empty, tuesdayA: empty, tuesdayB: empty, wednesdayA: cell('Mu', 'MU'), wednesdayB: cell('Mu', 'MU'), thursdayA: empty, thursdayB: empty, fridayA: empty, fridayB: empty },
  { time: '08:15–09:00', mondayA: cell('PICTS', 'KLP'), mondayB: cell('PICTS', 'KLP'), tuesdayA: cell('PICTS', 'KLP'), tuesdayB: cell('PICTS', 'KLP'), wednesdayA: cell('D', 'KLP'), wednesdayB: cell('D', 'KLP'), thursdayA: cell('D', 'KLP'), thursdayB: cell('D', 'KLP'), fridayA: cell('D', 'KLP'), fridayB: cell('D', 'KLP') },
  { time: '09:05–09:50', mondayA: cell('PICTS', 'KLP'), mondayB: cell('PICTS', 'KLP'), tuesdayA: cell('PICTS', 'KLP'), tuesdayB: cell('PICTS', 'KLP'), wednesdayA: cell('M', 'KLP'), wednesdayB: cell('M', 'KLP'), thursdayA: cell('M', 'KLP'), thursdayB: cell('M', 'KLP'), fridayA: cell('M', 'KLP'), fridayB: cell('M', 'KLP') },
  { time: '10:10–10:55', mondayA: cell('M', 'KLP'), mondayB: cell('M', 'KLP'), tuesdayA: cell('PICTS', 'KLP'), tuesdayB: cell('PICTS', 'KLP'), wednesdayA: cell('NMG', 'KLP'), wednesdayB: cell('NMG', 'KLP'), thursdayA: cell('NMG', 'KLP'), thursdayB: cell('NMG', 'KLP'), fridayA: cell('M', 'KLP'), fridayB: cell('M', 'KLP') },
  { time: '11:00–11:45', mondayA: cell('NMG', 'KLP'), mondayB: cell('NMG', 'KLP'), tuesdayA: cell('PICTS', 'KLP'), tuesdayB: cell('PICTS', 'KLP'), wednesdayA: cell('SpS', 'KLP'), wednesdayB: cell('SpS', 'KLP'), thursdayA: empty, thursdayB: empty, fridayA: cell('NMG', 'KLP'), fridayB: cell('NMG', 'KLP') },
  { time: '13:30–14:15', mondayA: cell('D', 'KLP'), mondayB: empty, tuesdayA: cell('NMG (A)', 'KLP'), tuesdayB: empty, wednesdayA: empty, wednesdayB: empty, thursdayA: cell('M&I', 'KLP'), thursdayB: cell('M&I', 'KLP'), fridayA: empty, fridayB: empty },
  { time: '14:20–15:05', mondayA: empty, mondayB: cell('D', 'KLP'), tuesdayA: cell('D', 'KLP'), tuesdayB: cell('D', 'KLP'), wednesdayA: empty, wednesdayB: empty, thursdayA: cell('Mu', 'MU'), thursdayB: cell('Mu', 'MU'), fridayA: empty, fridayB: empty },
  { time: '15:20–16:05', mondayA: empty, mondayB: empty, tuesdayA: empty, tuesdayB: cell('NMG (B)', 'KLP'), wednesdayA: empty, wednesdayB: empty, thursdayA: empty, thursdayB: empty, fridayA: empty, fridayB: empty },
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
      class: 'P5c',
      level: 'Primarstufe',
      year: '2025/2026',
      name: 'Schule Rothrist',
      address: 'Rothrist',
      room: 'Zi 07',
      notice: 'Planungszeitraum: 12.06.2026 bis 03.07.2026.',
    },
    timetable: TIMETABLE_2526,
    initialDate: new Date(2026, 5, 12),
    minDate: new Date(2026, 5, 12),
    maxDate: new Date(2026, 6, 3),
  },
};
