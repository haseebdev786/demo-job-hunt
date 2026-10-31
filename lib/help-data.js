// Place this file at: lib/help-data.js
//
// Help Center articles (2.12 Dashboard - Help). These are editorial
// help content, not user data, so they live here as a static list --
// like lib/jobs.js and lib/companies.js -- not in MongoDB. Edit an
// article here and it updates on /dashboard/help at once.
// Categories and the first three articles are exactly the reference
// screenshot (Getting Started tab, with its three articles and their
// exact bodies). The other categories have realistic articles about
// the JobHunt features already built in this project (Profile,
// Applications, Settings, Messages, Find Jobs, Notifications).
// "Was this article helpful?" votes are local state in the page
// component for now (see HelpCenterPage.jsx) -- they are not saved
// to MongoDB yet, so a vote does not persist after reload.

export const HELP_CATEGORIES = [
  "Getting Started",
  "My Profile",
  "Applying for a job",
  "Job Search Tips",
  "Job Alerts",
];

export const helpArticles = [
  // ----- Getting Started (reference articles, exact titles/bodies) -----
  {
    slug: "what-is-my-applications",
    title: "What is My Applications?",
    category: "Getting Started",
    body: "My Applications is a way for you to track jobs as you move through the application process. Depending on the job you applied to, you may also receive notifications indicating that an application has been actioned by an employer.",
  },
  {
    slug: "how-to-access-my-applications-history",
    title: "How to access my applications history",
    category: "Getting Started",
    body: "To access applications history, go to your My Applications page on your dashboard profile. You must be signed in to your JobHuntly account to view this page.",
  },
  {
    slug: "not-seeing-jobs-you-applied-in-your-my-application-list",
    title: "Not seeing jobs you applied in your my application list?",
    category: "Getting Started",
    body: "Please note that we are unable to track materials submitted for jobs you apply to via an employer's site. As a result, these applications are not recorded in the My Applications section of your JobHuntly account. We suggest keeping a personal record of all positions you have applied to externally.",
  },
  // ----- My Profile -----
  {
    slug: "how-do-i-update-my-profile",
    title: "How do I update my profile?",
    category: "My Profile",
    body: "Go to My Public Profile in the dashboard sidebar to see your profile, or go to Settings to change your name, phone number, date of birth, gender and account type. Changes you save in Settings are stored in MongoDB and appear on your profile on the next load.",
  },
  {
    slug: "how-do-i-change-my-profile-photo",
    title: "How do I change my profile photo?",
    category: "My Profile",
    body: "Your profile photo comes from the avatar set on your account. In Settings, the Profile Photo box lets you preview a new photo. Photo upload needs a file-storage backend, so for a real photo today, set avatarUrl on your user in MongoDB to an image URL.",
  },
  {
    slug: "what-does-open-for-opportunities-mean",
    title: "What does Open for Opportunities mean?",
    category: "My Profile",
    body: "When this badge is shown on your profile, it means you are open to new job opportunities and recruiters can see that you are looking. It is set on your profile in MongoDB (openForOpportunities) and can be turned on or off there.",
  },
  // ----- Applying for a job -----
  {
    slug: "how-do-i-apply-for-a-job",
    title: "How do I apply for a job?",
    category: "Applying for a job",
    body: "Find a job on Find Jobs, open its job description, and click Apply. Fill in your name, email, phone, job title, LinkedIn or portfolio links, cover letter and resume, then click Submit Application. The application form is demo-only for now -- submissions are not yet saved to MongoDB, so a real application save is a separate next step.",
  },
  {
    slug: "what-happens-after-i-apply",
    title: "What happens after I apply?",
    category: "Applying for a job",
    body: "Once applications are saved to MongoDB, they appear on your My Applications page with a status such as In Review, Interviewing or Unsuitable, and on the Dashboard overview with your total jobs applied and interviewed counts. Until the application save is connected, the form shows a demo success message only.",
  },
  {
    slug: "can-i-withdraw-an-application",
    title: "Can I withdraw an application?",
    category: "Applying for a job",
    body: "There is no withdraw button in the dashboard yet. If you need to withdraw, contact the employer directly, or contact customer service from the Help Center card on this page with the job title and the date you applied.",
  },
  // ----- Job Search Tips -----
  {
    slug: "how-do-i-search-for-jobs",
    title: "How do I search for jobs?",
    category: "Job Search Tips",
    body: "On Find Jobs, type a job title or keyword in the search box and choose a location, then click Search. You can also click a Popular term under the search box to search for it at once.",
  },
  {
    slug: "how-do-i-use-job-filters",
    title: "How do I use job filters?",
    category: "Job Search Tips",
    body: "On Find Jobs, use Type of Employment, Categories, Job Level and Salary Range on the left to narrow the list. The counts next to each filter are calculated from the real jobs list, and you can switch between grid and list view and sort by newest, salary or title.",
  },
  {
    slug: "how-do-i-save-a-job",
    title: "How do I save a job?",
    category: "Job Search Tips",
    body: "On a job description page, click the heart icon next to Share and Apply to save that job locally in your browser. Saved jobs are a local toggle for now -- they are not yet saved to your MongoDB account, so they do not carry across devices.",
  },
  // ----- Job Alerts -----
  {
    slug: "how-do-i-set-up-job-alerts",
    title: "How do I set up job alerts?",
    category: "Job Alerts",
    body: "Job alerts are controlled from Settings, on the Notifications tab. Turn on Jobs to get notifications for job openings that suit your profile, and Applications to get notifications for jobs you have applied to.",
  },
  {
    slug: "how-do-i-turn-off-job-alerts",
    title: "How do I turn off job alerts?",
    category: "Job Alerts",
    body: "Go to Settings, then Notifications, uncheck the alert types you no longer want, and click Update. Your preferences are saved in MongoDB and apply on the next load.",
  },
  {
    slug: "why-am-i-not-receiving-job-alerts",
    title: "Why am I not receiving job alerts?",
    category: "Job Alerts",
    body: "First check Settings, then Notifications, and make sure the alert type is checked and saved. Then check the bell icon on the Dashboard -- notifications appear there. If you applied for a job on an employer's own site, that application is not tracked here, so no alert is generated for it.",
  },
];
