// Path: components/patients/PatientsPageClient.tsx
"use client";

import { useEffect } from "react";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { usePatientsStore } from "@/store/patients";
import { PatientsFiltersBar } from "./list/PatientsFiltersBar";
import { PatientsTable } from "./list/PatientsTable";

export default function PatientsPageClient() {
  const {
    q, setQuery,
    limit, setLimit,
    offset, setOffset,
    rows, count,
    loading, error,
    refresh,
  } = usePatientsStore();

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, offset]);

  const hasPrev = offset > 0;
  const hasNext = offset + limit < count;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Patients</h1>
        <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
          Search patients and open profile with appointment history.
        </p>
      </div>

      <PatientsFiltersBar
        q={q}
        setQ={setQuery}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={() => setOffset(offset - limit)}
        onNext={() => setOffset(offset + limit)}
        onRefresh={refresh}
        loading={loading}
        showing={rows.length}
        total={count}
      />

      {error ? <ErrorCard message={error} /> : null}
      {loading ? <SkeletonTable rows={6} /> : <PatientsTable rows={rows} />}
    </div>
  );
}