"use client";

// Place this file at: components/company/CompanySchedulePage.jsx
// My Schedule (3.14), inside the company layout, same-to-same as
// the screenshot -- no extra sections added.
// Left column: + Create Event, mini calendar (NOVEMBER 2021,
// 24 selected in purple), Categories + Add Category.
// Right: My Schedule + Today, < NOVEMBER 2021 > navigation,
// Day / Week / Month tabs (Week default, like the screenshot),
// week grid: SUN 23 - FRI 28, time slots GMT -07 / 1 AM - 12 AM,
// THU 27 pink column with Holiday strip, events:
//   MON 24, 02:00-05:00 AM: Interview with Kathryn Murphy (blue)
//   MON 24, 08:00-09:00 AM: Interview session (blue)
//   WED 26, 09:00-10:00 AM: Meeting with Sarah (green)
// What IS functional (not just a picture):
//   - Category checkboxes hide/show that category's events.
//   - Day view shows one day's events, Month view shows the full
//     month grid with event labels on 24 / 26 / 27, clicking a
//     day in Month view opens that day.
//   - Today resets to November 2021, day 24, Week view.
//   - < > change the month label (and the mini calendar grid
//     for other months); the week stays on days 23-28, like the
//     screenshot's week, so the initial view stays exact.
//   - Create Event and Add Category add items LOCAL state only
//     for now -- they are NOT saved to MongoDB yet, so they do
//     not persist after reload. That is stated in both modals.
// Company name in the header comes from props (session).

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import {
  scheduleCategories,
  scheduleEvents,
  scheduleHoliday,
  scheduleMiniCalendarNov2021,
  scheduleTimeSlots,
  scheduleWeekDays,
} from "@/lib/company-schedule-data";

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

