"use client";

import { useEffect, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useReservationsStore } from "@/store/reservations";
import { ReservationsFiltersBar } from "./list/ReservationsFiltersBar";
import { ReservationsTable } from "./list/ReservationsTable";

function norm(s: string): string {
  return s.toLowerCase().trim();
}

export default function ReservationsPageClient() {
  const { q, setQuery, rows, count, loading, error, refresh } = useReservationsStore();

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const t = norm(q);
    if (!t) return rows;
    return rows.filter((r) => {
      const o = r as unknown as Record<string, unknown>;
      const hay = [
        String(o.id ?? ""),
        String(o.datetime ?? ""),
        String(o.date ?? ""),
        String(o.time ?? ""),
        String(o.customer_name ?? ""),
        String(o.customer_phone ?? ""),
        String(o.department ?? ""),
        String(o.doctor ?? o.provider ?? ""),
        String(o.status ?? ""),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(t);
    });
  }, [q, rows]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Reservations</h1>
        <p className="text-sm" style={{ color: "rgb(var(--muted))" }}>
          View and manage reservations.
        </p>
      </div>

      <ReservationsFiltersBar
        q={q}
        setQ={setQuery}
        count={filtered.length}
        total={count}
        loading={loading}
        onRefresh={refresh}
      />

      {error ? <ErrorCard message={error} /> : null}

      {loading && rows.length === 0 ? (
        <SkeletonTable rows={8} />
      ) : (
        <Card className="p-0 overflow-hidden">
          <ReservationsTable rows={filtered} />
        </Card>
      )}
    </div>
  );
}
