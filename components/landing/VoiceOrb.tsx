"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { clayTint, TINT } from "./clay";
import { PhoneIcon, CalendarIcon, HeartPulseIcon } from "@/components/ui/icons";

const BARS = [0.4, 0.7, 1, 0.55, 0.85, 0.5, 0.95, 0.6, 0.8];

/**
 * The hero centrepiece: a big puffy clay orb with a live voice waveform,
 * expanding "incoming call" rings, and small clay satellites that bob around
 * it. The waveform is GSAP-driven; rings + satellites use CSS keyframes.
 */
export function VoiceOrb() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(scope.current!.querySelectorAll("[data-bar]"), {
          scaleY: () => 0.35 + Math.random() * 0.65,
          duration: 0.45,
          ease: "sine.inOut",
          stagger: { each: 0.07, from: "center" },
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      data-hero-visual
      className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center"
    >
      {/* expanding incoming-call rings */}
      <span
        className="pointer-events-none absolute h-64 w-64 rounded-full animate-ping-ring sm:h-72 sm:w-72"
        style={{ border: "2px solid rgb(var(--accent) / 0.5)" }}
      />
      <span
        className="pointer-events-none absolute h-64 w-64 rounded-full animate-ping-ring sm:h-72 sm:w-72"
        style={{ border: "2px solid rgb(var(--accent) / 0.5)", animationDelay: "1.3s" }}
      />

      {/* the main clay orb */}
      <div
        className="clay-blob relative grid h-60 w-60 place-items-center sm:h-72 sm:w-72"
        style={{ ...clayTint(TINT.violet), borderRadius: "9999px" }}
      >
        {/* live waveform */}
        <div className="flex h-20 items-center gap-1.5 sm:gap-2">
          {BARS.map((h, i) => (
            <span
              key={i}
              data-bar
              className="w-2 origin-center rounded-full bg-white/90 sm:w-2.5"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* clay satellites — floating product cues */}
      <div
        className="clay-sm absolute -left-2 top-6 flex items-center gap-2 px-3 py-2 animate-float sm:left-2"
        style={clayTint(TINT.sky)}
      >
        <span
          className="grid h-8 w-8 place-items-center rounded-xl"
          style={{ background: "rgb(var(--accent) / 0.14)", color: "rgb(var(--accent))" }}
        >
          <PhoneIcon size={16} />
        </span>
        <span className="text-xs font-semibold" style={{ color: "rgb(var(--text))" }}>
          Incoming call
        </span>
      </div>

      <div
        className="clay-sm absolute -right-1 top-1/3 flex items-center gap-2 px-3 py-2 animate-float-slow"
        style={clayTint(TINT.emerald)}
      >
        <span
          className="grid h-8 w-8 place-items-center rounded-xl"
          style={{ background: "rgb(16 185 129 / 0.16)", color: "rgb(16 185 129)" }}
        >
          <CalendarIcon size={16} />
        </span>
        <span className="text-xs font-semibold" style={{ color: "rgb(var(--text))" }}>
          Booked ✓
        </span>
      </div>

      <div
        className="clay-sm absolute -bottom-1 left-10 flex items-center gap-2 px-3 py-2 animate-float"
        style={{ ...clayTint(TINT.rose), animationDelay: "1.1s" }}
      >
        <span
          className="grid h-8 w-8 place-items-center rounded-xl"
          style={{ background: "rgb(244 63 94 / 0.16)", color: "rgb(244 63 94)" }}
        >
          <HeartPulseIcon size={16} />
        </span>
        <span className="text-xs font-semibold" style={{ color: "rgb(var(--text))" }}>
          Patient matched
        </span>
      </div>
    </div>
  );
}
