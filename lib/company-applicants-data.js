// Place this file at: lib/company-applicants-data.js
//
// All Applicants (3.4) + Applicant Details (3.5 - 3.8).
// First 10 rows are EXACTLY the 3.4 screenshot's first page:
// name, score, hiring stage, applied date, job role.
// Total is 19 (screenshot header: "Total Applicants: 19"), so
// rows 11-19 are demo fillers -- the screenshot's second page is
// not visible, so those 9 names/scores/dates are not from the
// screenshot, they are plausible demo applicants to reach 19.
// Stages used in the screenshot: Interview, Shortlisted,
// Declined, Hired, Interviewed. (Note: "Interview" and
// "Interviewed" are two different pills in the screenshot, so
// both are kept as separate stage values here.)
// Jerome Bell's detailed profile (3.5-3.8) IS from the screenshots.
// Other applicants get a generated detail profile in the detail
// component (name/title/score/stage based) -- see
// ApplicantDetailsPage.jsx -- so their detail pages are not empty,
// but their personal details are demo, not screenshot data.
// This is DEMO data, not live MongoDB applications yet.

function applicant(id, name, score, stage, appliedDate, jobRole) {
  return { id, name, score, stage, appliedDate, jobRole };
}

export const companyApplicants = [
  applicant("jake-gyll", "Jake Gyll", 0.0, "Interview", "13 July, 2021", "Designer"),
  applicant("guy-hawkins", "Guy Hawkins", 0.0, "Interview", "13 July, 2021", "JavaScript Dev"),
  applicant("cyndy-lillibridge", "Cyndy Lillibridge", 4.5, "Shortlisted", "12 July, 2021", "Golang Dev"),
  applicant("rodolfo-goode", "Rodolfo Goode", 3.75, "Declined", "11 July, 2021", ".NET Dev"),
  applicant("leif-floyd", "Leif Floyd", 4.8, "Hired", "11 July, 2021", "Graphic Design"),
  applicant("jenny-wilson", "Jenny Wilson", 4.6, "Hired", "9 July, 2021", "Designer"),
  applicant("jerome-bell", "Jerome Bell", 4.0, "Interviewed", "5 July, 2021", "Designer"),
  applicant("eleanor-pena", "Eleanor Pena", 3.9, "Declined", "5 July, 2021", "Designer"),
  applicant("darrell-steward", "Darrell Steward", 4.2, "Shortlisted", "3 July, 2021", "Designer"),
  applicant("floyd-miles", "Floyd Miles", 4.1, "Interviewed", "1 July, 2021", "Designer"),
  // Demo fillers for page 2 (total 19) -- not from the screenshot.
  applicant("kathryn-murphy", "Kathryn Murphy", 4.4, "Interview", "30 June, 2021", "Designer"),
  applicant("thad-eddings", "Thad Eddings", 3.8, "Shortlisted", "28 June, 2021", "Designer"),
  applicant("marvin-mckinney", "Marvin McKinney", 4.7, "Hired", "27 June, 2021", "JavaScript Dev"),
  applicant("annette-black", "Annette Black", 4.3, "Interviewed", "25 June, 2021", "Designer"),
  applicant("cameron-williamson", "Cameron Williamson", 3.6, "Declined", "24 June, 2021", "Golang Dev"),
  applicant("leslie-alexander", "Leslie Alexander", 4.9, "Hired", "22 June, 2021", "Graphic Design"),
  applicant("jenny-wilson-2", "Jenny Wilson", 4.1, "Interview", "20 June, 2021", ".NET Dev"),
  applicant("robert-fox", "Robert Fox", 3.9, "Shortlisted", "18 June, 2021", "Designer"),
  applicant("savannah-nguyen", "Savannah Nguyen", 4.5, "Interviewed", "15 June, 2021", "Designer"),
];

export function getCompanyApplicantById(id) {
  return companyApplicants.find((a) => a.id === id) || null;
}

