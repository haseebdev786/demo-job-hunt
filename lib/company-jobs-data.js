// Place this file at: lib/company-jobs-data.js
//
// Job Listing (3.9) + Job Detail (3.10 Applicants, 3.11 Pipeline,
// 3.12 Job Details, 3.13 Analytics) for a specific job.
// First 7 job rows are EXACTLY the 3.9 screenshot's rows.
// The screenshot's pagination shows pages 1 and 2, so 4 filler
// jobs are added after them (total 11) -- those 4 are NOT from
// the screenshot, they are demo fillers so page 2 is not empty.
// The second "Kotlin Developer" row in the screenshot is a
// duplicate of the first one (same dates/counts) -- it is kept
// as a separate row with slug kotlin-developer-2, as in the
// screenshot, not merged.
// Social Media Assistant's detail (description, responsibilities,
// Who You Are, Nice-To-Haves, perks, About this role, analytics)
// IS from screenshots 3.12 / 3.13. Other jobs get a generated
// detail (title/type/dates/counts based) -- see the detail page.
// Analytics note: Traffic channel percentages in the screenshot
// add up to 111% (48+33+24+6), not 100% -- the donut below
// normalises them to 100% for drawing, but labels show the
// screenshot percentages. Visitors by country and Total Views /
// Applied are screenshot values for Social Media Assistant.

export const companyJobs = [
  { slug: "social-media-assistant", role: "Social Media Assistant", status: "Live", datePosted: "20 May, 2020", dueDate: "24 May, 2020", jobType: "Fulltime", applicants: 19, needs: "4 / 11" },
  { slug: "senior-designer", role: "Senior Designer", status: "Live", datePosted: "16 May, 2020", dueDate: "24 May, 2020", jobType: "Fulltime", applicants: 1234, needs: "0 / 20" },
  { slug: "visual-designer", role: "Visual Designer", status: "Live", datePosted: "15 May, 2020", dueDate: "24 May, 2020", jobType: "Freelance", applicants: 2435, needs: "1 / 5" },
  { slug: "data-science", role: "Data Science", status: "Closed", datePosted: "13 May, 2020", dueDate: "24 May, 2020", jobType: "Freelance", applicants: 6234, needs: "10 / 10" },
  { slug: "kotlin-developer", role: "Kotlin Developer", status: "Closed", datePosted: "12 May, 2020", dueDate: "24 May, 2020", jobType: "Fulltime", applicants: 12, needs: "20 / 20" },
  { slug: "react-developer", role: "React Developer", status: "Closed", datePosted: "11 May, 2020", dueDate: "24 May, 2020", jobType: "Fulltime", applicants: 14, needs: "10 / 10" },
  { slug: "kotlin-developer-2", role: "Kotlin Developer", status: "Closed", datePosted: "12 May, 2020", dueDate: "24 May, 2020", jobType: "Fulltime", applicants: 12, needs: "20 / 20" },
  // Demo fillers for page 2 -- not from the screenshot.
  { slug: "product-designer", role: "Product Designer", status: "Live", datePosted: "10 May, 2020", dueDate: "24 May, 2020", jobType: "Fulltime", applicants: 32, needs: "2 / 8" },
  { slug: "ui-designer", role: "UI Designer", status: "Live", datePosted: "9 May, 2020", dueDate: "24 May, 2020", jobType: "Freelance", applicants: 21, needs: "1 / 4" },
  { slug: "content-writer", role: "Content Writer", status: "Closed", datePosted: "8 May, 2020", dueDate: "24 May, 2020", jobType: "Fulltime", applicants: 18, needs: "3 / 3" },
  { slug: "marketing-manager", role: "Marketing Manager", status: "Live", datePosted: "7 May, 2020", dueDate: "24 May, 2020", jobType: "Fulltime", applicants: 27, needs: "0 / 6" },
];

export function getCompanyJobBySlug(slug) {
  return companyJobs.find((j) => j.slug === slug) || null;
}

