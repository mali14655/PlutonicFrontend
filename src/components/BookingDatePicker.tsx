import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function toYmd(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseYmd(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function monthLabel(d: Date) {
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function formatShort(ymd: string) {
  return parseYmd(ymd).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function buildMonthGrid(viewMonth: Date) {
  const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const startOffset = first.getDay();
  const cursor = new Date(first);
  cursor.setDate(cursor.getDate() - startOffset);

  const cells: { ymd: string; inMonth: boolean; date: Date }[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(cursor);
    cells.push({
      date,
      ymd: toYmd(date),
      inMonth: date.getMonth() === viewMonth.getMonth(),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  while (cells.length > 35 && cells.slice(-7).every((c) => !c.inMonth)) {
    cells.splice(-7);
  }
  return cells;
}

function CalendarPanel({
  value,
  onChange,
  minYmd,
  onClose,
}: {
  value: string;
  onChange: (ymd: string) => void;
  minYmd: string;
  onClose: () => void;
}) {
  const todayYmd = useMemo(() => toYmd(new Date()), []);
  const minTime = startOfDay(parseYmd(minYmd)).getTime();
  const [viewMonth, setViewMonth] = useState(() => (value ? parseYmd(value) : parseYmd(minYmd)));

  useEffect(() => {
    if (value) setViewMonth(parseYmd(value));
  }, [value]);

  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  const canPrev =
    viewMonth.getFullYear() > parseYmd(minYmd).getFullYear() ||
    (viewMonth.getFullYear() === parseYmd(minYmd).getFullYear() &&
      viewMonth.getMonth() > parseYmd(minYmd).getMonth());

  const selectDate = (ymd: string) => {
    if (startOfDay(parseYmd(ymd)).getTime() < minTime) return;
    onChange(ymd);
    onClose();
  };

  return (
    <div className="w-[280px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-sky-200 bg-white shadow-xl shadow-sky-900/10">
      <div className="flex items-center justify-between border-b border-sky-100 bg-sky-50/80 px-3 py-2">
        <button
          type="button"
          onClick={() => canPrev && setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          disabled={!canPrev}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-plutonic-blue-dark hover:bg-white disabled:opacity-30"
          aria-label="Previous month"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-sm font-bold text-plutonic-blue-dark">{monthLabel(viewMonth)}</p>
        <button
          type="button"
          onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-plutonic-blue-dark hover:bg-white"
          aria-label="Next month"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 px-2 pt-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-0.5 text-center text-[10px] font-bold text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 p-2 pt-0.5">
        {cells.map(({ ymd, inMonth, date }) => {
          const disabled = startOfDay(date).getTime() < minTime;
          const selected = value === ymd;
          const isToday = ymd === todayYmd;

          return (
            <button
              key={ymd}
              type="button"
              disabled={disabled}
              onClick={() => selectDate(ymd)}
              className={[
                'flex h-8 w-full items-center justify-center rounded-lg text-xs font-semibold transition-colors',
                !inMonth && 'text-gray-300',
                inMonth && !disabled && !selected && 'text-plutonic-blue-dark hover:bg-sky-50',
                disabled && 'cursor-not-allowed text-gray-300',
                selected && 'bg-plutonic-blue text-white shadow-sm',
                isToday && !selected && inMonth && !disabled && 'ring-1 ring-plutonic-gold ring-inset',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-sky-100 px-3 py-2">
        <button
          type="button"
          onClick={() => {
            onChange('');
            setViewMonth(parseYmd(minYmd));
          }}
          className="text-xs font-semibold text-gray-500 hover:text-plutonic-blue-dark"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => selectDate(todayYmd)}
          className="rounded-md bg-sky-100 px-3 py-1 text-xs font-semibold text-plutonic-blue hover:bg-sky-200"
        >
          Today
        </button>
      </div>
    </div>
  );
}

export default function BookingDatePicker({
  value,
  onChange,
  minDate,
}: {
  value: string;
  onChange: (ymd: string) => void;
  minDate?: string;
}) {
  const todayYmd = useMemo(() => toYmd(new Date()), []);
  const minYmd = minDate ?? todayYmd;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="input-premium w-full flex items-center justify-between gap-3 text-left cursor-pointer"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? 'text-plutonic-blue-dark font-medium' : 'text-gray-400'}>
          {value ? formatShort(value) : 'Select a date'}
        </span>
        <svg className="h-5 w-5 shrink-0 text-plutonic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] grid place-items-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Choose date"
          >
            <div className="absolute inset-0 bg-plutonic-dark/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
            <div className="relative z-10 animate-[slide-down_0.25s_ease-out]" onClick={(e) => e.stopPropagation()}>
              <CalendarPanel
                value={value}
                minYmd={minYmd}
                onChange={onChange}
                onClose={() => setOpen(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
