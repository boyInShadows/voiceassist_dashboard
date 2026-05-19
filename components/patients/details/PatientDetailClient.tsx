// Path: components/patients/detail/PatientDetailClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { SkeletonText } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";
import { getPatient, updatePatient } from "@/lib/api/voiceAssistantApi";
import type { Patient } from "@/lib/types";
import { PatientProfileCard } from "./PatientProfileCard";
import { PatientHistoryCard } from "./PatientHistoryCard";

type ApiOne<T> = { success: boolean; data: T };

export type PatientPatchPayload = {
  fullName?: string;
  email?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  address?: string;
  insuranceProvider?: string;
  insuranceId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  preferredLanguage?: string;
  preferredLocationId?: number;
  preferredDoctorId?: number;
  notes?: string;
};

function normalizeIntId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const s = raw.trim();
  if (!/^\d+$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isSafeInteger(n) || n <= 0) return null;
  return String(n);
}

function mergePatient(prev: Patient, next: Patient): Patient {
  const p = prev as unknown as Record<string, unknown>;
  const n = next as unknown as Record<string, unknown>;
  return { ...(p as object), ...(n as object) } as Patient;
}

export default function PatientDetailClient() {
  const params = useParams();
  const rawId = useMemo(() => {
    const v = params?.id;
    return Array.isArray(v) ? v[0] : v;
  }, [params]);

  const idNorm = useMemo(() => normalizeIntId(rawId), [rawId]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  async function load(validId: string) {
    setLoading(true);
    setErr(null);
    try {
      const res: ApiOne<Patient> = await getPatient(validId);
      setPatient(res.data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!idNorm) {
      setLoading(false);
      setErr(`Invalid patient ID in URL. Raw: ${String(rawId ?? "null")}`);
      setPatient(null);
      return;
    }
    void load(idNorm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idNorm]);

  async function onSave(patch: PatientPatchPayload) {
    if (!idNorm || !patient) return;
    setSaving(true);
    setErr(null);

    try {
      const res = await updatePatient(idNorm, patch as unknown as Partial<Patient>);
      setPatient((prev) => (prev ? mergePatient(prev, res.data) : res.data));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card className="p-4">
        <SkeletonText lines={7} />
      </Card>
    );
  }

  if (err) return <ErrorCard message={err} />;

  if (!patient) {
    return (
      <Card className="p-4">
        <div className="text-sm" style={{ color: "rgb(var(--muted))" }}>
          Not found.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PatientProfileCard patient={patient} saving={saving} onSave={onSave} />
      <PatientHistoryCard patient={patient} />
    </div>
  );
}