function monthLabel(offset) {
  // Base: November 2021, offset in months.
  const baseIndex = 10; // November
  const total = baseIndex + offset;
  const year = 2021 + Math.floor(total / 12);
  const monthIndex = ((total % 12) + 12) % 12;
  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

function realMonthGrid(year, monthIndex) {
  // Real calendar grid for a month (Sun first), used only when the
  // user navigates away from November 2021. November 2021 itself
  // uses the screenshot grid (see the data file note).
  const first = new Date(year, monthIndex, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
  const cells = [];
  for (let i = startDay - 1; i >= 0; i--) cells.push({ date: daysInPrevMonth - i, inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: d, inMonth: true });
  while (cells.length % 7 !== 0) cells.push({ date: cells.length - (startDay + daysInMonth) + 1, inMonth: false });
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

function MiniCalendar({ monthOffset, selectedDate, onSelectDate }) {
  const label = monthLabel(monthOffset);
  const isNov2021 = monthOffset === 0;
  let grid;
  if (isNov2021) {
    grid = scheduleMiniCalendarNov2021;
  } else {
    const total = 10 + monthOffset;
    const year = 2021 + Math.floor(total / 12);
    const monthIndex = ((total % 12) + 12) % 12;
    grid = realMonthGrid(year, monthIndex);
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-800">{label}</p>
        <span className="flex gap-1 text-slate-400">
          <span className="cursor-pointer" onClick={() => onSelectDate(null, -1)} aria-label="Previous month"><ChevronLeft size={16} /></span>
          <span className="cursor-pointer" onClick={() => onSelectDate(null, 1)} aria-label="Next month"><ChevronRight size={16} /></span>
        </span>
      </div>
      <div className="mt-3 grid grid-cols-7 text-center text-[11px] text-slate-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 space-y-1">
        {grid.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7 text-center text-xs">
            {row.map((cell, ci) => {
              const isSelected = cell.inMonth && cell.date === selectedDate && isNov2021;
              return (
                <button
                  key={ci}
                  type="button"
                  onClick={() => onSelectDate(cell.inMonth ? cell.date : null, 0)}
                  className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-indigo-600 font-bold text-white"
                      : cell.inMonth
                        ? "text-slate-700 hover:bg-indigo-50"
                        : "text-slate-300"
                  }`}
                >
                  {cell.date}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompanySchedulePage({ companyName = "Nomad", companyInitial = "N" }) {
  const [view, setView] = useState("Week");
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(24);
  const [categories, setCategories] = useState(scheduleCategories);
  const [events, setEvents] = useState(scheduleEvents);
  const [createOpen, setCreateOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", categoryId: "interview", dayDate: 24, startHour: 9, endHour: 10 });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("bg-indigo-600");

  const checkedCategoryIds = useMemo(
    () => new Set(categories.filter((c) => c.checked).map((c) => c.id)),
    [categories]
  );
  const visibleEvents = events.filter((e) => checkedCategoryIds.has(e.categoryId));

  function handleMonthNav(delta) {
    setMonthOffset((o) => o + delta);
  }

  function handleToday() {
    setMonthOffset(0);
    setSelectedDate(24);
    setView("Week");
  }

  function toggleCategory(id) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  }

  const dayEvents = (dayDate) => visibleEvents.filter((e) => e.dayDate === dayDate);
  const selectedDay = scheduleWeekDays.find((d) => d.date === selectedDate) || scheduleWeekDays[1];

  // Week grid geometry: 12 hour rows (1 AM - 12 AM), each 48px.
  const hourHeight = 48;
  const gridHeight = 12 * hourHeight;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Company</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-xl font-black text-emerald-500">
              {companyInitial}
            </span>
            <h1 className="text-2xl font-black text-slate-800">{companyName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Notifications" className="p-2 text-slate-500 hover:text-slate-800">
            <Bell size={20} />
          </button>
          <Link href="/company/jobs/new" className="bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            + Post a job
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">My Schedule</h2>
          <button type="button" onClick={handleToday} className="border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            Today
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleMonthNav(-1)} aria-label="Previous month" className="text-slate-500 hover:text-slate-800">
              <ChevronLeft size={18} />
            </button>
            <p className="text-sm font-bold text-slate-800">{monthLabel(monthOffset)}</p>
            <button type="button" onClick={() => handleMonthNav(1)} aria-label="Next month" className="text-slate-500 hover:text-slate-800">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex gap-4 text-sm">
            {["Day", "Week", "Month"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`pb-1 ${view === v ? "border-b-2 border-indigo-600 font-bold text-slate-800" : "text-slate-500 hover:text-slate-800"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-0 border border-slate-200 bg-white lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left column */}
        <div className="space-y-8 border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
          <button type="button" onClick={() => setCreateOpen(true)} className="flex w-full items-center justify-center gap-2 border border-indigo-200 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
            <Plus size={16} /> Create Event
          </button>

          <MiniCalendar
            monthOffset={monthOffset}
            selectedDate={selectedDate}
            onSelectDate={(date, delta) => {
              if (delta !== 0) handleMonthNav(delta);
              else if (date) {
                setSelectedDate(date);
                setView("Day");
              }
            }}
          />

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">Categories</p>
              <button type="button" onClick={() => setCategoryOpen(true)} className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                <Plus size={14} /> Add Category
              </button>
            </div>
            <div className="mt-3 space-y-2.5">
              {categories.map((cat) => (
                <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={cat.checked} onChange={() => toggleCategory(cat.id)} className={`h-4 w-4 ${cat.checkedColor}`} />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right calendar */}
        <div className="min-w-0">
          {view === "Month" && (
            <div className="p-6">
              <div className="grid grid-cols-7 text-center text-xs text-slate-400">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                  <span key={d} className="py-2">{d}</span>
                ))}
              </div>
              {scheduleMiniCalendarNov2021.map((row, ri) => (
                <div key={ri} className="grid grid-cols-7 border-t border-slate-100">
                  {row.map((cell, ci) => {
                    const cellEvents = cell.inMonth ? dayEvents(cell.date) : [];
                    const isHoliday = cell.inMonth && cell.date === scheduleHoliday.dayDate;
                    return (
                      <button
                        key={ci}
                        type="button"
                        onClick={() => {
                          if (cell.inMonth) {
                            setSelectedDate(cell.date);
                            setView("Day");
                          }
                        }}
                        className={`min-h-[80px] border-r border-slate-100 p-2 text-left align-top ${cell.inMonth ? "" : "text-slate-300"} ${isHoliday ? "bg-rose-50" : ""}`}
                      >
                        <span className={`text-sm ${cell.date === selectedDate && cell.inMonth ? "font-bold text-indigo-600" : ""}`}>{cell.date}</span>
                        {isHoliday && <span className="mt-1 block bg-red-400 px-1 py-0.5 text-[10px] text-white">Holiday</span>}
                        {cellEvents.map((e) => (
                          <span key={e.id} className={`mt-1 block truncate px-1 py-0.5 text-[10px] text-white ${e.color}`}>{e.title}</span>
                        ))}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {view === "Day" && (
            <div className="p-6">
              <p className="text-sm font-bold text-slate-800">
                {selectedDay.weekday} {selectedDay.date} - {monthLabel(monthOffset)}
              </p>
              <div className="mt-4 space-y-3">
                {dayEvents(selectedDate).length === 0 && (
                  <p className="text-sm text-slate-500">No events on this day.</p>
                )}
                {dayEvents(selectedDate).map((e) => (
                  <div key={e.id} className={`border-l-4 p-4 text-white ${e.color}`}>
                    <p className="font-bold">{e.title}</p>
                    <p className="text-xs">{e.timeLabel}</p>
                  </div>
                ))}
                {selectedDate === scheduleHoliday.dayDate && (
                  <p className="bg-red-400 px-4 py-2 text-sm text-white">Holiday</p>
                )}
              </div>
            </div>
          )}

          {view === "Week" && (
            <div>
              {/* Week header */}
              <div className="grid grid-cols-[64px_repeat(6,1fr)] border-b border-slate-200 text-center">
                <span />
                {scheduleWeekDays.map((d) => (
                  <div key={d.date} className={`py-3 ${d.date === scheduleHoliday.dayDate ? "bg-rose-50" : ""}`}>
                    <p className="text-[11px] text-slate-400">{d.weekday}</p>
                    <p className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${d.date === selectedDate ? "bg-indigo-600 text-white" : "text-slate-800"}`}>
                      {d.date}
                    </p>
                    {d.date === scheduleHoliday.dayDate && (
                      <p className="mx-2 mt-1 bg-red-400 py-0.5 text-[10px] text-white">Holiday</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Week grid + events overlay */}
              <div className="relative">
                <div className="grid grid-cols-[64px_repeat(6,1fr)]">
                  <div>
                    {scheduleTimeSlots.map((slot, i) => (
                      <div key={slot} style={{ height: i === 0 ? 24 : hourHeight }} className="flex items-start justify-end pr-2 text-[11px] text-slate-400">
                        {slot}
                      </div>
                    ))}
                  </div>
                  {scheduleWeekDays.map((d) => (
                    <div key={d.date} className={d.date === scheduleHoliday.dayDate ? "bg-rose-50" : ""}>
                      {/* 24px spacer = GMT row, so day grid lines line up with the time labels */}
                      <div style={{ height: 24 }} />
                      {Array.from({ length: 12 }, (_, i) => (
                        <div key={i} style={{ height: hourHeight }} className="border-l border-t border-slate-100" />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Events overlay: left offset = time column (64px), day width = 1/6 of remaining width */}
                <div className="absolute inset-y-0 right-0" style={{ left: 64, top: 24, height: gridHeight }}>
                  <div className="relative h-full w-full">
                    {visibleEvents.map((e) => {
                      const dayIndex = scheduleWeekDays.findIndex((d) => d.date === e.dayDate);
                      if (dayIndex < 0) return null;
                      const top = (e.startHour - 1) * hourHeight;
                      const height = (e.endHour - e.startHour) * hourHeight;
                      return (
                        <div
                          key={e.id}
                          className={`absolute overflow-hidden p-2 text-white ${e.color}`}
                          style={{
                            left: `calc(${(dayIndex / 6) * 100}% + 2px)`,
                            width: `calc(${100 / 6}% - 4px)`,
                            top,
                            height,
                          }}
                        >
                          <p className="truncate text-xs font-semibold">{e.title}</p>
                          <p className="text-[10px]">{e.timeLabel}</p>
                          {e.id === "interview-kathryn" && (
                            <div className="mt-2 flex">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-700">K</span>
                              <span className="-ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">M</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Event modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setCreateOpen(false)}>
          <div className="w-full max-w-md bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-800">Create Event</h2>
              <button type="button" onClick={() => setCreateOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-800"><X size={20} /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newEvent.title.trim()) return;
                const cat = categories.find((c) => c.id === newEvent.categoryId);
                setEvents((prev) => [
                  ...prev,
                  {
                    id: `event-${Date.now()}`,
                    title: newEvent.title.trim(),
                    categoryId: newEvent.categoryId,
                    dayDate: newEvent.dayDate,
                    startHour: newEvent.startHour,
                    endHour: Math.max(newEvent.endHour, newEvent.startHour + 1),
                    timeLabel: `${String(newEvent.startHour).padStart(2, "0")}:00 - ${String(Math.max(newEvent.endHour, newEvent.startHour + 1)).padStart(2, "0")}:00 AM`,
                    color: cat ? cat.color : "bg-indigo-600",
                  },
                ]);
                setNewEvent({ title: "", categoryId: "interview", dayDate: 24, startHour: 9, endHour: 10 });
                setCreateOpen(false);
              }}
              className="mt-4 space-y-4"
            >
              <input required value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Event title" className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              <select value={newEvent.categoryId} onChange={(e) => setNewEvent({ ...newEvent, categoryId: e.target.value })} className="w-full border border-slate-300 px-3 py-2 text-sm outline-none">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <select value={newEvent.dayDate} onChange={(e) => setNewEvent({ ...newEvent, dayDate: Number(e.target.value) })} className="w-full border border-slate-300 px-3 py-2 text-sm outline-none">
                {scheduleWeekDays.map((d) => (
                  <option key={d.date} value={d.date}>{d.weekday} {d.date}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" min={1} max={12} value={newEvent.startHour} onChange={(e) => setNewEvent({ ...newEvent, startHour: Number(e.target.value) })} className="border border-slate-300 px-3 py-2 text-sm outline-none" aria-label="Start hour" />
                <input type="number" min={1} max={12} value={newEvent.endHour} onChange={(e) => setNewEvent({ ...newEvent, endHour: Number(e.target.value) })} className="border border-slate-300 px-3 py-2 text-sm outline-none" aria-label="End hour" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Create Event</button>
              <p className="text-xs text-slate-400">This event is local only for now -- it is not saved to MongoDB yet.</p>
            </form>
          </div>
        </div>
      )}

      {/* Add Category modal */}
      {categoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setCategoryOpen(false)}>
          <div className="w-full max-w-sm bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-800">Add Category</h2>
              <button type="button" onClick={() => setCategoryOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-800"><X size={20} /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCategoryName.trim()) return;
                setCategories((prev) => [
                  ...prev,
                  { id: `cat-${Date.now()}`, label: newCategoryName.trim(), color: newCategoryColor, checkedColor: "accent-indigo-600", checked: true },
                ]);
                setNewCategoryName("");
                setCategoryOpen(false);
              }}
              className="mt-4 space-y-4"
            >
              <input required value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Category name" className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              <select value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="w-full border border-slate-300 px-3 py-2 text-sm outline-none">
                <option value="bg-indigo-600">Purple</option>
                <option value="bg-emerald-500">Green</option>
                <option value="bg-amber-400">Yellow</option>
                <option value="bg-sky-500">Blue</option>
                <option value="bg-rose-400">Red</option>
              </select>
              <button type="submit" className="w-full bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Add Category</button>
              <p className="text-xs text-slate-400">This category is local only for now -- it is not saved to MongoDB yet.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
