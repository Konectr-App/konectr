// © Konectr 2026. All rights reserved.
"use client";

import { useState, useEffect, useCallback } from "react";
import { STEPS, INITIAL_DATA, type FormData, type Field } from "./interview-data";

const STORAGE_KEY = "konectr-venue-interview-draft";
// The form key (#257) is kept apart from the draft: sending an interview clears the draft, not the key.
const FORM_KEY_STORAGE = "konectr-venue-interview-key";
const FORM_KEY_HEADER = "x-interview-form-key";
const RADIO_THRESHOLD = 6;

export default function VenueInterviewForm({ keyRequired = false }: { keyRequired?: boolean }) {
  const [step, setStep] = useState(0);
  const [formKey, setFormKey] = useState("");
  const [keyRefused, setKeyRefused] = useState(false);
  const [keySaved, setKeySaved] = useState(false);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
    try {
      const savedKey = localStorage.getItem(FORM_KEY_STORAGE) || "";
      setFormKey(savedKey);
      setKeySaved(savedKey !== "");
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Auto-save
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, loaded]);

  const updateField = useCallback((key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleMulti = useCallback((key: string, option: string) => {
    setData((prev) => {
      const current = (prev[key] as string[]) || [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      return { ...prev, [key]: next };
    });
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/venue-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Percent-encoded: a header can only carry Latin-1, and the key may be anything.
          ...(formKey.trim() ? { [FORM_KEY_HEADER]: encodeURIComponent(formKey.trim()) } : {}),
        },
        body: JSON.stringify(data),
      });
      // 401 = the key is missing or wrong. The draft stays; only the key field reopens.
      setKeyRefused(res.status === 401);
      if (res.ok && formKey.trim()) {
        try {
          localStorage.setItem(FORM_KEY_STORAGE, formKey.trim());
          setKeySaved(true);
        } catch {
          // ignore
        }
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit");
      }
      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">
            Interview Saved!
          </h2>
          <p className="text-gray-500 mb-8">
            <span className="font-medium text-[#1F1F1F]">
              {data.venueName as string}
            </span>{" "}
            has been added to the database.
          </p>
          <button
            onClick={() => {
              setData({ ...INITIAL_DATA, interviewDate: new Date().toISOString().split("T")[0] });
              setStep(0);
              setSubmitted(false);
            }}
            className="w-full py-3 rounded-xl bg-[#FF774D] text-[#1F1F1F] font-semibold text-base active:scale-[0.98] transition-transform"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">
            Step {step + 1} of {STEPS.length}
          </span>
          {data.venueName && (
            <span className="text-sm text-gray-400 truncate max-w-[140px]">
              {data.venueName as string}
            </span>
          )}
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF774D] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pt-5 pb-28">
        <h2 className="text-xl font-bold text-[#1F1F1F] mb-1">
          {currentStep.icon} {currentStep.title}
        </h2>
        <p className="text-sm text-gray-400 mb-6">{currentStep.description}</p>

        <div className="space-y-5">
          {currentStep.fields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={data[field.key]}
              onChange={(v) => updateField(field.key, v)}
              onToggle={(option) => toggleMulti(field.key, option)}
            />
          ))}
        </div>

        {/* Asked once: on the last step until a key has worked on this device, and again if one is refused. */}
        {(keyRefused || (keyRequired && isLast && !keySaved)) && (
          <div className="mt-6">
            <label htmlFor="interview-form-key" className="block text-sm font-semibold text-[#1F1F1F] mb-1">
              Form key
            </label>
            <input
              id="interview-form-key"
              type="password"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base text-[#1F1F1F] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF774D]/40 focus:border-[#FF774D] placeholder:text-gray-300"
              value={formKey}
              onChange={(e) => setFormKey(e.target.value)}
              placeholder="Enter the form key"
            />
            <p className="mt-1 text-xs text-gray-400">
              Saved on this device once an interview goes through.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3 z-10">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-[#1F1F1F] font-semibold text-base active:scale-[0.98] transition-transform"
          >
            Back
          </button>
        )}
        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-[#FF774D] text-[#1F1F1F] font-semibold text-base disabled:opacity-50 active:scale-[0.98] transition-transform"
          >
            {submitting ? "Saving..." : "Save Interview"}
          </button>
        ) : (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 py-3 rounded-xl bg-[#FF774D] text-[#1F1F1F] font-semibold text-base active:scale-[0.98] transition-transform"
          >
            Next
          </button>
        )}
      </nav>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field Renderer
// ---------------------------------------------------------------------------

function FieldRenderer({
  field,
  value,
  onChange,
  onToggle,
}: {
  field: Field;
  value: string | string[] | undefined;
  onChange: (v: string) => void;
  onToggle: (option: string) => void;
}) {
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-base text-[#1F1F1F] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF774D]/40 focus:border-[#FF774D] placeholder:text-gray-300";

  const label = (
    <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">
      {field.label}
      {field.required && <span className="text-[#FF774D] ml-0.5">*</span>}
    </label>
  );

  const hint = field.hint ? (
    <p className="text-xs text-gray-400 mt-1">{field.hint}</p>
  ) : null;

  switch (field.type) {
    case "text":
    case "phone":
    case "email":
    case "url":
      return (
        <div>
          {label}
          <input
            type={field.type === "phone" ? "tel" : field.type}
            className={inputClass}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
          {hint}
        </div>
      );

    case "textarea":
      return (
        <div>
          {label}
          <textarea
            className={`${inputClass} min-h-[100px] resize-y`}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
          {hint}
        </div>
      );

    case "number":
      return (
        <div>
          {label}
          <input
            type="number"
            className={inputClass}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            inputMode="numeric"
          />
          {hint}
        </div>
      );

    case "date":
      return (
        <div>
          {label}
          <input
            type="date"
            className={inputClass}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {hint}
        </div>
      );

    case "select":
      if (field.options && field.options.length < RADIO_THRESHOLD) {
        return (
          <div>
            {label}
            <div className="space-y-2">
              {field.options.map((option) => {
                const selected = value === option;
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => onChange(option)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors w-full text-left ${
                      selected
                        ? "border-[#FF774D] bg-[#FF774D]/5"
                        : "border-gray-200 bg-white active:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selected ? "border-[#FF774D]" : "border-gray-300"
                      }`}
                    >
                      {selected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF774D]" />
                      )}
                    </div>
                    <span className="text-sm text-[#1F1F1F]">{option}</span>
                  </button>
                );
              })}
            </div>
            {hint}
          </div>
        );
      }
      // Dropdown for 6+ options
      return (
        <div>
          {label}
          <select
            className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_16px_center]`}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {hint}
        </div>
      );

    case "multi_select":
      return (
        <div>
          {label}
          <div className="flex flex-wrap gap-2">
            {field.options?.map((option) => {
              const selected = ((value as string[]) || []).includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggle(option)}
                  className={`px-3.5 py-2 rounded-full border text-sm font-medium transition-colors ${
                    selected
                      ? "bg-[#FF774D] text-[#1F1F1F] border-[#FF774D]"
                      : "bg-white text-gray-600 border-gray-200 active:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {hint}
        </div>
      );

    default:
      return null;
  }
}
