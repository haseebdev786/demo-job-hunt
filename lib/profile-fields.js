export const profileSections = {
  overview: { title: "Edit Profile", fields: [
    { key: "fullName", label: "Full name", required: true, max: 100 },
    { key: "title", label: "Professional title", max: 150 },
    { key: "location", label: "Location", max: 200 },
  ] },
  about: { title: "About Me", fields: [{ key: "about", label: "About me", multiline: true, max: 5000 }] },
  experiences: { title: "Experiences", list: true, fields: [
    { key: "role", label: "Job title", required: true, max: 150 },
    { key: "company", label: "Company", required: true, max: 150 },
    { key: "employmentType", label: "Employment type", max: 100 },
    { key: "period", label: "Period", max: 100 },
    { key: "location", label: "Location", max: 200 },
    { key: "description", label: "Description", multiline: true, max: 3000 },
  ] },
  educations: { title: "Educations", list: true, fields: [
    { key: "school", label: "School / university", required: true, max: 150 },
    { key: "degree", label: "Degree", required: true, max: 150 },
    { key: "period", label: "Period", max: 100 },
    { key: "description", label: "Description", multiline: true, max: 3000 },
  ] },
  skills: { title: "Skills", fields: [{ key: "skills", label: "Skills (separate with commas or new lines)", multiline: true, max: 4000 }] },
  portfolios: { title: "Portfolios", list: true, fields: [
    { key: "title", label: "Project title", required: true, max: 150 },
    { key: "url", label: "Project URL", type: "url", max: 2000 },
    { key: "imageUrl", label: "Image URL", type: "url", max: 2000 },
  ] },
  additionalDetails: { title: "Additional Details", fields: [
    { key: "email", label: "Public contact email", type: "email", max: 254 },
    { key: "phone", label: "Phone", max: 50 },
    { key: "location", label: "Location", max: 200 },
    { key: "languages", label: "Languages", max: 300 },
  ] },
  socialLinks: { title: "Social Links", list: true, fields: [
    { key: "platform", label: "Platform", required: true, max: 100 },
    { key: "url", label: "URL", type: "url", required: true, max: 2000 },
  ] },
};

export function validateProfileSection(section, value) {
  const definition = Object.hasOwn(profileSections, section) && profileSections[section];
  if (!definition) throw new Error("Unknown profile section.");
  function fields(record) {
    if (!record || typeof record !== "object" || Array.isArray(record)) throw new Error("Invalid profile details.");
    return Object.fromEntries(definition.fields.map((field) => {
      const text = record[field.key] ?? "";
      if (typeof text !== "string" || text.length > field.max || (field.required && !text.trim())) throw new Error(`Check ${field.label} (maximum ${field.max} characters).`);
      const trimmed = text.trim();
      if (trimmed && field.type === "url") {
        let url;
        try { url = new URL(trimmed); } catch { throw new Error(`Enter a valid ${field.label}.`); }
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("Links must start with https:// or http://.");
      }
      if (trimmed && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) throw new Error("Enter a valid contact email.");
      return [field.key, trimmed];
    }));
  }
  if (definition.list) {
    if (!Array.isArray(value) || value.length > 30) throw new Error("You can save up to 30 entries per section.");
    return value.map(fields);
  }
  const result = fields(value);
  if (section === "overview") result.openForOpportunities = value.openForOpportunities === true;
  if (section === "skills") {
    const skills = [...new Set(result.skills.split(/[,\n]/).map((s) => s.trim()).filter(Boolean))];
    if (skills.length > 40 || skills.some((s) => s.length > 100)) throw new Error("Use up to 40 skills, each under 100 characters.");
    return skills;
  }
  return result;
}