// Jerome Bell's full detail, from screenshots 3.5 - 3.8.
export const jeromeBellDetail = {
  title: "Product Designer",
  appliedJob: { title: "Product Development", category: "Marketing", type: "Full-Time", daysAgo: "2 days ago" },
  stage: "Interview",
  stageSteps: ["In Review", "Shortlisted", "Interview", "Hired / Declined"],
  contact: {
    email: "jeromebell45@email.com",
    phone: "+44 1245 572 135",
    instagram: "instagram.com/jeromebell",
    twitter: "twitter.com/jeromebell",
    website: "www.jeromebell.com",
  },
  profile: {
    fullName: "Jerome Bell",
    gender: "Male",
    dateOfBirth: "March 23, 1995 (26 y.o)",
    language: "English, French, Bahasa",
    address: "4517 Washington Ave. Manchester, Kentucky 39495",
    aboutMe:
      "I'm a product designer + filmmaker currently working remotely at Twitter from Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world.\n\nFor 10 years, I've specialised in interface, experience & interaction design as well as working in user research and product strategy for product agencies, big tech companies & start-ups.",
    currentJob: "Product Designer",
    experienceYears: "4 Years",
    qualification: "Bachelors in Engineering",
    skills: ["Project Management", "Copywriting", "English"],
  },
  resume: {
    experiences: [
      { title: "Senior UX/UI Product Designer", company: "Enterprise", period: "2019 - Present", text: "Directly collaborated with CEO and Product team to prototype, design and deliver the UI and UX experience with a lean design process: research, design, test, and iterate." },
      { title: "UX/UI Product Designer", company: "Enterprise", period: "2017 - 2019", text: "Lead the UI design with the accountability of the design system, collaborated with product and development teams on core projects to improve product interfaces and experiences." },
      { title: "UI Designer", company: "Enterprise", period: "2015 - 2017", text: "Designed mobile UI applications for Orange R&D department, BNP Paribas, La Poste, Le Petit Marseillais and other clients." },
      { title: "Graphic Designer", company: "Enterprise", period: "2013 - 2015", text: "Designed print and web applications for Pau Brasil, Renault, Le theatre de Marrakech, La Maison de la Photographie and others." },
    ],
    education: "BTS Communication Visuelle option Multimedia - School: 2009 - 2010, Begalor",
    industryKnowledge: ["Product Design", "User Interface", "User Experience", "Interaction Design", "User Research", "Design Research"],
    tools: ["Figma", "Sketch", "Protopie", "Framer", "InVision", "Abstract", "Zeplin", "Google Analytics", "Amplitude", "Fullstory"],
    otherSkills: ["HTML", "CSS", "jQuery"],
    languages: ["English", "French"],
    social: ["jeromebell.com", "twitter.com/jeromebell", "linkedin.com/in/jeromebell", "dribbble.com/jeromebell"],
  },
  hiring: {
    interviewDate: "10 - 13 July, 2021",
    interviewLocation: "Silver Crysta, Nomad Office\n3517 W. Gray St. Utica, Pennsylvania 57867",
    interviewStatus: "On Progress",
    assignedTo: ["Maria Kelly", "James Gardner", "Allison Geidt"],
    notes: [
      { author: "Maria Kelly", date: "19 July, 2021 - 11:30 AM", text: "Please, do an interview stage immediately. The design division needs 2 replies new employees now", replies: "2 Replies" },
      { author: "Maria Kelly", date: "19 July, 2021 - 10:30 AM", text: "Please, do an interview stage immediately.", replies: "" },
    ],
  },
  interviews: [
    { name: "Kathryn Murphy", date: "Tomorrow - 10 July, 2021", time: "10:00 AM - 11:30 AM", type: "Written Test", location: "Silver Crysta Room, Nomad" },
    { name: "Jenny Wilson", date: "11 July, 2021", time: "10:00 AM - 11:00 AM", type: "Written Test 2", location: "Silver Crysta Room, Nomad" },
    { name: "Thad Eddings", date: "12 July, 2021", time: "10:00 AM - 11:00 AM", type: "Skill Test", location: "Silver Crysta Room, Nomad" },
    { name: "Thad Eddings", date: "13 July, 2021", time: "10:00 AM - 11:00 AM", type: "Final Test", location: "Silver Crysta Room, Nomad" },
  ],
};
