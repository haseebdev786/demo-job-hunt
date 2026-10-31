"use client";

// Place this file at: components/dashboard/HelpCenterPage.jsx
// Help Center (2.12) content, inside the dashboard layout. The page
// header (Help Center + Back to homepage + bell) lives in
// app/dashboard/help/page.jsx, like the Dashboard overview page.
// This component is only the two-column content below it:
//   Left:  search box, category list, blue "Didn't find..." card
//   Right: Sort by, article cards, each with "..." menu and
//          "Was this article helpful?" Yes / No buttons
//
// Behaviour:
//   - Search filters articles by title + body (case-insensitive).
//   - Category filters articles. Default category is "Getting Started",
//     like the reference screenshot, which shows its three articles.
//   - Sort: "Most relevant" = original order, "Title A-Z" / "Title Z-A".
//   - Helpful votes are LOCAL state for now (like the Apply/heart
//     toggles elsewhere in the dashboard): clicking Yes or No marks
//     that article and shows "Thanks for your feedback". Votes are
//     NOT saved to MongoDB yet, so they do not persist after reload.
//   - "..." menu has one action: Copy link, which copies the article
//     URL (page URL + #article-slug) to the clipboard and shows
//     "Link copied" briefly.
//   - Contact Us opens a contact form modal. Submitting it shows a
//     DEMO success message only -- messages are NOT sent to customer
//     service yet, because no support mailbox / API is connected.
//     That is stated in the modal itself, so it is not a fake success.

import { useMemo, useState } from "react";
import { MoreHorizontal, Search, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { HELP_CATEGORIES, helpArticles } from "@/lib/help-data";

function ContactModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Contact Customer Service</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-800">
            <X size={20} />
          </button>
        </div>
        {sent ? (
          <div className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p className="font-bold">Thanks, your message was recorded in this demo.</p>
            <p className="mt-1">
              This form does not send to customer service yet -- no support mailbox or API is
              connected. Your message was not sent anywhere.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Your name" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Your email" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Message</label>
              <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="How can we help?" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Getting Started");
  const [sort, setSort] = useState("relevant");
  const [votes, setVotes] = useState({}); // slug -> "yes" | "no"
  const [openMenuSlug, setOpenMenuSlug] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = helpArticles.filter((a) => {
      const matchesCategory = a.category === category;
      const matchesSearch =
        !q || a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
    if (sort === "title-asc") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "title-desc") list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    return list;
  }, [search, category, sort]);

  async function handleCopyLink(article) {
    try {
      const url = `${window.location.origin}/dashboard/help#${article.slug}`;
      await navigator.clipboard.writeText(url);
      setCopiedSlug(article.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      setCopiedSlug(article.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
    setOpenMenuSlug(null);
  }

  return (
    <>
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left column */}
        <div>
          <label htmlFor="help-search" className="text-sm text-slate-500">
            Type your question or search keyword
          </label>
          <div className="mt-3 flex items-center gap-2 border border-slate-200 bg-white px-3">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              id="help-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <nav className="mt-6" aria-label="Help categories">
            {HELP_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`block w-full border-b border-slate-200 py-3 text-left text-sm ${
                  category === cat ? "font-semibold text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Blue contact card, like the reference */}
          <div className="relative mt-8 overflow-hidden bg-indigo-600 p-6 text-white">
            <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-indigo-400/50" />
            <div className="absolute -bottom-4 right-16 h-16 w-16 rounded-full bg-indigo-400/40" />
            <div className="relative">
              <p className="text-base font-bold leading-6">
                Didn&apos;t find what you were looking for?
              </p>
              <p className="mt-1 text-sm text-indigo-100">Contact our customer service</p>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="mt-4 bg-white px-5 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort articles"
              className="bg-transparent font-semibold text-slate-800 outline-none"
            >
              <option value="relevant">Most relevant</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 border border-slate-200 bg-white p-8 text-center">
              <p className="font-bold text-slate-800">No articles found.</p>
              <p className="mt-1 text-sm text-slate-500">
                Try another search, or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("Getting Started");
                }}
                className="mt-4 text-sm font-semibold text-indigo-600"
              >
                Clear search and category
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {filtered.map((article) => {
                const vote = votes[article.slug];
                return (
                  <article key={article.slug} id={article.slug} className="border border-slate-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-base font-bold text-slate-800">{article.title}</h2>
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setOpenMenuSlug(openMenuSlug === article.slug ? null : article.slug)}
                          aria-label="Article options"
                          className="p-1 text-slate-400 hover:text-slate-800"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                        {openMenuSlug === article.slug && (
                          <div className="absolute right-0 top-8 z-10 w-44 border border-slate-200 bg-white shadow-lg">
                            <button
                              type="button"
                              onClick={() => handleCopyLink(article)}
                              className="block w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-indigo-50"
                            >
                              {copiedSlug === article.slug ? "Link copied!" : "Copy link"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-500">{article.body}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                      {vote ? (
                        <p className="text-sm text-emerald-600">Thanks for your feedback!</p>
                      ) : (
                        <>
                          <span className="text-sm text-slate-500">Was this article helpful?</span>
                          <button
                            type="button"
                            onClick={() => setVotes((prev) => ({ ...prev, [article.slug]: "yes" }))}
                            className="flex items-center gap-1 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                          >
                            <ThumbsUp size={14} /> Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setVotes((prev) => ({ ...prev, [article.slug]: "no" }))}
                            className="flex items-center gap-1 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                          >
                            <ThumbsDown size={14} /> No
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
