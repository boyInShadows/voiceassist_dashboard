"use client";

import Link from "next/link";
import type { ReservationListItem } from "@/lib/types";
import { TableShell, THead, TH, TR, TD } from "@/components/ui/TableShell";
import { ReservationsStatusPill } from "./ReservationsStatusPill";

type Row = ReservationListItem | Record<string, unknown>;

function readString(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  if (typeof v === "string" && v.trim()) return v.trim();
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return null;
}

function pickId(r: Row): string {
  const o = r as unknown as Record<string, unknown>;
  return (
    readString(o, "id") ??
    readString(o, "reservation_id") ??
    readString(o, "reservationId") ??
    readString(o, "uuid") ??
    ""
  );
}

function pickDatetime(r: Row): string {
  const o = r as unknown as Record<string, unknown>;
  const dt =
    readString(o, "datetime") ??
    readString(o, "date_time") ??
    readString(o, "dateTime") ??
    readString(o, "start_time") ??
    readString(o, "startTime");
  if (dt) return dt;

  const d = readString(o, "date") ?? readString(o, "day");
  const t = readString(o, "time") ?? readString(o, "start");
  const s = `${d ?? ""} ${t ?? ""}`.trim();
  return s || "—";
}

function pickCustomer(r: Row): string {
  const o = r as unknown as Record<string, unknown>;
  return (
    readString(o, "customer_name") ??
    readString(o, "customerName") ??
    readString(o, "full_name") ??
    readString(o, "fullName") ??
    readString(o, "name") ??
    "—"
  );
}

function pickDepartment(r: Row): string {
  const o = r as unknown as Record<string, unknown>;
  return readString(o, "department") ?? readString(o, "specialty") ?? "—";
}

function pickDoctor(r: Row): string {
  const o = r as unknown as Record<string, unknown>;
  return (
    readString(o, "doctor") ??
    readString(o, "provider") ??
    readString(o, "provider_name") ??
    readString(o, "providerName") ??
    "—"
  );
}

function pickStatus(r: Row): string {
  const o = r as unknown as Record<string, unknown>;
  return readString(o, "status") ?? readString(o, "state") ?? "—";
}

export function ReservationsTable({ rows }: { rows: ReservationListItem[] }) {
  return (
    <TableShell>
      <THead>
        <tr>
          <TH>Date/Time</TH>
          <TH>Customer</TH>
          <TH>Department</TH>
          <TH>Doctor</TH>
          <TH>Status</TH>
          <TH widthClass="w-[140px]">Actions</TH>
        </tr>
      </THead>

      <tbody>
        {rows.map((r, idx) => {
          const id = pickId(r);
          const key = id ? `reservation:${id}` : `row:${idx}`;
          const dt = pickDatetime(r);
          const customer = pickCustomer(r);
          const dept = pickDepartment(r);
          const doc = pickDoctor(r);
          const status = pickStatus(r);

          return (
            <TR key={key}>
              <TD>{dt}</TD>
              <TD className="font-medium">{customer}</TD>
              <TD>{dept}</TD>
              <TD>{doc}</TD>
              <TD>
                <ReservationsStatusPill value={status} />
              </TD>
              <TD>
                {id ? (
                  <Link
                    href={`/reservations/${id}`}
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
              </TD>
            </TR>
          );
        })}

        {rows.length === 0 ? (
          <TR>
            <TD colSpan={6} className="p-6 text-center">
              <span className="text-sm" style={{ color: "rgb(var(--muted))" }}>
                No reservations found.
              </span>
            </TD>
          </TR>
        ) : null}
      </tbody>
    </TableShell>
  );
}
