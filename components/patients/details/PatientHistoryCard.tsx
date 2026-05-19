// Path: components/patients/detail/PatientHistoryCard.tsx
import { Card } from "@/components/ui/Card";
import type { Patient } from "@/lib/types";

export function PatientHistoryCard({ patient }: { patient: Patient }) {
  const p = patient as unknown as Record<string, unknown>;
  const history =
    (p.appointments as unknown[]) ??
    (p.history as unknown[]) ??
    [];

  return (
    <Card className="p-4">
      <div className="font-semibold mb-2">Appointment History</div>
      {history.length === 0 ? (
        <div className="text-sm" style={{ color: "rgb(var(--muted))" }}>
          No history.
        </div>
      ) : (
        <pre className="text-xs bg-black/5 dark:bg-white/10 p-3 rounded-xl overflow-auto">
          {JSON.stringify(history.slice(0, 10), null, 2)}
        </pre>
      )}
      <div className="text-xs mt-2" style={{ color: "rgb(var(--muted))" }}>
        (We’ll replace this with a proper table once history schema is confirmed.)
      </div>
    </Card>
  );
}