// Place this file at: lib/company-profile-data.js
//
// Company Profile (3.3 Dashboard Company - Company Profile).
// IMPORTANT: the 3.3 screenshot the user sent is very small and
// low-resolution, so most of its small text (exact about paragraph,
// team member names, office list) cannot be read exactly. The
// structure below follows what IS visible: about paragraph, Tech
// Stack icons, Contact, Offices, Working-at photo grid, Team,
// Benefits, Open Jobs. The values are Nomad demo values -- replace
// them here with your real company data. Company NAME itself is
// NOT in this file: it comes from the logged-in session (see the
// route file), so a different company sees its own name at the top.
// Photos: no image files are in the repo, so Working-at photos are
// coloured placeholder tiles -- replace photoLabel tiles with
// <img> files in public/ when you have real office photos.
// Team avatars are initial letters, same as everywhere else.

export const companyProfileData = {
  about:
    "Nomad is a digital product studio that designs and builds web and mobile products for startups and global brands. We work remotely from offices around the world, and we hire designers, engineers and product people who care about clean, useful products.",
  techStack: [
    { name: "HTML5", color: "bg-orange-500" },
    { name: "CSS3", color: "bg-sky-500" },
    { name: "JavaScript", color: "bg-yellow-400" },
    { name: "React", color: "bg-cyan-500" },
    { name: "Node.js", color: "bg-emerald-500" },
    { name: "Figma", color: "bg-violet-500" },
  ],
  contact: {
    email: "hello@nomad.com",
    website: "www.nomad.com",
    twitter: "twitter.com/nomad",
    facebook: "facebook.com/nomad",
    linkedin: "linkedin.com/company/nomad",
  },
  offices: ["United States", "England", "Australia", "Canada"],
  workingPhotos: [
    { label: "Office - Team meeting", color: "bg-indigo-200" },
    { label: "Office - Workspace", color: "bg-emerald-200" },
    { label: "Office - Lounge", color: "bg-amber-200" },
    { label: "Office - Collaboration", color: "bg-rose-200" },
  ],
  team: [
    { name: "Maria Kelly", role: "Founder / CEO" },
    { name: "James Gardner", role: "Product Designer" },
    { name: "Allison Geidt", role: "Engineer" },
    { name: "Ruben Culhane", role: "Marketing Lead" },
  ],
  benefits: [
    { title: "Full Healthcare", text: "Health cover for you and your family." },
    { title: "Unlimited Vacation", text: "Take the time you need, when you need it." },
    { title: "Skill Development", text: "Budget and time for courses and conferences." },
    { title: "Team Summit", text: "Regular team meetups, wherever you are." },
    { title: "Remote Working", text: "Work from home or from any of our offices." },
    { title: "Commuter Benefits", text: "Support for your daily commute." },
  ],
  openJobs: [
    { title: "Social Media Assistant", type: "Full-Time", location: "Paris, France", applied: 5, capacity: 10 },
    { title: "Brand Designer", type: "Full-Time", location: "Paris, France", applied: 5, capacity: 10 },
    { title: "Interactive Developer", type: "Full-Time", location: "Paris, France", applied: 5, capacity: 10 },
    { title: "HR Manager", type: "Full-Time", location: "Paris, France", applied: 5, capacity: 10 },
  ],
};
