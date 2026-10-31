// Place this file at: lib/company-dashboard-data.js
// (REPLACES the previous version of this file.)
//
// Company dashboard data (3.1 Dashboard Company).
// CHANGED in this version:
//   - Job statistics chart is now a STACKED bar chart, like the new
//     reference crop: bottom segment = Job Applied (purple),
//     top segment = Job View (orange). Tue's tooltip values are
//     122 (Job Applied) and 34 (Job View), exactly like the crop.
//   - Job statistics now has per-period summary cards:
//     Job Views 2,342 (This Week, +6.4%) and Job Applied 654
//     (This Week, -0.5%), like the crop. Month / Year values are
//     scaled demo values for those tabs.
//   - Company name / user name are NO LONGER in this file.
//     They come from the logged-in session (lib/company-session-data.js)
//     and are passed in as props. The "Nomad" / "Maria Kelly" below
//     in jobUpdates are template demo jobs only -- see that note.
// DESIGN VERSION for the numbers: stat cards, chart and summary
// totals are still screenshot demo numbers, not live MongoDB counts
// yet (the screenshot totals are inconsistent with each other --
// e.g. chart daily values do not sum to 2,342 / 654, and the
// Applicants Summary breakdown sums to 153, not 67). A real MongoDB
// wiring will give different, consistent numbers.

export const companyDashboardData = {
  dateRange: "Jul 19 - Jul 25",
  stats: [
    { id: "candidates", value: 76, label: "New candidates to review", href: "/company/applicants", color: "bg-indigo-600" },
    { id: "schedule", value: 3, label: "Schedule for today", href: "/company/schedule", color: "bg-emerald-500" },
    { id: "messages", value: 24, label: "Messages received", href: "/company/messages", color: "bg-cyan-500" },
  ],
  jobsOpen: 12,
  applicantsSummary: {
    total: 67,
    breakdown: [
      { label: "Full Time", count: 45, color: "bg-indigo-600" },
      { label: "Part-Time", count: 24, color: "bg-emerald-500" },
      { label: "Internship", count: 32, color: "bg-amber-400" },
      { label: "Contract", count: 30, color: "bg-rose-400" },
      { label: "Remote", count: 22, color: "bg-cyan-500" },
    ],
  },
  // Stacked chart: view = orange top segment, applied = purple bottom.
  // Week values are chosen so the bar shapes look like the crop:
  // Mon high, Tue medium (122 applied / 34 view in its tooltip),
  // Wed low, Thu high, Fri high, Sat low, Sun medium.
  chart: {
    Week: [
      { label: "Mon", view: 95, applied: 85 },
      { label: "Tue", view: 34, applied: 122 },
      { label: "Wed", view: 65, applied: 45 },
      { label: "Thu", view: 55, applied: 110 },
      { label: "Fri", view: 105, applied: 55 },
      { label: "Sat", view: 45, applied: 35 },
      { label: "Sun", view: 20, applied: 95 },
    ],
    Month: [
      { label: "Week 1", view: 320, applied: 410 },
      { label: "Week 2", view: 380, applied: 520 },
      { label: "Week 3", view: 340, applied: 460 },
      { label: "Week 4", view: 410, applied: 580 },
    ],
    Year: [
      { label: "Jan", view: 900, applied: 1100 },
      { label: "Feb", view: 1050, applied: 1250 },
      { label: "Mar", view: 980, applied: 1150 },
      { label: "Apr", view: 1200, applied: 1400 },
      { label: "May", view: 1150, applied: 1350 },
      { label: "Jun", view: 1300, applied: 1500 },
      { label: "Jul", view: 1250, applied: 1450 },
      { label: "Aug", view: 1100, applied: 1300 },
      { label: "Sep", view: 1180, applied: 1380 },
      { label: "Oct", view: 1280, applied: 1480 },
      { label: "Nov", view: 1350, applied: 1550 },
      { label: "Dec", view: 1420, applied: 1650 },
    ],
  },
  // Summary cards per period, like the crop (Week values are exact).
  summaries: {
    Week: {
      label: "This Week",
      views: 2342, viewsChange: "6.4%", viewsUp: true,
      applied: 654, appliedChange: "0.5%", appliedUp: false,
    },
    Month: {
      label: "This Month",
      views: 9842, viewsChange: "4.1%", viewsUp: true,
      applied: 2654, appliedChange: "1.2%", appliedUp: true,
    },
    Year: {
      label: "This Year",
      views: 124320, viewsChange: "12.8%", viewsUp: true,
      applied: 38420, appliedChange: "3.4%", appliedUp: true,
    },
  },
  // Job Updates cards: template demo jobs for Nomad (that is why
  // every card says Nomad - Paris, France in the screenshot).
  // In the user's lib/jobs.js these titles belong to different
  // companies -- these four cards are Nomad's template demo jobs,
  // not the public jobs list. When a real company logs in, this
  // list should be that company's jobs from MongoDB / lib/jobs.
  jobUpdates: [
    {
      title: "Social Media Assistant",
      company: "Nomad",
      location: "Paris, France",
      type: "Full-Time",
      categories: ["Marketing", "Design"],
      applied: 5,
      capacity: 10,
      logo: "N",
      logoBg: "bg-emerald-50",
      logoColor: "text-emerald-500",
    },
    {
      title: "Brand Designer",
      company: "Nomad",
      location: "Paris, France",
      type: "Full-Time",
      categories: ["Business", "Design"],
      applied: 5,
      capacity: 10,
      logo: "N",
      logoBg: "bg-emerald-50",
      logoColor: "text-emerald-500",
    },
    {
      title: "Interactive Developer",
      company: "Nomad",
      location: "Paris, France",
      type: "Full-Time",
      categories: ["Marketing", "Design"],
      applied: 5,
      capacity: 10,
      logo: "N",
      logoBg: "bg-emerald-50",
      logoColor: "text-emerald-500",
    },
    {
      title: "Product Designer",
      company: "Nomad",
      location: "Paris, France",
      type: "Full-Time",
      categories: ["Business", "Design"],
      applied: 5,
      capacity: 10,
      logo: "N",
      logoBg: "bg-emerald-50",
      logoColor: "text-emerald-500",
    },
  ],
};
