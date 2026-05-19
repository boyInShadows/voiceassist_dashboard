// Path: components/calls/detail/CallDetailClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { SkeletonText } from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { backendGet, BackendError } from "@/lib/backend";
import { CallMetaCard } from "./CallMetaCard";
import { CallTranscriptCard } from "./CallTranscriptCard";

type CallLike = Record<string, unknown>;

function pickParam(v: unknown): string {
  if (Array.isArray(v)) return typeof v[0] === "string" ? v[0] : "";
  return typeof v === "string" ? v : "";
}

function unwrapCallEnvelope(x: unknown): CallLike {
  if (!x || typeof x !== "object") return {};
  const obj = x as Record<string, unknown>;
  const inner = obj.data;
  if (inner && typeof inner === "object") return inner as Record<string, unknown>;
  return obj;
}

export default function CallDetailClient() {
  const params = useParams();
  const callSid = useMemo(() => pickParam(params?.callSid), [params]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [call, setCall] = useState<CallLike | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setErr(null);
      setCall(null);

      if (!callSid) {
        setErr("Invalid callSid in URL.");
        setLoading(false);
        return;
      }

      try {
        // IMPORTANT: backend returns { success, data }
        const raw = await backendGet<unknown>(`/api/calls/${callSid}`);
        const unwrapped = unwrapCallEnvelope(raw);
        if (!cancelled) setCall(unwrapped);
      } catch (e: unknown) {
        if (cancelled) return;
        const msg =
          e instanceof BackendError
            ? `Call fetch failed: ${e.status}`
            : e instanceof Error
              ? e.message
              : "Call fetch failed";
        setErr(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [callSid]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <SkeletonText lines={2} />
        </Card>
        <Card className="p-4">
          <SkeletonText lines={7} />
        </Card>
        <Card className="p-4">
          <SkeletonText lines={10} />
        </Card>
      </div>
    );
  }

  if (err) return <ErrorCard message={err} />;

  if (!call) {
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
      <Card>
        <CardHeader title={`Call ${callSid}`} subtitle="Details and transcript." />
      </Card>

      <CallMetaCard call={call} />
      <CallTranscriptCard call={call} />

      <Card className="p-4">
        <div className="text-sm" style={{ color: "rgb(var(--muted))" }}>
          Next: add Tool Calls + Errors panels if backend returns those fields.
        </div>
      </Card>
    </div>
  );
}