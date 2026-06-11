import assert from 'node:assert/strict';
import { formatLongDate, getIsoWeek, getSchoolDayProgress, getWeekDays, startOfWeek, toDateKey } from './date.ts';

const thursday = new Date(2026, 5, 11);

assert.equal(toDateKey(thursday), '2026-06-11');
assert.equal(toDateKey(startOfWeek(thursday)), '2026-06-08');
assert.deepEqual(getWeekDays(thursday).map(toDateKey), [
  '2026-06-08',
  '2026-06-09',
  '2026-06-10',
  '2026-06-11',
  '2026-06-12',
]);
assert.equal(getIsoWeek(thursday), 24);
assert.match(formatLongDate(thursday), /Donnerstag/);
assert.ok(getSchoolDayProgress(thursday) > 0 && getSchoolDayProgress(thursday) <= 180);

console.log('Datumstests erfolgreich.');
