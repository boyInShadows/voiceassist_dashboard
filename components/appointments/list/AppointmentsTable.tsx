// Path: components/appointments/list/AppointmentsTable.tsx
import Link from "next/link";
import type { Appointment } from "@/lib/types";
import { AppointmentStatusPill } from "./AppointmentStatusPill";

function readString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  if (typeof v === "string" && v.trim()) return v.trim();
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return null;
}

function normalizeIntId(raw: string): string | null {
  const s = raw.trim();
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isSafeInteger(n) || n <= 0) return null;
  return String(n);
}

function pickIdRaw(a: Appointment): string {
  const obj = a as unknown as Record<string, unknown>;
  const keys = [
    "id",
    "appointmentId",
    "appointment_id",
    "appointmentID",
    "apptId",
    "appt_id",
  ];
  for (const k of keys) {
    const s = readString(obj, k);
    if (s) return s;
  }
  return "";
}

function pickDateTime(a: Appointment): string {
  const obj = a as unknown as Record<string, unknown>;
  const dtKeys = [
    "datetime",
    "start_time",
    "startTime",
    "scheduled_at",
    "scheduledAt",
    "starts_at",
    "startsAt",
    "created_at",
  ];
  for (const k of dtKeys) {
    const s = readString(obj, k);
    if (s) return s;
  }
  const d = readString(obj, "date");
  const t = readString(obj, "time");
  const combined = `${d ?? ""} ${t ?? ""}`.trim();
  return combined || "—";
}

function pickPatientName(a: Appointment): string {
  const obj = a as unknown as Record<string, unknown>;
  const keys = ["patient_name", "patientName", "full_name", "fullName", "name"];
  for (const k of keys) {
    const s = readString(obj, k);
    if (s) return s;
  }
  return "—";
}

function pickDepartment(a: Appointment): string {
  const obj = a as unknown as Record<string, unknown>;
  const keys = ["department", "departmentName", "specialty", "service"];
  for (const k of keys) {
    const s = readString(obj, k);
    if (s) return s;
  }
  return "—";
}

function pickProvider(a: Appointment): string {
  const obj = a as unknown as Record<string, unknown>;
  const keys = ["provider_name", "providerName", "doctor", "doctorName", "provider"];
  for (const k of keys) {
    const s = readString(obj, k);
    if (s) return s;
  }
  return "—";
}

function pickStatus(a: Appointment): string {
  const obj = a as unknown as Record<string, unknown>;
  const s = readString(obj, "status");
  return s ?? "—";
}

export function AppointmentsTable({ rows }: { rows: Appointment[] }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "rgb(var(--surface))", borderColor: "rgb(var(--border))" }}
    >
      <table className="w-full text-sm">
      <thead className="text-xs uppercase tracking-wide" style={{ background: "rgb(var(--surface2))" }}>          <tr>
            <th className="text-left p-3">Patient</th>
            <th className="text-left p-3">Date/Time</th>
            <th className="text-left p-3">Department</th>
            <th className="text-left p-3">Provider</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3 w-[140px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((a, idx) => {
            const idRaw = pickIdRaw(a);
            const id = idRaw ? normalizeIntId(idRaw) : null;

            const key = id ? `appt:${id}` : `row:${idx}`;

            return (
              <tr
                key={key}
                className="border-t border-black/10 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"              >

                <td className="p-3">{pickPatientName(a)}</td>
                <td className="p-3">{pickDateTime(a)}</td>
                <td className="p-3">{pickDepartment(a)}</td>
                <td className="p-3">{pickProvider(a)}</td>
                <td className="p-3">
                  <AppointmentStatusPill value={pickStatus(a)} />
                </td>
                <td className="p-3">
                  {id ? (
                    <Link
                      href={`/appointments/${id}`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm"
                      style={{
                        background: "rgb(var(--surface2))",
                        borderColor: "rgb(var(--border))",
                        color: "rgb(var(--text))",
                      }}
                    >
                      View <span aria-hidden>→</span>
                    </Link>
                  ) : (
                    <span className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                      No ID
                    </span>
                  )}
                </td>
              </tr>
            );
          })}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-6 text-center text-sm" style={{ color: "rgb(var(--muted))" }}>
                No appointments found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}