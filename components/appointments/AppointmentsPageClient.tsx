// Path: components/appointments/AppointmentsPageClient.tsx
"use client";

import { useEffect, useMemo } from "react";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { useAppointmentsStore } from "@/store/appointments";
import { AppointmentsFiltersBar } from "./list/AppointmentsFiltersBar";
import { AppointmentsTable } from "./list/AppointmentsTable";

export default function AppointmentsPageClient() {
  const {
    scope, setScope,
    date, setDate,
    status, setStatus,
    q, setQuery,
    limit, setLimit,
    offset, setOffset,
    rows, count,
    loading, error,
    refresh,
  } = useAppointmentsStore();

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, date, status, limit, offset]);

  const filteredRows = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter((a) => JSON.stringify(a).toLowerCase().includes(t));
  }, [q, rows]);

  const hasPrev = offset > 0;
  const hasNext = offset + limit < count;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Appointments</h1>
        <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
          View appointments by scope/date with status filter and pagination.
        </p>
      </div>

      <AppointmentsFiltersBar
        scope={scope}
        setScope={setScope}
        date={date}
        setDate={setDate}
        status={status}
        setStatus={setStatus}
        q={q}
        setQ={setQuery}
        limit={limit}
        setLimit={setLimit}
        onRefresh={refresh}
        showing={filteredRows.length}
        total={count}
        offset={offset}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={() => setOffset(offset - limit)}
        onNext={() => setOffset(offset + limit)}
      />

      {error ? <ErrorCard message={error} /> : null}

      {loading ? <SkeletonTable rows={7} /> : <AppointmentsTable rows={filteredRows} />}
    </div>
  );
}