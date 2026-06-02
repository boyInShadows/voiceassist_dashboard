"use client";

import { useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { clayTint, TINT } from "./clay";
import { VoiceOrb } from "./VoiceOrb";
import {
  PhoneIcon,
  CalendarIcon,
  HeartPulseIcon,
  HelpIcon,
  LayersIcon,
  ChartIcon,
  SparkIcon,
  CheckCircleIcon,
  ShieldIcon,
  SunIcon,
  MoonIcon,
} from "@/components/ui/icons";

/* ----------------------------- content ------------------------------ */

const FEATURES = [
  {
    Icon: PhoneIcon,
    tint: TINT.violet,
    title: "Answers every call",
    desc: "Picks up on the first ring, 24/7. No voicemail, no hold music, no missed patients.",
  },
  {
    Icon: CalendarIcon,
    tint: TINT.sky,
    title: "Books appointments",
    desc: "Finds open slots and schedules the visit in natural conversation — no “press 1” menus.",
  },
  {
    Icon: HeartPulseIcon,
    tint: TINT.rose,
    title: "Knows your patients",
    desc: "Recognises returning callers, pulls their history, and greets them by name.",
  },
  {
    Icon: HelpIcon,
    tint: TINT.amber,
    title: "Answers FAQs instantly",
    desc: "Hours, location, insurance, prep instructions — straight from your own knowledge base.",
  },
  {
    Icon: LayersIcon,
    tint: TINT.teal,
    title: "Takes reservations",
    desc: "Holds slots and manages waitlists so no opening on the calendar ever goes to waste.",
  },
  {
    Icon: ChartIcon,
    tint: TINT.emerald,
    title: "Logs to your dashboard",
    desc: "Every call, booking and transcript lands in real time on the NeuroSpine dashboard.",
  },
];

const STEPS = [
  {
    Icon: PhoneIcon,
    tint: TINT.violet,
    title: "Patient calls",
    desc: "A patient dials your clinic. The assistant answers instantly and listens — no menus, no waiting.",
  },
  {
    Icon: SparkIcon,
    tint: TINT.sky,
    title: "AI understands",
    desc: "Speech-to-text and reasoning turn natural speech into intent, then craft a spoken reply in real time.",
  },
  {
    Icon: CheckCircleIcon,
    tint: TINT.emerald,
    title: "Booked & logged",
    desc: "It books, answers or reserves — and writes the result straight to your dashboard, transcript included.",
  },
];

const STATS = [
  { value: "24/7", label: "Always answering" },
  { value: "0s", label: "Time on hold" },
  { value: "∞", label: "Calls at once" },
  { value: "1", label: "Dashboard for it all" },
];

/* --------------------------- small pieces --------------------------- */

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="grid h-9 w-9 place-items-center rounded-xl font-bold text-white"
        style={{
          background:
            "linear-gradient(135deg, rgb(var(--accent)) 0%, rgba(var(--accent),0.7) 100%)",
          boxShadow: "0 6px 18px rgba(var(--accent),0.35)",
        }}
      >
        N
      </span>
      <div className="leading-tight">
        <div className="font-semibold" style={{ color: "rgb(var(--text))" }}>
          NeuroSpine
        </div>
        <div className="text-[11px]" style={{ color: "rgb(var(--muted))" }}>
          Voice Assistant
        </div>
      </div>
    </div>
  );
}

