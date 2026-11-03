// Presentation catalog: 10 jobs across 6 companies. No database seed is needed.
const companies = [
  { name: "Nomad", slug: "demo-nomad", location: "Paris, France", industry: "Marketing", size: "51-150", about: "A remote-first studio building digital products and creative campaigns.", color: "text-emerald-500" },
  { name: "Dropbox", slug: "demo-dropbox", location: "San Francisco, USA", industry: "Technology", size: "1000-above", about: "Tools that help teams organize their work and collaborate from anywhere.", color: "text-blue-500" },
  { name: "Terraform", slug: "demo-terraform", location: "Hamburg, Germany", industry: "Technology", size: "151-250", about: "A technology team creating reliable infrastructure and developer tools.", color: "text-cyan-500" },
  { name: "Revolut", slug: "demo-revolut", location: "Madrid, Spain", industry: "Fintech", size: "1000-above", about: "Digital financial products designed to make everyday money management simpler.", color: "text-violet-500" },
  { name: "Canva", slug: "demo-canva", location: "Ontario, Canada", industry: "Design", size: "501-1000", about: "An online design platform helping people turn ideas into visual stories.", color: "text-teal-500" },
  { name: "ClassPass", slug: "demo-classpass", location: "Barcelona, Spain", industry: "Business", size: "251-500", about: "A platform connecting people with fitness classes and wellness experiences.", color: "text-indigo-500" },
];

const listings = [
  [0, "Social Media Assistant", "Marketing", "Entry Level", "Full-Time", 30000, 45000, ["Social Media", "Copywriting", "Analytics"]],
  [1, "Brand Designer", "Design", "Mid Level", "Full-Time", 60000, 85000, ["Figma", "Brand Design", "Typography"]],
  [2, "Interactive Developer", "Technology", "Senior Level", "Remote", 80000, 110000, ["React", "JavaScript", "CSS"]],
  [3, "Email Marketing Specialist", "Marketing", "Entry Level", "Full-Time", 35000, 50000, ["Email Marketing", "Copywriting", "Analytics"]],
  [4, "Lead Engineer", "Engineering", "Director", "Full-Time", 110000, 150000, ["TypeScript", "System Design", "Leadership"]],
  [5, "Product Designer", "Design", "Mid Level", "Part-Time", 40000, 60000, ["Figma", "User Research", "Prototyping"]],
  [0, "HR Coordinator", "Human Resource", "Entry Level", "Internship", 18000, 28000, ["Communication", "Recruitment", "Organization"]],
  [1, "Backend Developer", "Technology", "Senior Level", "Remote", 100000, 130000, ["Node.js", "MongoDB", "API Design"]],
  [2, "Sales Specialist", "Sales", "Mid Level", "Contract", 45000, 65000, ["Sales", "CRM", "Negotiation"]],
  [3, "Financial Analyst", "Fintech", "Mid Level", "Full-Time", 55000, 75000, ["Financial Analysis", "Excel", "Reporting"]],
];

export const demoJobs = listings.map(([companyIndex, title, category, level, type, salaryMin, salaryMax, skills], index) => {
  const company = companies[companyIndex];
  const id = `demo-job-${index + 1}`;
  return {
    id, slug: id, demo: true, title, role: title, company: company.name, companySlug: company.slug,
    companyAbout: company.about, location: company.location, type, jobType: type, employment: [type],
    category, categories: [category], level, salaryMin, salaryMax,
    salary: `$${salaryMin.toLocaleString("en-US")} - $${salaryMax.toLocaleString("en-US")} / year`,
    description: `${company.name} is looking for a ${title} to join its growing team. You will collaborate with colleagues, contribute practical ideas and help deliver thoughtful work for customers. This is a demo listing for the project preview.`,
    responsibilities: `Deliver high-quality work as a ${title}.\nCollaborate with the team to plan and complete projects.\nShare progress, gather feedback and improve results.`,
    whoYouAre: `You have experience with ${skills.join(", ")}.\nYou communicate clearly and enjoy solving problems.\nYou take ownership of your work and are eager to learn.`,
    niceToHaves: "A portfolio of relevant projects.\nExperience working with a distributed team.",
    skills, perks: [
      { title: "Flexible Working", text: "Flexible hours to support a healthy work-life balance." },
      { title: "Learning Budget", text: "Support for courses and professional development." },
    ],
    applicants: 0, status: "Live", datePosted: "3 Nov 2026", dueDate: "Until filled", needs: "Not specified",
    logo: company.name.charAt(0), logoColor: company.color, logoBg: "bg-indigo-50",
  };
});

export const demoCompanies = companies.map((company) => {
  const jobs = demoJobs.filter((job) => job.companySlug === company.slug);
  return { ...company, id: company.slug, demo: true, description: company.about,
    categories: [...new Set(jobs.flatMap((job) => job.categories))], jobs: jobs.length,
    icon: company.name.charAt(0), logo: company.name.charAt(0), iconBg: "bg-indigo-50", iconColor: company.color,
  };
});
