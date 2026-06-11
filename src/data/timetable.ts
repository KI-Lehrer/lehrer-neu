export interface Teacher {
  code: string;
  subject: string;
  name: string;
}

export interface PupilGroup {
  name: string;
  size: number;
}

export interface TimetableCell {
  subject: string; // e.g. "BS", "X", "F", "E", "TTG", "MU", "Chor", "X / Pool", ""
  teacherCode: string;
  room?: string;
}

export interface TimetableRow {
  time: string;
  mondayA: TimetableCell;
  mondayB: TimetableCell;
  tuesdayA: TimetableCell;
  tuesdayB: TimetableCell;
  wednesdayA: TimetableCell;
  wednesdayB: TimetableCell;
  thursdayA: TimetableCell;
  thursdayB: TimetableCell;
  fridayA: TimetableCell;
  fridayB: TimetableCell;
}

export const SCHOOL_INFO = {
  class: '6B',
  level: 'Zyklus 2 – Mittelstufe 2',
  year: '2025/2026',
  name: 'Schule Suhr',
  address: 'Tramstrasse 20, 5034 Suhr',
  room: 'Klassenzimmer 6B',
  notice: 'Bei Krankheitsfall bitte bis 07:00 Uhr abmelden. Besten Dank.'
};

export const TEACHERS: Teacher[] = [
  { code: 'KLP', subject: 'Klassenlehrperson / Regelunterricht (X)', name: 'Sascha Lüscher' },
  { code: 'BS', subject: 'Bewegung und Sport', name: 'Philipp Achermann' },
  { code: 'E', subject: 'Englisch', name: 'Milena Jevric' },
  { code: 'F', subject: 'Französisch', name: 'Romane Segal' },
  { code: 'MU', subject: 'Musik', name: 'Sarah Schmid' },
  { code: 'TTG', subject: 'Textiles Werken / Gestalten', name: 'Laura Bisang' },
  { code: 'SHP', subject: 'Schulischer Heilpädagoge', name: 'Andreas Sager' }
];

export const GROUPS: PupilGroup[] = [
  { name: 'Gruppe A', size: 8 },
  { name: 'Gruppe B', size: 9 },
];

const SUBJECT_DETAILS = {
  BS: { teacherCode: 'BS', room: 'Turnhalle', colorClass: 'text-emerald-900', borderClass: 'border-emerald-500', bgClass: 'bg-emerald-50' },
  F: { teacherCode: 'F', room: 'Zimmer 104', colorClass: 'text-indigo-900', borderClass: 'border-indigo-500', bgClass: 'bg-indigo-50' },
  E: { teacherCode: 'E', room: 'Zimmer 108', colorClass: 'text-sky-900', borderClass: 'border-sky-500', bgClass: 'bg-sky-50' },
  MU: { teacherCode: 'MU', room: 'Musikzimmer', colorClass: 'text-amber-900', borderClass: 'border-amber-500', bgClass: 'bg-amber-50' },
  TTG: { teacherCode: 'TTG', room: 'TTG-Werkraum', colorClass: 'text-orange-900', borderClass: 'border-orange-500', bgClass: 'bg-orange-50' },
  CHOR: { teacherCode: 'MU', room: 'Aula O', colorClass: 'text-pink-900', borderClass: 'border-pink-500', bgClass: 'bg-pink-50' },
  X: { teacherCode: 'KLP', room: 'Klassenzimmer 6B', colorClass: 'text-slate-900', borderClass: 'border-slate-500', bgClass: 'bg-slate-50' },
  PICTS: { teacherCode: 'KLP', room: 'Zi 07', colorClass: 'text-slate-900', borderClass: 'border-slate-500', bgClass: 'bg-slate-100' },
  NMG: { teacherCode: 'KLP', room: 'Zi 07', colorClass: 'text-lime-950', borderClass: 'border-lime-500', bgClass: 'bg-lime-100' },
  SPS: { teacherCode: 'KLP', room: 'Schwimmbad', colorClass: 'text-cyan-950', borderClass: 'border-cyan-500', bgClass: 'bg-cyan-100' },
  'M&I': { teacherCode: 'KLP', room: 'Zi 07', colorClass: 'text-violet-950', borderClass: 'border-violet-500', bgClass: 'bg-violet-100' },
  M: { teacherCode: 'KLP', room: 'Zi 07', colorClass: 'text-blue-950', borderClass: 'border-blue-500', bgClass: 'bg-blue-100' },
  D: { teacherCode: 'KLP', room: 'Zi 07', colorClass: 'text-rose-950', borderClass: 'border-rose-400', bgClass: 'bg-rose-100' },
} as const;

