// Place this file at: lib/company-messages-data.js
//
// Company Messages (3.2 Dashboard Company - Messages).
// DESIGN / DEMO data, like the applicant Messages seed: these are
// the conversations from the 3.2 screenshot, not live MongoDB
// messages yet. The applicant dashboard messages (lib/messages-data.js)
// are a different set (recruiters writing to Jake) -- do NOT merge
// them. Company messages are candidates writing to the company.
// Only Jan Mayer's full chat is in the screenshot; the other
// conversations have the one visible line each, so their chats
// start with that line only. Replies in the UI are LOCAL state for
// now (see CompanyMessagesPage.jsx) -- they are not saved to
// MongoDB yet, so they do not persist after reload.
// Avatars are initial letters (no photo files in the repo).

export const companyConversations = [
  {
    id: "jan-mayer",
    name: "Jan Mayer",
    role: "Designer Candidate",
    time: "12 mins ago",
    lastMessage: "We want to invite you for a quick interview",
    unread: true,
    messages: [
      { from: "company", text: "Hey Jan, I wanted to reach out because we saw your work contributions and were impressed by your work.", time: "12 mins ago" },
      { from: "company", text: "We want to invite you for a quick interview", time: "12 mins ago" },
      { from: "candidate", text: "Hi Maria, sure I would love to. Thanks for taking the time to see my work!", time: "12 mins ago" },
    ],
  },
  { id: "joe-bartmann", name: "Joe Bartmann", role: "Designer Candidate", time: "3:40 PM", lastMessage: "Hey, thanks for your interview...", unread: false, messages: [{ from: "candidate", text: "Hey, thanks for your interview. It was great talking to you.", time: "3:40 PM" }] },
  { id: "ally-wales", name: "Ally Wales", role: "Designer Candidate", time: "3:40 PM", lastMessage: "Hey, thanks for your interview...", unread: false, messages: [{ from: "candidate", text: "Hey, thanks for your interview. It was great talking to you.", time: "3:40 PM" }] },
  { id: "james-gardner", name: "James Gardner", role: "Designer Candidate", time: "3:40 PM", lastMessage: "Hey, thanks for your interview...", unread: false, messages: [{ from: "candidate", text: "Hey, thanks for your interview. It was great talking to you.", time: "3:40 PM" }] },
  { id: "allison-geidt", name: "Allison Geidt", role: "Designer Candidate", time: "3:40 PM", lastMessage: "Hey, thanks for your interview...", unread: false, messages: [{ from: "candidate", text: "Hey, thanks for your interview. It was great talking to you.", time: "3:40 PM" }] },
  { id: "ruben-culhane", name: "Ruben Culhane", role: "Designer Candidate", time: "3:40 PM", lastMessage: "Hey, thanks for your interview...", unread: false, messages: [{ from: "candidate", text: "Hey, thanks for your interview. It was great talking to you.", time: "3:40 PM" }] },
  { id: "lydia-diaz", name: "Lydia Diaz", role: "Designer Candidate", time: "3:40 PM", lastMessage: "Hey, thanks for your interview...", unread: false, messages: [{ from: "candidate", text: "Hey, thanks for your interview. It was great talking to you.", time: "3:40 PM" }] },
  { id: "james-dokidis", name: "James Dokidis", role: "Designer Candidate", time: "3:40 PM", lastMessage: "Hey, thanks for your interview...", unread: false, messages: [{ from: "candidate", text: "Hey, thanks for your interview. It was great talking to you.", time: "3:40 PM" }] },
  { id: "angeloina-swann", name: "Angeloina Swann", role: "Designer Candidate", time: "3:40 PM", lastMessage: "Hey, thanks for your interview...", unread: false, messages: [{ from: "candidate", text: "Hey, thanks for your interview. It was great talking to you.", time: "3:40 PM" }] },
];

export function getCompanyConversationById(id) {
  return companyConversations.find((c) => c.id === id) || companyConversations[0];
}