/** Subscribe to the <html> `dark` class so the icon stays in sync app-wide. */
function useIsDark() {
  return useSyncExternalStore(
    (onChange) => {
      const obs = new MutationObserver(onChange);
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => obs.disconnect();
    },
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
}

/** Compact icon theme toggle — reads/writes the same `theme` the app uses. */
function ThemeButton() {
  const dark = useIsDark();
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid h-10 w-10 place-items-center rounded-xl border transition active:scale-95"
      style={{
        background: "rgb(var(--surface2))",
        borderColor: "rgb(var(--border))",
        color: "rgb(var(--text))",
      }}
    >
      {dark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
}

function ClayCTA({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition active:scale-[0.97] ${className}`}
        style={{
          background:
            "linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent2)) 100%)",
          boxShadow:
            "0 10px 26px rgba(var(--accent),0.4), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.15)",
        }}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold transition active:scale-[0.97] ${className}`}
      style={{
        background: "rgb(var(--surface))",
        borderColor: "rgb(var(--border))",
        color: "rgb(var(--text))",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {children}
    </Link>
  );
}

/* ------------------------------ page -------------------------------- */

export function Landing() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.registerPlugin(ScrollTrigger);

        // Hero entrance
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-hero-item]", {
            y: 32,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
          })
          .from(
            "[data-hero-visual]",
            { scale: 0.82, opacity: 0, duration: 1, ease: "back.out(1.5)" },
            "-=0.65"
          );

        // Scroll reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: "top 85%" },
            y: 44,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
          });
        });

        // Parallax background blobs
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const speed = Number(el.dataset.parallax) || 0.2;
          gsap.to(el, {
            yPercent: -speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="relative min-h-screen overflow-x-clip"
      style={{ background: "rgb(var(--bg))", color: "rgb(var(--text))" }}
    >
      {/* ambient accent wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(60rem 32rem at 78% -8%, rgba(var(--accent),0.12), transparent 60%)",
        }}
      />

      {/* ---- Nav ---- */}
      <header className="sticky top-0 z-50">
        <div
          className="mx-auto mt-3 flex max-w-[1180px] items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur-md sm:px-6"
          style={{
            background: "rgb(var(--surface) / 0.7)",
            borderColor: "rgb(var(--border))",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <Logo />
          <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#features" className="transition hover:opacity-70">
              Features
            </a>
            <a href="#how" className="transition hover:opacity-70">
              How it works
            </a>
            <Link href="/login" className="transition hover:opacity-70">
              Sign in
            </Link>
          </nav>
          <div className="flex items-center gap-2.5">
            <ThemeButton />
            <ClayCTA href="/dashboard" className="!px-4 !py-2.5">
              Open dashboard
            </ClayCTA>
          </div>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative mx-auto max-w-[1180px] px-6 pb-10 pt-12 sm:pt-20">
        {/* floating decorative blobs */}
        <div
          aria-hidden
          data-parallax="0.18"
          className="clay-blob pointer-events-none absolute -left-10 top-24 h-28 w-28 opacity-50 animate-float"
          style={clayTint(TINT.sky)}
        />
        <div
          aria-hidden
          data-parallax="0.3"
          className="clay-blob pointer-events-none absolute right-0 top-2 h-20 w-20 opacity-50 animate-float-slow"
          style={clayTint(TINT.amber)}
        />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span
              data-hero-item
              className="clay-sm inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold"
              style={clayTint(TINT.violet)}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: "rgb(var(--accent))" }}
              />
              Voice AI for NeuroSpine Institute
            </span>

            <h1
              data-hero-item
              className="mt-6 text-4xl font-bold leading-[1.07] tracking-tight sm:text-5xl lg:text-6xl"
            >
              The AI receptionist that{" "}
              <span
                style={{
                  background:
                    "linear-gradient(120deg, rgb(var(--accent)), rgb(var(--accent2)))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                never sleeps.
              </span>
            </h1>

            <p
              data-hero-item
              className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: "rgb(var(--muted))" }}
            >
              NeuroSpine&rsquo;s voice assistant answers every call, books
              appointments, knows your patients, and handles FAQs — then logs it
              all to one calm dashboard. 24/7, with zero hold time.
            </p>

            <div data-hero-item className="mt-8 flex flex-wrap items-center gap-3">
              <ClayCTA href="/dashboard">Open dashboard →</ClayCTA>
              <ClayCTA href="#how" variant="ghost">
                See how it works
              </ClayCTA>
            </div>

            <div
              data-hero-item
              className="mt-8 flex items-center gap-2 text-xs font-medium"
              style={{ color: "rgb(var(--muted))" }}
            >
              <ShieldIcon size={16} />
              Powered by Twilio · Deepgram · OpenAI
            </div>
          </div>

          <VoiceOrb />
        </div>
      </section>

      {/* ---- Stats strip ---- */}
      <section className="mx-auto max-w-[1180px] px-6 py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              className="clay-sm clay-press px-5 py-6 text-center"
              style={clayTint(Object.values(TINT)[i])}
            >
              <div
                className="text-3xl font-bold tabular-nums sm:text-4xl"
                style={{ color: "rgb(var(--accent))" }}
              >
                {s.value}
              </div>
              <div
                className="mt-1 text-xs font-medium sm:text-sm"
                style={{ color: "rgb(var(--muted))" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Features ---- */}
      <section id="features" className="mx-auto max-w-[1180px] px-6 py-16 sm:py-24">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything a front desk does — in software.
          </h2>
          <p className="mt-4 text-base" style={{ color: "rgb(var(--muted))" }}>
            Six things your patients feel on every single call.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, tint, title, desc }) => (
            <div
              key={title}
              data-reveal
              className="clay clay-press p-7"
              style={clayTint(tint)}
            >
              <span
                className="clay-blob grid h-14 w-14 place-items-center text-white"
                style={clayTint(tint)}
              >
                <Icon size={24} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "rgb(var(--muted))" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section id="how" className="mx-auto max-w-[1180px] px-6 py-16 sm:py-24">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From &ldquo;ring&rdquo; to &ldquo;booked&rdquo; in one conversation.
          </h2>
          <p className="mt-4 text-base" style={{ color: "rgb(var(--muted))" }}>
            No menus. No transfers. Just a conversation that ends in a result.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ Icon, tint, title, desc }, i) => (
            <div
              key={title}
              data-reveal
              className="clay clay-press relative p-7"
              style={clayTint(tint)}
            >
              <span
                className="absolute right-6 top-6 text-5xl font-bold tabular-nums opacity-10"
                style={{ color: "rgb(var(--accent))" }}
              >
                {i + 1}
              </span>
              <span
                className="clay-blob grid h-14 w-14 place-items-center text-white"
                style={clayTint(tint)}
              >
                <Icon size={24} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "rgb(var(--muted))" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="mx-auto max-w-[1180px] px-6 py-16 sm:py-24">
        <div
          data-reveal
          className="clay relative overflow-hidden px-8 py-16 text-center sm:px-16"
          style={clayTint(TINT.violet)}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(40rem 20rem at 50% -20%, rgba(var(--accent),0.18), transparent 60%)",
            }}
          />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to never miss another call?
          </h2>
          <p
            className="relative mx-auto mt-4 max-w-lg text-base"
            style={{ color: "rgb(var(--muted))" }}
          >
            Open the dashboard and watch your assistant answer, book and log —
            in real time.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <ClayCTA href="/dashboard">Open dashboard →</ClayCTA>
            <ClayCTA href="/login" variant="ghost">
              Sign in
            </ClayCTA>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer
        className="mx-auto max-w-[1180px] px-6 py-10"
        style={{ borderTop: "1px solid rgb(var(--border))" }}
      >
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <div
            className="flex items-center gap-6 text-sm font-medium"
            style={{ color: "rgb(var(--muted))" }}
          >
            <a href="#features" className="transition hover:opacity-70">
              Features
            </a>
            <a href="#how" className="transition hover:opacity-70">
              How it works
            </a>
            <Link href="/dashboard" className="transition hover:opacity-70">
              Dashboard
            </Link>
          </div>
        </div>
        <p
          className="mt-6 text-center text-xs sm:text-left"
          style={{ color: "rgb(var(--muted))" }}
        >
          © 2026 NeuroSpine Institute · Voice Assistant
        </p>
      </footer>
    </div>
  );
}
