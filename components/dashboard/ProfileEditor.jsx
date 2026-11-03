"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { profileSections } from "@/lib/profile-fields";

const inputClass = "mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-500";

export default function ProfileEditor({ section, initialValue, add, onClose }) {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const definition = profileSections[section];
  const empty = () => Object.fromEntries(definition.fields.map((field) => [field.key, ""]));
  const [value, setValue] = useState(() => definition.list
    ? [...(initialValue || []), ...(add || !initialValue?.length ? [empty()] : [])]
    : { ...empty(), ...initialValue });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  async function save(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, value }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save profile.");
      if (section === "overview") await refetch();
      router.refresh();
      onClose();
    } catch (error) { setError(error.message); setSaving(false); }
  }

  function update(index, key, text) {
    setValue((old) => definition.list ? old.map((row, i) => i === index ? { ...row, [key]: text } : row) : { ...old, [key]: text });
  }

  return (
    <dialog ref={dialogRef} aria-labelledby="profile-editor-title" onCancel={(event) => { if (saving) event.preventDefault(); else onClose(); }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto border border-slate-200 bg-white p-6 text-slate-800 shadow-xl backdrop:bg-black/60">
      <form onSubmit={save}>
        <div className="flex items-center justify-between gap-3">
          <h2 id="profile-editor-title" className="text-xl font-bold">{definition.title}</h2>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close editor" className="min-h-11 min-w-11 text-xl">×</button>
        </div>
        <fieldset disabled={saving} className="mt-4 space-y-5">
          {(definition.list ? value : [value]).map((row, index) => (
            <div key={index} className={definition.list ? "space-y-3 border border-slate-200 p-4" : "space-y-3"}>
              {definition.fields.map((field) => (
                <label key={field.key} className="block text-sm font-medium">
                  {field.label}{field.required ? " *" : ""}
                  {field.multiline ? <textarea aria-label={field.label} rows={5} required={field.required} maxLength={field.max} value={row[field.key] || ""} onChange={(e) => update(index, field.key, e.target.value)} className={inputClass} />
                    : <input aria-label={`${field.label}${field.required ? " *" : ""}`} type={field.type || "text"} required={field.required} maxLength={field.max} value={row[field.key] || ""} onChange={(e) => update(index, field.key, e.target.value)} className={inputClass} />}
                </label>
              ))}
              {definition.list && <button type="button" onClick={() => setValue((rows) => rows.filter((_, i) => i !== index))} className="min-h-11 text-sm text-red-600">Remove entry {index + 1}</button>}
            </div>
          ))}
          {definition.list && <button type="button" disabled={value.length >= 30} onClick={() => setValue((rows) => [...rows, empty()])} className="min-h-11 text-sm font-semibold text-indigo-600">+ Add another</button>}
          {section === "overview" && <>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(value.openForOpportunities)} onChange={(e) => setValue((old) => ({ ...old, openForOpportunities: e.target.checked }))} /> Open for opportunities</label>
            <Link href="/dashboard/settings" className="block text-sm text-indigo-600">Change profile photo in Settings</Link>
          </>}
        </fieldset>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={saving} className="border border-slate-300 px-4 py-3 text-sm">Cancel</button>
          <button type="submit" disabled={saving} className="bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </form>
    </dialog>
  );
}
