// Path: components/appointments/AppointmentsPageClient.tsx
"use client";

import { SkeletonTable } from "@/components/ui/Skeleton";
import { useAppointments } from "./hooks/useAppointments";
import { AppointmentsFiltersBar } from "./list/AppointmentsFiltersBar";
import { AppointmentsTable } from "./list/AppointmentsTable";

export default function AppointmentsPageClient() {
  const s = useAppointments();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Appointments</h1>
        <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
          View appointments by scope/date with status filter and pagination.
        </p>
      </div>

      <AppointmentsFiltersBar
        scope={s.scope}
        setScope={s.setScope}
        date={s.date}
        setDate={s.setDate}
        status={s.status}
        setStatus={s.setStatus}
        q={s.q}
        setQ={s.setQ}
        limit={s.limit}
        setLimit={s.setLimit}
        onRefresh={s.refresh}
        showing={s.filteredRows.length}
        total={s.count}
        offset={s.offset}
        hasPrev={s.hasPrev}
        hasNext={s.hasNext}
        onPrev={() => s.setOffset(s.offset - s.limit)}
        onNext={() => s.setOffset(s.offset + s.limit)}
      />

      {s.error ? (
        <div className="text-sm" style={{ color: "rgb(239,68,68)" }}>{s.error}</div>
      ) : null}

      {s.loading ? <SkeletonTable rows={7} /> : <AppointmentsTable rows={s.filteredRows} />}
    </div>
  );
}