// Social Media Assistant detail, from screenshot 3.12.
// Note: the description in the screenshot says "Stripe is looking
// for..." even though the job is listed under Nomad -- that is
// the template's own text, kept as-is here.
export const socialMediaAssistantDetail = {
  description:
    "Stripe is looking for Social Media Marketing expert to help manage our online networks. You will be responsible for monitoring our social media channels, creating content, finding effective ways to engage the community and incentivize others to engage on our channels.",
  responsibilities: [
    "Community engagement to ensure that is supported and actively represented online",
    "Focus on social media content development and publication",
    "Marketing and strategy support",
    "Stay on top of trends on social media platforms, and suggest content ideas to the team",
    "Engage with online communities",
  ],
  whoYouAre: [
    "You get energy from people and building the ideal work environment",
    "You have a sense for beautiful spaces and office experiences",
    "You are a confident office manager, ready for added responsibilities",
    "You're detail-oriented and creative",
    "You're a growth marketer and know how to run campaigns",
  ],
  niceToHaves: ["Fluent in English", "Project management skills", "Copy editing skills"],
  perks: [
    { title: "Full Healthcare", text: "We believe in thriving communities and that starts with our team being happy and healthy." },
    { title: "Unlimited Vacation", text: "We believe you should have a flexible schedule that makes space for family, wellness, and fun." },
    { title: "Skill Development", text: "We believe in always learning and leveling up our skills. Whether it's a conference or online course." },
    { title: "Team Summits", text: "Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter." },
    { title: "Remote Working", text: "You know how you perform your best. Work from home, coffee shop or anywhere when you feel like it." },
    { title: "Commuter Benefits", text: "We're grateful for all the time and energy each team member puts into getting to work every day." },
    { title: "We give back", text: "We anonymously match any donation our employees make (up to $/€ 600) so they can support the organizations they care about most, times two." },
  ],
  aboutRole: {
    applied: "6 applied of 10 capacity",
    applyBefore: "July 31, 2021",
    jobPostedOn: "July 1, 2021",
    jobType: "Full-Time",
    salary: "$75k-$85k USD",
  },
  categories: ["Marketing", "Design"],
  requiredSkills: ["Project Management", "Copywriting", "Social Media Marketing", "English", "Copy Editing"],
  analytics: {
    totalViews: 23564,
    totalViewsChange: "5.4%",
    totalApplied: 132,
    viewStats: [
      { date: "19 Jul", views: 380 },
      { date: "20 Jul", views: 120 },
      { date: "21 Jul", views: 280 },
      { date: "22 Jul", views: 520 },
      { date: "23 Jul", views: 243 },
      { date: "24 Jul", views: 300 },
      { date: "25 Jul", views: 380 },
    ],
    trafficChannel: [
      { label: "Direct", percent: 48, color: "#7C6CF0" },
      { label: "Social", percent: 33, color: "#3B82F6" },
      { label: "Organic", percent: 24, color: "#F59E0B" },
      { label: "Other", percent: 6, color: "#EF4444" },
    ],
    visitorsByCountry: [
      { country: "USA", code: "US", visitors: 3240 },
      { country: "France", code: "FR", visitors: 3188 },
      { country: "Italy", code: "IT", visitors: 2938 },
      { country: "Germany", code: "DE", visitors: 2424 },
      { country: "Japan", code: "JP", visitors: 2414 },
    ],
  },
};

// Pipeline View applicants for a job (3.11). Names in the pipeline
// screenshot are different from the Table View list (3.10), and
// its column counts (In Review 10, Shortlisted 8, Interview 11,
// Hired 3) add up to more than the Table View total of 19 --
// the screenshots do not agree with each other. So the pipeline
// list below is its OWN demo list, built from the visible
// pipeline names first, then fillers to reach the screenshot
// column counts. Table View (3.10) uses companyApplicants (19).
// If you want ONE consistent list for both views, that is a
// separate unification step -- tell me and I will merge them.
const pipelineNames = {
  "In Review": ["Jake Gyll", "Jenny Wilson", "Jacob Jones", "Wade Warren", "Albert Flores", "Bessie Cooper", "Darlene Robertson", "Cody Fisher", "Dianne Russell", "Esther Howard"],
  Shortlisted: ["Jane Cooper", "Courtney Henry", "Marvin McKinney", "Arlene McCoy", "Devon Lane", "Kristin Watson", "Theresa Webb", "Ralph Edwards"],
  Interview: ["Floyd Miles", "Devon Lane", "Ronald Richards", "Jerome Bell", "Guy Hawkins", "Cyndy Lillibridge", "Leif Floyd", "Eleanor Pena", "Darrell Steward", "Kathryn Murphy", "Thad Eddings"],
  Hired: ["Annette Black", "Leslie Alexander", "Marvin McKinney"],
  Declined: ["Rodolfo Goode", "Cameron Williamson", "Robert Fox", "Savannah Nguyen", "Annette Black"],
};

export const pipelineApplicants = Object.entries(pipelineNames).flatMap(([stage, names]) =>
  names.map((name, i) => ({
    id: `${stage.toLowerCase().replace(/ /g, "-")}-${name.toLowerCase().replace(/[^a-z ]/g, "").replace(/ /g, "-")}-${i}`,
    name,
    stage,
    appliedDate: "13 July, 2021",
    score: name === "Jake Gyll" ? 4.0 : 0.0,
  }))
);
