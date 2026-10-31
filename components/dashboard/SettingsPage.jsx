"use client";

// Place this file at: components/dashboard/SettingsPage.jsx
// Tabs (2.9 / 2.10 / 2.11) are tabs on ONE page, /dashboard/settings,
// not separate routes -- exactly like the reference screenshots.
// All initial values come from props (read from MongoDB by the server
// page via lib/settings-data.js) -- nothing is hardcoded here.
//
// WHAT ACTUALLY SAVES, AND WHAT DOES NOT (read this before testing):
//   - My Profile -> Save Profile: REAL. Updates users (name, email)
//     and profiles (phone) and settings (dateOfBirth, gender,
//     accountType) in MongoDB via POST /api/dashboard/settings.
//   - Login Details -> Update Email: REAL. Updates users.email and
//     marks it unverified (a new email is not verified until a
//     verification flow exists -- see below).
//   - Notifications -> Update Email button (that is the button text
//     in the reference screenshot, kept as-is): REAL. Updates
//     settings.notifications in MongoDB.
//   - Login Details -> Change Password: NOT REAL YET. There is no
//     login/password system connected to this project (signup/login
//     forms are demo, users have no stored password hash), so there
//     is no old password to check and no safe place to store a new
//     one. The API returns an honest error and the UI shows it,
//     instead of pretending the password changed.
//   - Close Account: NOT REAL YET, on purpose. Deleting a user's
//     data needs a confirmed, logged-in account owner. The button
//     asks for confirmation and then shows the honest "not enabled
//     yet" message -- it deletes NOTHING.
//   - Profile Photo upload box: preview only. Selecting a file shows
//     a local preview. There is no file-storage backend connected
//     (no upload API / Cloudinary / S3), so Save does NOT upload the
//     photo. To change the photo for real today, set avatarUrl in
//     MongoDB (users collection) to an image URL.

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { CheckCircle2, ImagePlus, Info } from "lucide-react";

const TABS = [
  { id: "profile", label: "My Profile" },
  { id: "login", label: "Login Details" },
  { id: "notifications", label: "Notifications" },
];

