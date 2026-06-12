import type { LessonPlan } from '../types';

interface PdfLesson {
  number: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  plan: LessonPlan;
}

interface DailyPlanPdfData {
  date: string;
  school: string;
  schoolClass: string;
  dailyNotes: string;
  lessons: PdfLesson[];
}

interface TextLine {
  text: string;
  size: number;
  bold?: boolean;
  color?: [number, number, number];
  gapBefore?: number;
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const CONTENT_BOTTOM = PAGE_HEIGHT - 48;

const escapePdfText = (text: string) => Array.from(text).map((character) => {
  const code = character.charCodeAt(0);
  if (character === '\\' || character === '(' || character === ')') return `\\${character}`;
  if (code >= 32 && code <= 126) return character;
  const winAnsi: Record<string, number> = { 'Ä': 196, 'Ö': 214, 'Ü': 220, 'ä': 228, 'ö': 246, 'ü': 252, 'ß': 223, '–': 150, '—': 151, '·': 183, '’': 146, '“': 147, '”': 148 };
  const byte = winAnsi[character] ?? 63;
  return `\\${byte.toString(8).padStart(3, '0')}`;
}).join('');

const wrapText = (text: string, size: number, width = CONTENT_WIDTH) => {
  const maxCharacters = Math.max(12, Math.floor(width / (size * 0.52)));
  const paragraphs = (text.trim() || '—').split(/\r?\n/);
  const lines: string[] = [];

  paragraphs.forEach((paragraph) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push('');
      return;
    }

    let line = '';
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length <= maxCharacters) {
        line = candidate;
        return;
      }
      if (line) lines.push(line);
      line = word;
      while (line.length > maxCharacters) {
        lines.push(line.slice(0, maxCharacters));
        line = line.slice(maxCharacters);
      }
    });
    if (line) lines.push(line);
  });

  return lines;
};

const textSection = (label: string, text: string): TextLine[] => [
  { text: label.toUpperCase(), size: 8, bold: true, color: [79, 70, 229], gapBefore: 8 },
  ...wrapText(text, 10).map((line) => ({ text: line, size: 10 })),
];

const lineHeight = (line: TextLine) => line.size * 1.35 + (line.gapBefore ?? 0);
const blockHeight = (lines: TextLine[]) => lines.reduce((height, line) => height + lineHeight(line), 0) + 18;

export function createDailyPlanPdf(data: DailyPlanPdfData) {
  const pages: string[][] = [];
  let commands: string[] = [];
  let y = MARGIN;

  const addText = (line: TextLine) => {
    y += line.gapBefore ?? 0;
    const [red, green, blue] = line.color ?? [20, 30, 50];
    const baseline = PAGE_HEIGHT - y - line.size;
    commands.push(`${(red / 255).toFixed(3)} ${(green / 255).toFixed(3)} ${(blue / 255).toFixed(3)} rg`);
    commands.push(`BT /${line.bold ? 'F2' : 'F1'} ${line.size} Tf ${MARGIN} ${baseline.toFixed(2)} Td (${escapePdfText(line.text)}) Tj ET`);
    y += line.size * 1.35;
  };

  const finishPage = () => {
    pages.push(commands);
    commands = [];
    y = MARGIN;
  };

  const addRule = () => {
    const ruleY = PAGE_HEIGHT - y;
    commands.push(`0.850 0.870 0.920 RG 0.7 w ${MARGIN} ${ruleY.toFixed(2)} m ${PAGE_WIDTH - MARGIN} ${ruleY.toFixed(2)} l S`);
    y += 10;
  };

  const addBlock = (lines: TextLine[]) => {
    const height = blockHeight(lines);
    const maximumBlockHeight = CONTENT_BOTTOM - MARGIN;
    if (height <= maximumBlockHeight && y + height > CONTENT_BOTTOM) finishPage();

    lines.forEach((line) => {
      if (y + lineHeight(line) + 12 > CONTENT_BOTTOM) finishPage();
      addText(line);
    });
    addRule();
  };

  addText({ text: 'Tagesplanung', size: 20, bold: true, color: [79, 70, 229] });
  addText({ text: data.date, size: 14, bold: true, gapBefore: 4 });
  addText({ text: `${data.school} · Klasse ${data.schoolClass}`, size: 10, color: [75, 85, 105], gapBefore: 2 });
  y += 12;
  addRule();

  if (data.dailyNotes.trim()) {
    addBlock([
      { text: 'Tagesnotizen', size: 13, bold: true },
      ...wrapText(data.dailyNotes, 10).map((text) => ({ text, size: 10 })),
    ]);
  }

  data.lessons.forEach((lesson) => {
    addBlock([
      { text: `${lesson.number}. ${lesson.subject} · ${lesson.time}`, size: 13, bold: true, color: [79, 70, 229] },
      { text: `${lesson.teacher} · ${lesson.room}`, size: 9, color: [75, 85, 105], gapBefore: 2 },
      ...textSection('Thema der Stunde', lesson.plan.topic),
      ...textSection('Hausaufgaben', lesson.plan.homework),
      ...textSection('Reflexion / Notizen', lesson.plan.notes),
    ]);
  });

  if (commands.length > 0) finishPage();

  const pageCount = pages.length;
  pages.forEach((page, index) => {
    page.push(`0.450 0.480 0.550 rg BT /F1 8 Tf ${(PAGE_WIDTH / 2 - 20).toFixed(2)} 24 Td (Seite ${index + 1} von ${pageCount}) Tj ET`);
  });

  const objects: string[] = [];
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  const pageObjectIds = pages.map((_, index) => 5 + index * 2);
  objects.push(`<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageCount} >>`);
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  pages.forEach((page) => {
    const stream = page.join('\n');
    const contentId = objects.length + 2;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = Uint8Array.from(pdf, (character) => character.charCodeAt(0) & 0xff);
  return new Blob([bytes], { type: 'application/pdf' });
}
