"use client";

export function ReservationsStatusPill({ value }: { value: string }) {
  const v = (value || "").toLowerCase();

  const cls =
    v.includes("cancel")
      ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-200"
      : v.includes("complete")
        ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-200"
        : v.includes("confirm")
          ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200"
          : v.includes("check")
            ? "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-200"
            : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200";

  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${cls}`}>
      {value || "—"}
    </span>
  );
}
