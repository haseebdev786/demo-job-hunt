// Place this file at: lib/company-schedule-data.js
//
// My Schedule (3.14 Dashboard Company - Interview Schedule).
// DESIGN data, from the screenshot exactly:
//   - Default month: NOVEMBER 2021, selected day 24 (purple circle).
//   - Week view days: SUN 23, MON 24, TUE 25, WED 26, THU 27, FRI 28.
//   - THU 27 is a Holiday (red strip, pink column).
//   - Events (all in the screenshot's week):
//       MON 24, 02:00 - 05:00 AM: Interview with Kathryn Murphy
//         (Interview Schedule, blue)
//       MON 24, 08:00 - 09:00 AM: Interview session
//         (Interview Schedule, blue, title truncated in screenshot)
//       WED 26, 09:00 - 10:00 AM: Meeting with Sarah
//         (Internal Meeting, green, title truncated in screenshot)
//   - Categories: Interview Schedule (purple, checked),
//     Internal Meeting (green, checked), Team Schedule, My Task,
//     Reminders (all unchecked, no events in the demo week).
// NOTE on the calendar grid: the screenshot's November 2021 grid
// is a TEMPLATE grid, not the real 2021 calendar (in real life
// 1 Nov 2021 was a Monday, in the screenshot 1 Nov is a Saturday
// and 23 Nov is a Sunday). To be same-to-same, the mini calendar
// grid below is kept EXACTLY as in the screenshot for November
// 2021. Other months, when you navigate with < >, use a real
// calendar grid. Events added with Create Event / Add Category
// are LOCAL state only (see the page component) -- not saved
// to MongoDB yet.

export const scheduleMiniCalendarNov2021 = [
  // Each row: 7 cells, Sun first. grey = other month, black = November.
  [
    { date: 26, inMonth: false }, { date: 27, inMonth: false }, { date: 28, inMonth: false },
    { date: 29, inMonth: false }, { date: 30, inMonth: false }, { date: 31, inMonth: false },
    { date: 1, inMonth: true },
  ],
  [
    { date: 2, inMonth: true }, { date: 3, inMonth: true }, { date: 4, inMonth: true },
    { date: 5, inMonth: true }, { date: 6, inMonth: true }, { date: 7, inMonth: true },
    { date: 8, inMonth: true },
  ],
  [
    { date: 9, inMonth: true }, { date: 10, inMonth: true }, { date: 11, inMonth: true },
    { date: 12, inMonth: true }, { date: 13, inMonth: true }, { date: 14, inMonth: true },
    { date: 15, inMonth: true },
  ],
  [
    { date: 16, inMonth: true }, { date: 17, inMonth: true }, { date: 18, inMonth: true },
    { date: 19, inMonth: true }, { date: 20, inMonth: true }, { date: 21, inMonth: true },
    { date: 22, inMonth: true },
  ],
  [
    { date: 23, inMonth: true }, { date: 24, inMonth: true }, { date: 25, inMonth: true },
    { date: 26, inMonth: true }, { date: 27, inMonth: true }, { date: 28, inMonth: true },
    { date: 29, inMonth: true },
  ],
  [
    { date: 30, inMonth: true }, { date: 31, inMonth: true },
    { date: 1, inMonth: false }, { date: 2, inMonth: false }, { date: 3, inMonth: false },
    { date: 4, inMonth: false }, { date: 5, inMonth: false },
  ],
];

export const scheduleWeekDays = [
  { weekday: "SUN", date: 23 },
  { weekday: "MON", date: 24 },
  { weekday: "TUE", date: 25 },
  { weekday: "WED", date: 26 },
  { weekday: "THU", date: 27 },
  { weekday: "FRI", date: 28 },
];

export const scheduleCategories = [
  { id: "interview", label: "Interview Schedule", color: "bg-indigo-600", checkedColor: "accent-indigo-600", checked: true },
  { id: "internal", label: "Internal Meeting", color: "bg-emerald-500", checkedColor: "accent-emerald-500", checked: true },
  { id: "team", label: "Team Schedule", color: "bg-amber-400", checkedColor: "accent-amber-400", checked: false },
  { id: "task", label: "My Task", color: "bg-sky-500", checkedColor: "accent-sky-500", checked: false },
  { id: "reminders", label: "Reminders", color: "bg-rose-400", checkedColor: "accent-rose-400", checked: false },
];

export const scheduleEvents = [
  {
    id: "interview-kathryn",
    title: "Interview with Kathryn Murphy",
    categoryId: "interview",
    dayDate: 24,
    startHour: 2,
    endHour: 5,
    timeLabel: "02:00 - 05:00 AM",
    color: "bg-sky-500",
  },
  {
    id: "interview-session",
    title: "Interview session",
    categoryId: "interview",
    dayDate: 24,
    startHour: 8,
    endHour: 9,
    timeLabel: "08:00 - 09:00 AM",
    color: "bg-sky-500",
  },
  {
    id: "meeting-sarah",
    title: "Meeting with Sarah",
    categoryId: "internal",
    dayDate: 26,
    startHour: 9,
    endHour: 10,
    timeLabel: "09:00 - 10:00 AM",
    color: "bg-emerald-500",
  },
];

export const scheduleHoliday = { dayDate: 27, label: "Holiday" };

// Time slots down the left of the week view, exactly as in the screenshot.
export const scheduleTimeSlots = ["GMT -07", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 AM"];
