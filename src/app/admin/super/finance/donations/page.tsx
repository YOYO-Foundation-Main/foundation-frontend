
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiAward,
  FiBarChart2,
  FiEyeOff,
  FiHeart,
  FiRefreshCw,
  FiRepeat,
  FiTrendingUp,
  FiUser,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

import { getDonationAnalytics } from "@/features/super-admin/api/finance.api";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

type DonationAnalytics = {
  totalDonations?: number | null;
  totalDonors?: number | null;
  averageDonation?: number | null;
  largestDonation?: number | null;
  smallestDonation?: number | null;
  repeatDonors?: number | null;
  oneTimeDonors?: number | null;
  anonymousDonations?: number | null;
  namedDonations?: number | null;
  anonymousPercentage?: number | null;
  namedPercentage?: number | null;
  averageDonationsPerDonor?: number | null;
};

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function num(v: number | null | undefined): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, v));
}

function fmtInt(v: number | null | undefined): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(num(v)));
}

function fmtINR(v: number | null | undefined): string {
  const n = num(v);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtPct(v: number | null | undefined): string {
  return `${Number(num(v).toFixed(2))}%`;
}

function extractAnalytics(res: unknown): DonationAnalytics | null {
  if (typeof res !== "object" || res === null) return null;
  const r = res as { data?: unknown; totalDonations?: unknown };
  if (typeof r.data === "object" && r.data !== null && !Array.isArray(r.data)) {
    return r.data as DonationAnalytics;
  }
  if ("totalDonations" in r) return res as DonationAnalytics;
  return null;
}

/* -------------------------------------------------------------------------- */
/*                               SMALL COMPONENTS                             */
/* -------------------------------------------------------------------------- */

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
  );
}

