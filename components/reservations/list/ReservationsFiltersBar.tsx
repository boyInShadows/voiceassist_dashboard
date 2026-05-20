"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ReservationsFiltersBar({
  q,
  setQ,
  count,
  total,
  loading,
  onRefresh,
}: {
  q: string;
  setQ: (v: string) => void;
  count: number;
  total: number;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <Card className="p-3 flex flex-wrap gap-2 items-center">
      <Input
        value={q}
        onChange={setQ}
        placeholder="Search reservations…"
        className="w-80"
      />

      <Button variant="ghost" onClick={onRefresh} disabled={loading}>
        {loading ? "Refreshing…" : "Refresh"}
      </Button>

      <div className="ml-auto text-xs" style={{ color: "rgb(var(--muted))" }}>
        {count} results • total {total}
      </div>
    </Card>
  );
}