function Avatar({ name, avatarUrl, previewUrl }) {
  const src = previewUrl || avatarUrl;
  if (src) {
    return (
      <img src={src} alt={name} className="h-16 w-16 shrink-0 rounded-full object-cover" />
    );
  }
  return (
    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
      {(name || "?").charAt(0)}
    </span>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1 block text-xs font-semibold text-slate-700">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

const inputClass =
  "w-full border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500";

export default function SettingsPage({ initialData }) {
  // ?tab=login (from the navbar "Change Password" link) opens the
  // Login Details tab directly, instead of always opening My Profile.
  // Valid values: profile | login | notifications. Anything else
  // falls back to profile.
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = ["profile", "login", "notifications"].includes(tabParam)
    ? tabParam
    : "profile";
  const [tab, setTab] = useState(initialTab);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }

  // My Profile form state, initialised from MongoDB data
  const personal = initialData.personal || {};
  const [fullName, setFullName] = useState(personal.fullName || "");
  const [phone, setPhone] = useState(personal.phone || "");
  const [email, setEmail] = useState(personal.email || "");
  const [dateOfBirth, setDateOfBirth] = useState(personal.dateOfBirth || "");
  const [gender, setGender] = useState(personal.gender || "");
  const [accountType, setAccountType] = useState(personal.accountType || "jobSeeker");
  const [photoPreview, setPhotoPreview] = useState("");
  const photoInputRef = useRef(null);

  // Login Details form state
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Notifications form state
  const notifications = initialData.notifications || {};
  const [notifyApplications, setNotifyApplications] = useState(notifications.applications ?? true);
  const [notifyJobs, setNotifyJobs] = useState(notifications.jobs ?? false);
  const [notifyRecommendations, setNotifyRecommendations] = useState(notifications.recommendations ?? false);

  async function postSettings(section, body) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, ...body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Something went wrong. Please try again." });
        return false;
      }
      setMessage({ type: "ok", text: data.message || "Saved." });
      return true;
    } catch {
      setMessage({ type: "error", text: "Could not reach the server. Is the dev server running?" });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ type: "error", text: "Full Name is required." });
      return;
    }
    const ok = await postSettings("profile", {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      dateOfBirth,
      gender,
      accountType,
    });
    // Reload to show the saved server values -- except when a photo
    // was previewed, in which case keep the message visible (the
    // preview will disappear on reload, which is exactly the point:
    // it was never uploaded).
    if (ok && photoPreview) {
      setMessage({
        type: "ok",
        text: "Profile saved. Note: the selected photo was only previewed -- photo upload needs a storage backend (see the note at the top of this file). Set avatarUrl in MongoDB to change the photo for real.",
      });
    } else if (ok) {
      window.location.reload();
    }
  }

  async function handleUpdateEmail(e) {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setMessage({ type: "error", text: "Please enter a valid new email address." });
      return;
    }
    const ok = await postSettings("login-email", { newEmail: newEmail.trim() });
    if (ok) {
      setNewEmail("");
      window.location.reload();
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "New Password must be at least 8 characters." });
      return;
    }
    // The API will return the honest "not connected yet" error here.
    await postSettings("password", { oldPassword, newPassword });
  }

  async function handleSaveNotifications(e) {
    e.preventDefault();
    await postSettings("notifications", {
      notifications: {
        applications: notifyApplications,
        jobs: notifyJobs,
        recommendations: notifyRecommendations,
      },
    });
  }

  function handleCloseAccount() {
    if (!window.confirm("Close your account? This is not enabled yet and will delete nothing. Click OK to see the current status.")) return;
    postSettings("close", {});
  }

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
  }

  const user = initialData.user;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-10">
      {/* Header: same as Dashboard overview -- bell outside dropdown, NO Back to homepage */}
      <DashboardHeader title="Settings" />

      {!initialData.connected && (
        <div className="mt-6 border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
          <p className="font-bold">MongoDB is not connected yet.</p>
          <p>
            Set <code className="font-mono text-xs">MONGODB_URI</code> in{" "}
            <code className="font-mono text-xs">.env</code> or{" "}
            <code className="font-mono text-xs">.env.local</code> and run{" "}
            <code className="font-mono text-xs">node scripts/seed-settings.js</code>, then reload.
            The forms below show empty values instead of fake data until then.
          </p>
        </div>
      )}

      {initialData.connected && !user && (
        <div className="mt-6 border border-slate-200 bg-white px-5 py-8 text-center">
          <p className="font-bold text-slate-800">No account yet.</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Settings appear here once a user document is saved in the{" "}
            <code className="font-mono text-xs">users</code> collection in MongoDB. Run{" "}
            <code className="font-mono text-xs">node scripts/seed-dashboard.js</code> and{" "}
            <code className="font-mono text-xs">node scripts/seed-settings.js</code> for demo data.
          </p>
        </div>
      )}

      {user && (
        <>
          {/* Tabs */}
          <div className="mt-6 flex gap-6 border-b border-slate-200">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setMessage(null);
                }}
                className={`-mb-px border-b-2 pb-3 text-sm font-medium ${
                  tab === t.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {message && (
            <div
              className={`mt-4 border px-4 py-3 text-sm ${
                message.type === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* ============ 2.9 My Profile ============ */}
          {tab === "profile" && (
            <form onSubmit={handleSaveProfile} className="mt-6">
              <h2 className="text-base font-bold text-slate-800">Basic Information</h2>
              <p className="mt-1 text-sm text-slate-500">
                This is your personal information that you can update anytime.
              </p>

              <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Profile Photo</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    This image will be shown publicly as your profile picture. It will help
                    recruiters recognize you
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar name={user.name} avatarUrl={user.avatarUrl} previewUrl={photoPreview} />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-1 border border-dashed border-indigo-300 px-6 py-4 text-xs text-indigo-600 hover:bg-indigo-50"
                  >
                    <ImagePlus size={18} />
                    <span className="font-semibold">Click to replace or drag and drop</span>
                    <span className="text-slate-400">SVG, PNG, JPG or GIF (max. 400 x 400px)</span>
                    {photoPreview && <span className="text-emerald-600">Photo selected (preview only)</span>}
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg,.gif"
                    onChange={handlePhotoSelect}
                    className="hidden"
                    aria-label="Choose profile photo"
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                <p className="text-sm font-semibold text-slate-800">Personal Details</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FieldLabel required>Full Name</FieldLabel>
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Jake Gyll" />
                  </div>
                  <div>
                    <FieldLabel required>Phone Number</FieldLabel>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+44 (345) 512 105" />
                  </div>
                  <div>
                    <FieldLabel required>Email</FieldLabel>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="jakegyll@email.com" />
                  </div>
                  <div>
                    <FieldLabel required>Date of Birth</FieldLabel>
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <FieldLabel required>Gender</FieldLabel>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Account Type</p>
                  <p className="mt-1 text-xs text-slate-500">You can update your account type</p>
                </div>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      name="accountType"
                      value="jobSeeker"
                      checked={accountType === "jobSeeker"}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="mt-1 accent-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">Job Seeker</span>
                      <span className="block text-xs text-slate-500">Looking for a job</span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      name="accountType"
                      value="employer"
                      checked={accountType === "employer"}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="mt-1 accent-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">Employer</span>
                      <span className="block text-xs text-slate-500">Hiring, sourcing candidates, or posting a job</span>
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}

          {/* ============ 2.10 Login Details ============ */}
          {tab === "login" && (
            <div className="mt-6">
              <h2 className="text-base font-bold text-slate-800">Basic Information</h2>
              <p className="mt-1 text-sm text-slate-500">
                This is login information that you can update anytime.
              </p>

              <form onSubmit={handleUpdateEmail} className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Update Email</p>
                  <p className="mt-1 text-xs text-slate-500">Update your email address to make sure it is safe</p>
                </div>
                <div className="max-w-md space-y-3">
                  <p className="flex items-center gap-1.5 text-sm text-slate-700">
                    {initialData.login?.email}
                    {initialData.login?.emailVerified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle2 size={14} />
                        Your email address is verified.
                      </span>
                    )}
                  </p>
                  <div>
                    <FieldLabel>Update Email</FieldLabel>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter your new email"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Update Email
                  </button>
                </div>
              </form>

              <form onSubmit={handleChangePassword} className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div>
                  <p className="text-sm font-semibold text-slate-800">New Password</p>
                  <p className="mt-1 text-xs text-slate-500">Manage your password to make sure it is safe</p>
                </div>
                <div className="max-w-md space-y-4">
                  <div>
                    <FieldLabel>Old Password</FieldLabel>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your old password"
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-slate-400">Minimum 8 characters</p>
                  </div>
                  <div>
                    <FieldLabel>New Password</FieldLabel>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className={inputClass}
                    />
                    <p className="mt-1 text-xs text-slate-400">Minimum 8 characters</p>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Change Password
                  </button>
                </div>
              </form>

              <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={handleCloseAccount}
                  className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Close Account <Info size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ============ 2.11 Notifications ============ */}
          {tab === "notifications" && (
            <form onSubmit={handleSaveNotifications} className="mt-6">
              <h2 className="text-base font-bold text-slate-800">Basic Information</h2>
              <p className="mt-1 text-sm text-slate-500">
                This is notifications preferences that you can update anytime.
              </p>

              <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                  <p className="mt-1 text-xs text-slate-500">Customize your preferred notification settings</p>
                </div>
                <div className="max-w-md space-y-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={notifyApplications}
                      onChange={(e) => setNotifyApplications(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">Applications</span>
                      <span className="block text-xs text-slate-500">These are notifications for jobs that you have applied to</span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={notifyJobs}
                      onChange={(e) => setNotifyJobs(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">Jobs</span>
                      <span className="block text-xs text-slate-500">These are notifications for job openings that suit your profile</span>
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={notifyRecommendations}
                      onChange={(e) => setNotifyRecommendations(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">Recommendations</span>
                      <span className="block text-xs text-slate-500">These are notifications for personalized recommendations from our recruiters</span>
                    </span>
                  </label>
                  {/* Button text is "Update Email" in the reference screenshot
                      for this tab too, kept as-is so the page matches it. */}
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Update Email"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