function CardTitle({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md">
      <div
        className={`absolute inset-x-0 top-0 h-1 transition-colors ${
          accent ? "bg-red-600" : "bg-gray-200 group-hover:bg-red-300"
        }`}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            accent ? "bg-red-600 text-white" : "bg-red-50 text-red-600"
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 break-words text-3xl font-extrabold tracking-tight text-gray-900">{value}</p>
      {hint ? <p className="mt-1.5 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

function Donut({
  namedPct,
  anonymousPct,
}: {
  namedPct: number;
  anonymousPct: number;
}) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const named = clamp(namedPct);
  const anon = clamp(anonymousPct);
  const namedLen = (c * named) / 100;
  const anonLen = (c * anon) / 100;
  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="70" cy="70" r={r} fill="none" strokeWidth="16" className="stroke-gray-100" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          strokeWidth="16"
          strokeDasharray={`${namedLen} ${c}`}
          className="stroke-red-600"
        />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          strokeWidth="16"
          strokeDasharray={`${anonLen} ${c}`}
          strokeDashoffset={-namedLen}
          className="stroke-gray-800"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold leading-none text-gray-900">{fmtPct(namedPct)}</span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">named</span>
      </div>
    </div>
  );
}

function LegendRow({
  swatch,
  icon,
  label,
  count,
  pct,
}: {
  swatch: string;
  icon: ReactNode;
  label: string;
  count: number | null | undefined;
  pct: number | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${swatch}`} />
        <span className="text-gray-500">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{fmtInt(count)} donations</p>
        </div>
      </div>
      <p className="text-lg font-extrabold text-gray-900">{fmtPct(pct)}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function DonationAnalyticsPage() {
  const [analytics, setAnalytics] = useState<DonationAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const inFlight = useRef<boolean>(false);

  const loadAnalytics = useCallback(async (isRefresh: boolean) => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      const res: unknown = await getDonationAnalytics();
      const parsed = extractAnalytics(res);
      if (!parsed) throw new Error("Unexpected donation analytics response");
      setAnalytics(parsed);
      setUpdatedAt(new Date());
    } catch (err) {
      console.error("Failed to load donation analytics:", err);
      setError(true);
    } finally {
      inFlight.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics(false);
  }, [loadAnalytics]);

  const busy = loading || refreshing;

  const header = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-stretch gap-4">
        <div className="w-1 rounded-full bg-red-600" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">Super Admin · Finance</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Donation Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Insights about donors, donations and contribution behaviour.
          </p>
        </div>
      </div>
      {/* <div className="flex items-center gap-4">
        {updatedAt ? (
          <p className="hidden text-right text-xs text-gray-500 sm:block">
            Last updated
            <span className="block font-semibold text-gray-700">
              {updatedAt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </span>
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void loadAnalytics(true)}
          disabled={busy}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div> */}
    </div>
  );

  /* Loading */
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-8 overflow-x-hidden" aria-busy="true" aria-label="Loading donation analytics">
        {header}
        <Skeleton className="h-60 rounded-3xl" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  /* Error with no data */
  if (error && !analytics) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {header}
        <Card className="mx-auto max-w-lg p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <FiAlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">Unable to load donation analytics</h2>
          <p className="mt-1 text-sm text-gray-500">Something went wrong while fetching the data. Please try again.</p>
          <button
            type="button"
            onClick={() => void loadAnalytics(false)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            <FiRefreshCw className="h-4 w-4" />
            Retry
          </button>
        </Card>
      </div>
    );
  }

  if (!analytics) return null;

  const a = analytics;
  const totalDonors = num(a.totalDonors);
  const repeatRate = totalDonors > 0 ? (num(a.repeatDonors) / totalDonors) * 100 : 0;
  const oneTimeRate = totalDonors > 0 ? (num(a.oneTimeDonors) / totalDonors) * 100 : 0;
  const impliedValue = num(a.totalDonations) * num(a.averageDonation);

  const minD = num(a.smallestDonation);
  const maxD = num(a.largestDonation);
  const avgD = num(a.averageDonation);
  const span = maxD - minD;
  const avgPos = span > 0 ? clamp(((avgD - minD) / span) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 overflow-x-hidden pb-10">
      {header}

      {error ? (
        <div className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>Unable to refresh. Showing the last loaded data.</span>
          <button
            type="button"
            onClick={() => void loadAnalytics(true)}
            disabled={busy}
            className="self-start font-semibold underline underline-offset-2 disabled:opacity-60"
          >
            Retry
          </button>
        </div>
      ) : null}

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-red-100 bg-red-50/60">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-100/80" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-red-100/50" />
        <div className="pointer-events-none absolute right-24 top-10 hidden h-14 w-14 rounded-full border-4 border-red-200/70 lg:block" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-600 ring-1 ring-red-100">
              <FiHeart className="h-3.5 w-3.5" />
              Giving at a glance
            </span>
            <p className="mt-5 text-5xl font-black tracking-tight text-gray-900 sm:text-6xl">
              {fmtInt(a.totalDonations)}
            </p>
            <p className="mt-1 text-base font-medium text-gray-600">total donations received</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-red-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Donors</p>
                <p className="text-xl font-extrabold text-gray-900">{fmtInt(a.totalDonors)}</p>
              </div>
              <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-red-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Avg donation</p>
                <p className="text-xl font-extrabold text-gray-900">{fmtINR(a.averageDonation)}</p>
              </div>
              <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-red-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Donations / donor</p>
                <p className="text-xl font-extrabold text-gray-900">{Number(num(a.averageDonationsPerDonor).toFixed(2))}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="h-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Implied total value
              </p>
              <p className="mt-1 break-words text-3xl font-extrabold tracking-tight text-red-600">
                {fmtINR(impliedValue)}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Calculated as total donations × average donation. It is an approximation and not a figure supplied by the
                API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total donations"
          value={fmtInt(a.totalDonations)}
          hint="Recorded contributions"
          icon={<FiTrendingUp className="h-5 w-5" />}
          accent
        />
        <StatCard
          label="Total donors"
          value={fmtInt(a.totalDonors)}
          hint={`${fmtInt(a.repeatDonors)} have given more than once`}
          icon={<FiUsers className="h-5 w-5" />}
        />
        <StatCard
          label="Average donation"
          value={fmtINR(a.averageDonation)}
          hint="Mean value per donation"
          icon={<FaRupeeSign className="h-4 w-4" />}
        />
        <StatCard
          label="Largest donation"
          value={fmtINR(a.largestDonation)}
          hint="Single biggest contribution"
          icon={<FiAward className="h-5 w-5" />}
        />
      </section>

      {/* Donation type + donor behaviour */}
      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <CardTitle
            icon={<FiBarChart2 className="h-5 w-5" />}
            title="Donation Type"
            subtitle="Named versus anonymous contributions"
          />
          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
            <Donut namedPct={num(a.namedPercentage)} anonymousPct={num(a.anonymousPercentage)} />
            <div className="w-full space-y-3">
              <LegendRow
                swatch="bg-red-600"
                icon={<FiUser className="h-4 w-4" />}
                label="Named donations"
                count={a.namedDonations}
                pct={a.namedPercentage}
              />
              <LegendRow
                swatch="bg-gray-800"
                icon={<FiEyeOff className="h-4 w-4" />}
                label="Anonymous donations"
                count={a.anonymousDonations}
                pct={a.anonymousPercentage}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <CardTitle
            icon={<FiRepeat className="h-5 w-5" />}
            title="Donor Behaviour"
            subtitle="How loyal the donor base is"
          />
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-red-600">
                <FiRepeat className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Repeat donors</p>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-gray-900">{fmtInt(a.repeatDonors)}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiUserCheck className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">One-time donors</p>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-gray-900">{fmtInt(a.oneTimeDonors)}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">Donor loyalty split</span>
              <span className="text-xs text-gray-500">{fmtInt(a.totalDonors)} donors</span>
            </div>
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="bg-red-600" style={{ width: `${clamp(repeatRate)}%` }} />
              <div className="bg-gray-400" style={{ width: `${clamp(oneTimeRate)}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                Repeat {fmtPct(repeatRate)}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
                One-time {fmtPct(oneTimeRate)}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              Percentages are calculated from the donor counts above.
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <FiActivity className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Avg donations per donor</span>
            </div>
            <span className="text-lg font-extrabold text-gray-900">
              {Number(num(a.averageDonationsPerDonor).toFixed(2))}
            </span>
          </div>
        </Card>
      </section>

      {/* Donation range */}
      <section>
        <Card className="p-6">
          <CardTitle
            icon={<FaRupeeSign className="h-4 w-4" />}
            title="Donation Range"
            subtitle="From the smallest to the largest contribution"
          />

          <div className="mt-8 px-2">
            <div className="relative h-3 rounded-full bg-gradient-to-r from-red-100 via-red-300 to-red-600">
              <div
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${avgPos}%` }}
              >
                <div className="h-6 w-6 rounded-full border-4 border-white bg-gray-900 shadow-md" />
              </div>
            </div>
            <div className="mt-3 flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>Smallest</span>
              <span>Largest</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Smallest donation</p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">{fmtINR(a.smallestDonation)}</p>
            </div>
            <div className="rounded-xl border border-gray-900 bg-gray-900 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Average donation</p>
              <p className="mt-1 text-2xl font-extrabold text-white">{fmtINR(a.averageDonation)}</p>
              <p className="mt-1 text-[11px] text-gray-400">
                Sits at {fmtPct(avgPos)} of the way from smallest to largest
              </p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">Largest donation</p>
              <p className="mt-1 text-2xl font-extrabold text-gray-900">{fmtINR(a.largestDonation)}</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}