// Helper to get room and teacher by subject code
export function getSubjectDetails(subject: string, fallbackRoom?: string): { teacher: string; teacherName: string; room: string; colorClass: string; borderClass: string; bgClass: string } {
  const norm = subject.trim().toUpperCase();
  const key = (Object.keys(SUBJECT_DETAILS) as Array<keyof typeof SUBJECT_DETAILS>)
    .find((candidate) => norm.startsWith(candidate));

  if (key) {
    const details = SUBJECT_DETAILS[key];
    const teacherName = TEACHERS.find((teacher) => teacher.code === details.teacherCode)?.name ?? '-';
    return { teacher: details.teacherCode, teacherName, room: fallbackRoom ?? details.room, colorClass: details.colorClass, borderClass: details.borderClass, bgClass: details.bgClass };
  }
  
  return {
    teacher: '-',
    teacherName: '-',
    room: '-',
    colorClass: 'text-gray-900',
    borderClass: 'border-gray-300',
    bgClass: 'bg-gray-50'
  };
}

export const TIMETABLE_DATA: TimetableRow[] = [
  {
    time: '07:30–08:15',
    mondayA: { subject: '', teacherCode: '' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'F', teacherCode: 'F' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'X', teacherCode: 'KLP' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: '', teacherCode: '' },
    thursdayB: { subject: '', teacherCode: '' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '08:20–09:05',
    mondayA: { subject: 'BS', teacherCode: 'BS' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'X', teacherCode: 'KLP' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'X', teacherCode: 'KLP' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'X', teacherCode: 'KLP' },
    thursdayB: { subject: 'E', teacherCode: 'E' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '09:10–09:55',
    mondayA: { subject: 'X', teacherCode: 'KLP' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'X', teacherCode: 'KLP' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'X', teacherCode: 'KLP' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'MU', teacherCode: 'MU' },
    thursdayB: { subject: '', teacherCode: '' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '10:15–11:00',
    mondayA: { subject: 'F', teacherCode: 'F' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'BS', teacherCode: 'BS' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'E', teacherCode: 'E' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'E', teacherCode: 'E' },
    thursdayB: { subject: 'X', teacherCode: 'KLP' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '11:05–11:50',
    mondayA: { subject: 'X', teacherCode: 'KLP' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'X', teacherCode: 'KLP' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: 'X / Pool', teacherCode: 'KLP' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'X', teacherCode: 'KLP' },
    thursdayB: { subject: '', teacherCode: '' },
    fridayA: { subject: 'X', teacherCode: 'KLP' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '13:30–14:15',
    mondayA: { subject: 'Chor', teacherCode: 'MU' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'TTG', teacherCode: 'TTG' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: '', teacherCode: '' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'BS', teacherCode: 'BS' },
    thursdayB: { subject: '', teacherCode: '' },
    fridayA: { subject: '', teacherCode: '' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '14:20–15:05',
    mondayA: { subject: 'X / Pool', teacherCode: 'KLP' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: 'TTG', teacherCode: 'TTG' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: '', teacherCode: '' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'X', teacherCode: 'KLP' },
    thursdayB: { subject: 'F', teacherCode: 'F' },
    fridayA: { subject: '', teacherCode: '' },
    fridayB: { subject: '', teacherCode: '' }
  },
  {
    time: '15:20–16:05',
    mondayA: { subject: '', teacherCode: '' },
    mondayB: { subject: '', teacherCode: '' },
    tuesdayA: { subject: '', teacherCode: '' },
    tuesdayB: { subject: '', teacherCode: '' },
    wednesdayA: { subject: '', teacherCode: '' },
    wednesdayB: { subject: '', teacherCode: '' },
    thursdayA: { subject: 'F', teacherCode: 'F' },
    thursdayB: { subject: 'X', teacherCode: 'KLP' },
    fridayA: { subject: '', teacherCode: '' },
    fridayB: { subject: '', teacherCode: '' }
  }
];
