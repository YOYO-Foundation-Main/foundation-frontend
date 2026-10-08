"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiCheckCircle,
  FiHeart,
  FiInbox,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
  FiX,
  FiXCircle,
  FiZap,
} from "react-icons/fi";
import { FaHandHoldingHeart, FaRupeeSign } from "react-icons/fa";

// Adjust this path to wherever your existing api.ts lives.
import { getUserInsights } from "@/features/super-admin/api/finance.api";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface ExecutiveSummary {
  totalUsers?: number | null;
  newUsersLast30Days?: number | null;
  newUsersLast90Days?: number | null;
  newUsersLast6Months?: number | null;
  activeUsers?: number | null;
  inactiveUsers?: number | null;
  totalDonors?: number | null;
  repeatDonors?: number | null;
  repeatDonorRate?: number | null;
  highValueDonors?: number | null;
  totalDonationAmount?: number | null;
  totalDonationTransactions?: number | null;
  averageDonation?: number | null;
  totalVolunteers?: number | null;
  totalNgoUsers?: number | null;
  verifiedNgoUsers?: number | null;
  pendingNgoUsers?: number | null;
}

interface UserSegments {
  total?: number | null;
  donors?: number | null;
  repeatDonors?: number | null;
  highValueDonors?: number | null;
  volunteers?: number | null;
  ngoUsers?: number | null;
  verifiedNgoUsers?: number | null;
  pendingNgoUsers?: number | null;
  activeUsers?: number | null;
  inactiveUsers?: number | null;
}

interface DonationStats {
  count?: number | null;
  totalAmount?: number | null;
  averageAmount?: number | null;
  largestAmount?: number | null;
  uniqueCampaigns?: number | null;
  last30DaysCount?: number | null;
  last30DaysAmount?: number | null;
  last90DaysCount?: number | null;
  last90DaysAmount?: number | null;
  highValueCount?: number | null;
}

interface EventStats {
  registrations?: number | null;
  attended?: number | null;
  attendanceRate?: number | null;
  last30Days?: number | null;
}

interface CampaignStats {
  created?: number | null;
  approved?: number | null;
}

interface UserNgo {
  id: number;
  name?: string | null;
  status?: string | null;
  isVerified?: boolean | null;
  canReceiveDonations?: boolean | null;
  createdAt?: string | null;
}

interface UserIntel {
  id: number;
  email: string;
  role?: string | null;
  createdAt?: string | null;
  engagementLevel?: string | null;
  activityScore?: number | null;
  donations?: DonationStats | null;
  events?: EventStats | null;
  campaigns?: CampaignStats | null;
  ngo?: UserNgo | null;
  attentionFlags?: string[] | null;
  opportunities?: string[] | null;
}

interface DonorIntelligence {
  totalDonors?: number | null;
  repeatDonors?: number | null;
  repeatDonorRate?: number | null;
  highValueDonors?: number | null;
  totalDonationAmount?: number | null;
  totalDonationTransactions?: number | null;
  averageDonation?: number | null;
  topDonors?: UserIntel[] | null;
  highValueDonorsList?: UserIntel[] | null;
}

interface VolunteerIntelligence {
  totalVolunteers?: number | null;
  totalRegistrations?: number | null;
  totalAttendance?: number | null;
  topVolunteers?: UserIntel[] | null;
}

interface NgoUserIntelligence {
  totalNgoUsers?: number | null;
  verifiedNgoUsers?: number | null;
  pendingNgoUsers?: number | null;
  users?: UserIntel[] | null;
}

interface InsightsData {
  generatedAt?: string | null;
  executiveSummary?: ExecutiveSummary | null;
  roleDistribution?: Record<string, number> | null;
  userSegments?: UserSegments | null;
  engagementDistribution?: Record<string, number> | null;
  donorIntelligence?: DonorIntelligence | null;
  volunteerIntelligence?: VolunteerIntelligence | null;
  ngoUserIntelligence?: NgoUserIntelligence | null;
  topEngagedUsers?: UserIntel[] | null;
  attentionRequired?: UserIntel[] | null;
  userIntelligence?: UserIntel[] | null;
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function extractInsights(res: unknown): InsightsData | null {
  if (!isRecord(res)) return null;
  if ("executiveSummary" in res) return res as unknown as InsightsData;
  const d1 = res.data;
  if (isRecord(d1)) {
    if ("executiveSummary" in d1) return d1 as unknown as InsightsData;
    const d2 = d1.data;
    if (isRecord(d2) && "executiveSummary" in d2) return d2 as unknown as InsightsData;
  }
  return null;
}

function num(v: number | null | undefined): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, v));
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatINR(v: number | null | undefined): string {
  return inr.format(Math.round(num(v)));
}

function formatInt(v: number | null | undefined): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(num(v)));
}

function formatPct(v: number | null | undefined): string {
  return `${Number(num(v).toFixed(2))}%`;
}

function formatScore(v: number | null | undefined): string {
  return `${Math.round(num(v))} / 100`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function humanize(s: string | null | undefined): string {
  if (!s) return "—";
  return s
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type Tone = "good" | "warn" | "bad" | "neutral" | "brand" | "dark";

const badgeCls: Record<Tone, string> = {
  good: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warn: "bg-amber-50 text-amber-700 ring-amber-200",
  bad: "bg-red-50 text-red-700 ring-red-200",
  neutral: "bg-gray-100 text-gray-700 ring-gray-200",
  brand: "bg-red-50 text-red-700 ring-red-200",
  dark: "bg-gray-900 text-white ring-gray-900",
};

const barCls: Record<Tone, string> = {
  good: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-red-500",
  neutral: "bg-gray-300",
  brand: "bg-red-600",
  dark: "bg-gray-800",
};

function engagementTone(level: string | null | undefined): Tone {
  switch (level) {
    case "HIGHLY_ENGAGED":
    case "ENGAGED":
      return "good";
    case "ACTIVE":
      return "dark";
    case "NEW":
      return "brand";
    default:
      return "neutral";
  }
}

function scoreTone(score: number | null | undefined): Tone {
  const s = num(score);
  if (s >= 70) return "good";
  if (s >= 30) return "brand";
  return "neutral";
}

function roleTone(role: string | null | undefined): Tone {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return "dark";
  if (role === "NGO") return "brand";
  return "neutral";
}

const ENGAGEMENT_ORDER = ["HIGHLY_ENGAGED", "ENGAGED", "ACTIVE", "NEW", "INACTIVE"];

function sortEngagementKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const ia = ENGAGEMENT_ORDER.indexOf(a);
    const ib = ENGAGEMENT_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

function isDonor(u: UserIntel): boolean {
  return num(u.donations?.count) > 0;
}
function isVolunteer(u: UserIntel): boolean {
  return num(u.events?.registrations) > 0;
}
function isNgoUser(u: UserIntel): boolean {
  return u.role === "NGO" || (u.ngo !== null && u.ngo !== undefined);
}

/* -------------------------------------------------------------------------- */
/*                               SMALL COMPONENTS                             */
/* -------------------------------------------------------------------------- */

function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeCls[tone]}`}
    >
      {children}
    </span>
  );
}

function Bar({ value, tone = "brand", height = "h-2" }: { value: number; tone?: Tone; height?: string }) {
  const w = clamp(value);
  return (
    <div className={`w-full overflow-hidden rounded-full bg-gray-100 ${height}`}>
      <div className={`${height} rounded-full ${barCls[tone]}`} style={{ width: `${w}%` }} />
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
          {icon}
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
        </div>
      </div>
      {right}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  tone = "dark",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "dark" | "brand" | "good" | "warn";
}) {
  const color =
    tone === "brand"
      ? "text-red-600"
      : tone === "good"
      ? "text-emerald-700"
      : tone === "warn"
      ? "text-amber-700"
      : "text-gray-900";
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${color}`}>{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

function EngagementBadge({ level }: { level: string | null | undefined }) {
  return <Badge tone={engagementTone(level)}>{humanize(level)}</Badge>;
}

function ScoreBar({ score }: { score: number | null | undefined }) {
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-[60px] flex-1">
        <Bar value={num(score)} tone={scoreTone(score)} />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-gray-900">{Math.round(num(score))}</span>
    </div>
  );
}

function EmailCell({ email, className = "max-w-[240px]" }: { email: string; className?: string }) {
  return (
    <span className={`block truncate font-medium text-gray-900 ${className}`} title={email}>
      {email}
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const cls =
    rank === 1
      ? "bg-red-600 text-white"
      : rank === 2
      ? "bg-gray-900 text-white"
      : rank === 3
      ? "bg-gray-600 text-white"
      : "bg-gray-100 text-gray-600";
  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${cls}`}>
      #{rank}
    </div>
  );
}

function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">{children}</p>;
}

/* -------------------------------------------------------------------------- */
/*                              LOADING / ERROR / EMPTY                       */
/* -------------------------------------------------------------------------- */

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading user intelligence">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-80" />
      <Card className="p-5">
        <Skeleton className="h-6 w-56" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      </Card>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="mx-auto max-w-lg p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        <FiAlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">Unable to load user intelligence</h2>
      <p className="mt-1 text-sm text-gray-500">Something went wrong while fetching the data. Please try again.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
      >
        <FiRefreshCw className="h-4 w-4" />
        Retry
      </button>
    </Card>
  );
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card className="mx-auto max-w-lg p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <FiInbox className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">No user intelligence available</h2>
      <p className="mt-1 text-sm text-gray-500">
        There are no users to analyse yet. Insights will appear here once users join the platform.
      </p>
      <button
        type="button"
        onClick={onRefresh}
        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <FiRefreshCw className="h-4 w-4" />
        Refresh
      </button>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                         SECTION 1 — EXECUTIVE SUMMARY                      */
/* -------------------------------------------------------------------------- */

function HeroCard({
  label,
  value,
  sub,
  icon,
  progress,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  progress?: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-white via-white to-red-50 p-5 shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-red-600" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-inset ring-red-100">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{value}</p>
      {sub ? <p className="mt-1 text-sm text-gray-500">{sub}</p> : null}
      {typeof progress === "number" ? (
        <div className="mt-3">
          <Bar value={progress} tone="brand" height="h-2" />
        </div>
      ) : null}
    </div>
  );
}

function Kpi({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: ReactNode }) {
  return (
    <Card className="border-l-4 border-l-red-600 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <div className="text-red-600">{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-gray-500">{sub}</p> : null}
    </Card>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 text-base font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ExecutiveSummarySection({ s }: { s: ExecutiveSummary }) {
  const total = num(s.totalUsers);
  const activePct = total > 0 ? (num(s.activeUsers) / total) * 100 : 0;
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <HeroCard
          label="Total Users"
          value={formatInt(s.totalUsers)}
          sub={`${formatInt(s.newUsersLast30Days)} joined in the last 30 days`}
          icon={<FiUsers className="h-5 w-5" />}
          progress={activePct}
        />
        <HeroCard
          label="Total Donation Amount"
          value={formatINR(s.totalDonationAmount)}
          sub={`${formatInt(s.totalDonationTransactions)} transactions · avg ${formatINR(s.averageDonation)}`}
          icon={<FaRupeeSign className="h-5 w-5" />}
        />
        <HeroCard
          label="Repeat Donor Rate"
          value={formatPct(s.repeatDonorRate)}
          sub={`${formatInt(s.repeatDonors)} of ${formatInt(s.totalDonors)} donors gave more than once`}
          icon={<FiTrendingUp className="h-5 w-5" />}
          progress={num(s.repeatDonorRate)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <Kpi
          label="Active Users"
          value={formatInt(s.activeUsers)}
          sub={`${formatPct(activePct)} of all users`}
          icon={<FiActivity className="h-4 w-4" />}
        />
        <Kpi label="Donors" value={formatInt(s.totalDonors)} icon={<FiHeart className="h-4 w-4" />} />
        <Kpi label="Volunteers" value={formatInt(s.totalVolunteers)} icon={<FiUserCheck className="h-4 w-4" />} />
        <Kpi
          label="NGO Users"
          value={formatInt(s.totalNgoUsers)}
          sub={`${formatInt(s.verifiedNgoUsers)} verified`}
          icon={<FaHandHoldingHeart className="h-4 w-4" />}
        />
        <Kpi label="High Value Donors" value={formatInt(s.highValueDonors)} icon={<FiZap className="h-4 w-4" />} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniKpi label="New · 30 days" value={formatInt(s.newUsersLast30Days)} />
        <MiniKpi label="New · 90 days" value={formatInt(s.newUsersLast90Days)} />
        <MiniKpi label="Inactive users" value={formatInt(s.inactiveUsers)} />
        <MiniKpi label="Repeat donors" value={formatInt(s.repeatDonors)} />
        <MiniKpi label="Donation transactions" value={formatInt(s.totalDonationTransactions)} />
        <MiniKpi label="Average donation" value={formatINR(s.averageDonation)} />
        <MiniKpi label="Verified NGO users" value={formatInt(s.verifiedNgoUsers)} />
        <MiniKpi label="Pending NGO users" value={formatInt(s.pendingNgoUsers)} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                 SECTION 2 & 3 — SEGMENTATION AND ROLE DISTRIBUTION         */
/* -------------------------------------------------------------------------- */

function SegmentationSection({ seg }: { seg: UserSegments }) {
  const total = Math.max(1, num(seg.total));
  const items: { label: string; value: number | null | undefined; tone: Tone }[] = [
    { label: "Donors", value: seg.donors, tone: "brand" },
    { label: "Repeat donors", value: seg.repeatDonors, tone: "brand" },
    { label: "High-value donors", value: seg.highValueDonors, tone: "dark" },
    { label: "Volunteers", value: seg.volunteers, tone: "dark" },
    { label: "NGO users", value: seg.ngoUsers, tone: "brand" },
    { label: "Verified NGO users", value: seg.verifiedNgoUsers, tone: "good" },
    { label: "Pending NGO users", value: seg.pendingNgoUsers, tone: "warn" },
    { label: "Active users", value: seg.activeUsers, tone: "good" },
    { label: "Inactive users", value: seg.inactiveUsers, tone: "neutral" },
  ];
  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiBarChart2 className="h-5 w-5" />}
        title="User Segmentation"
        subtitle={`${formatInt(seg.total)} users across behavioural segments`}
      />
      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-gray-600">{it.label}</span>
              <span className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{formatInt(it.value)}</span>
                <span className="text-xs text-gray-400">{formatPct((num(it.value) / total) * 100)}</span>
              </span>
            </div>
            <Bar value={(num(it.value) / total) * 100} tone={it.tone} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function RoleSection({ roles }: { roles: Record<string, number> }) {
  const entries = Object.entries(roles).sort((a, b) => num(b[1]) - num(a[1]));
  const total = Math.max(1, entries.reduce((a, [, v]) => a + num(v), 0));
  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiUsers className="h-5 w-5" />}
        title="Role Distribution"
        subtitle="Platform accounts by role"
      />
      {entries.length === 0 ? (
        <EmptyNote>No role data available.</EmptyNote>
      ) : (
        <div className="mt-4 space-y-4">
          {entries.map(([role, count], i) => (
            <div key={role}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{humanize(role)}</span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{formatInt(count)}</span>
                  <span className="text-xs text-gray-400">{formatPct((num(count) / total) * 100)}</span>
                </span>
              </div>
              <Bar value={(num(count) / total) * 100} tone={i === 0 ? "brand" : "dark"} height="h-2.5" />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                       SECTION 4 — ENGAGEMENT INTELLIGENCE                  */
/* -------------------------------------------------------------------------- */

function EngagementSection({
  dist,
  activeUsers,
}: {
  dist: Record<string, number>;
  activeUsers: number | null | undefined;
}) {
  const keys = sortEngagementKeys(Object.keys(dist));
  const total = Math.max(1, keys.reduce((a, k) => a + num(dist[k]), 0));
  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiZap className="h-5 w-5" />}
        title="Engagement Intelligence"
        subtitle="How deeply users interact with the platform"
      />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Highly engaged" value={formatInt(dist.HIGHLY_ENGAGED)} tone="good" hint="Strongest users" />
        <Stat label="Active user base" value={formatInt(activeUsers)} tone="brand" hint="Currently active" />
        <Stat label="Inactive users" value={formatInt(dist.INACTIVE)} hint={`${formatPct((num(dist.INACTIVE) / total) * 100)} of users`} />
      </div>
      {keys.length > 0 ? (
        <>
          <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
            {keys.map((k) => (
              <div
                key={k}
                className={barCls[engagementTone(k)]}
                style={{ width: `${(num(dist[k]) / total) * 100}%` }}
                title={`${humanize(k)}: ${num(dist[k])}`}
              />
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {keys.map((k) => (
              <div key={k}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <EngagementBadge level={k} />
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{formatInt(dist[k])}</span>
                    <span className="w-14 text-right text-xs text-gray-400">
                      {formatPct((num(dist[k]) / total) * 100)}
                    </span>
                  </span>
                </div>
                <Bar value={(num(dist[k]) / total) * 100} tone={engagementTone(k)} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyNote>No engagement data available.</EmptyNote>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                        SECTION 5 — DONOR INTELLIGENCE                      */
/* -------------------------------------------------------------------------- */

function DonorSection({
  donor,
  onOpen,
}: {
  donor: DonorIntelligence;
  onOpen: (u: UserIntel) => void;
}) {
  const top = donor.topDonors ?? [];
  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiHeart className="h-5 w-5" />}
        title="Donor Intelligence"
        subtitle="Who gives, how often, and how much"
      />
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total donations" value={formatINR(donor.totalDonationAmount)} tone="brand" hint={`${formatInt(donor.totalDonationTransactions)} transactions`} />
        <Stat label="Total donors" value={formatInt(donor.totalDonors)} />
        <Stat label="Repeat donors" value={formatInt(donor.repeatDonors)} hint={`${formatPct(donor.repeatDonorRate)} repeat rate`} tone="good" />
        <Stat label="High-value donors" value={formatInt(donor.highValueDonors)} />
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Stat label="Average donation" value={formatINR(donor.averageDonation)} />
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Repeat donor rate</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{formatPct(donor.repeatDonorRate)}</p>
          <div className="mt-2">
            <Bar value={num(donor.repeatDonorRate)} tone="good" height="h-2.5" />
          </div>
        </div>
      </div>

      <p className="mb-3 mt-6 text-sm font-semibold text-gray-900">Top Donors</p>
      {top.length === 0 ? (
        <EmptyNote>No donor activity recorded yet.</EmptyNote>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Donor</th>
                <th className="px-4 py-3 text-right font-medium">Total donated</th>
                <th className="px-4 py-3 text-right font-medium">Donations</th>
                <th className="px-4 py-3 text-right font-medium">Average</th>
                <th className="px-4 py-3 text-right font-medium">Largest</th>
                <th className="px-4 py-3 text-right font-medium">Campaigns</th>
                <th className="min-w-[130px] px-4 py-3 font-medium">Activity score</th>
                <th className="px-4 py-3 font-medium">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {top.map((u, i) => (
                <tr
                  key={u.id}
                  onClick={() => onOpen(u)}
                  className="cursor-pointer border-t border-gray-100 hover:bg-red-50/30"
                >
                  <td className="px-4 py-3">
                    <RankBadge rank={i + 1} />
                  </td>
                  <td className="px-4 py-3">
                    <EmailCell email={u.email} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900">
                    {formatINR(u.donations?.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatInt(u.donations?.count)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                    {formatINR(u.donations?.averageAmount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                    {formatINR(u.donations?.largestAmount)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatInt(u.donations?.uniqueCampaigns)}</td>
                  <td className="px-4 py-3">
                    <ScoreBar score={u.activityScore} />
                  </td>
                  <td className="px-4 py-3">
                    <EngagementBadge level={u.engagementLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                         SECTION 6 — HIGH-VALUE DONORS                      */
/* -------------------------------------------------------------------------- */

function HighValueSection({ list, onOpen }: { list: UserIntel[]; onOpen: (u: UserIntel) => void }) {
  const totalContribution = list.reduce((a, u) => a + num(u.donations?.totalAmount), 0);
  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiZap className="h-5 w-5" />}
        title="High-Value Donors"
        subtitle="Users who have contributed significant financial value to the platform"
        right={
          list.length > 0 ? (
            <div className="text-left sm:text-right">
              <p className="text-xs uppercase tracking-wide text-gray-500">Combined contribution</p>
              <p className="text-lg font-bold text-red-600">{formatINR(totalContribution)}</p>
            </div>
          ) : undefined
        }
      />
      {list.length === 0 ? (
        <EmptyNote>No high-value donors identified yet.</EmptyNote>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((u, i) => (
            <button
              key={u.id}
              type="button"
              onClick={() => onOpen(u)}
              className={`rounded-xl border p-4 text-left transition-colors hover:border-red-300 hover:bg-red-50/30 ${
                i === 0 ? "border-red-200 bg-red-50/40" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <RankBadge rank={i + 1} />
                  <EmailCell email={u.email} className="max-w-[180px] text-sm" />
                </div>
                <EngagementBadge level={u.engagementLevel} />
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-wide text-gray-400">Total contribution</p>
              <p className="text-2xl font-bold text-gray-900">{formatINR(u.donations?.totalAmount)}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">Donations</p>
                  <p className="font-semibold text-gray-900">{formatInt(u.donations?.count)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Campaigns supported</p>
                  <p className="font-semibold text-gray-900">{formatInt(u.donations?.uniqueCampaigns)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Average</p>
                  <p className="font-semibold text-gray-900">{formatINR(u.donations?.averageAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Largest</p>
                  <p className="font-semibold text-gray-900">{formatINR(u.donations?.largestAmount)}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-gray-500">
                  <span>Activity score</span>
                  <span className="font-semibold text-gray-900">{formatScore(u.activityScore)}</span>
                </div>
                <Bar value={num(u.activityScore)} tone={scoreTone(u.activityScore)} />
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                       SECTION 7 — VOLUNTEER INTELLIGENCE                   */
/* -------------------------------------------------------------------------- */

function VolunteerSection({ vol, onOpen }: { vol: VolunteerIntelligence; onOpen: (u: UserIntel) => void }) {
  const list = vol.topVolunteers ?? [];
  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiUserCheck className="h-5 w-5" />}
        title="Volunteer Intelligence"
        subtitle="Event participation and attendance"
      />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Total volunteers" value={formatInt(vol.totalVolunteers)} />
        <Stat label="Total registrations" value={formatInt(vol.totalRegistrations)} tone="brand" />
        <Stat label="Total attendance" value={formatInt(vol.totalAttendance)} tone={num(vol.totalAttendance) === 0 ? "warn" : "good"} />
      </div>
      <p className="mb-3 mt-6 text-sm font-semibold text-gray-900">Most Engaged Volunteers</p>
      {list.length === 0 ? (
        <EmptyNote>No volunteer activity recorded yet.</EmptyNote>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Volunteer</th>
                <th className="px-4 py-3 text-right font-medium">Registrations</th>
                <th className="px-4 py-3 text-right font-medium">Attended</th>
                <th className="min-w-[150px] px-4 py-3 font-medium">Attendance rate</th>
                <th className="min-w-[130px] px-4 py-3 font-medium">Activity score</th>
                <th className="px-4 py-3 font-medium">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u, i) => (
                <tr
                  key={u.id}
                  onClick={() => onOpen(u)}
                  className="cursor-pointer border-t border-gray-100 hover:bg-red-50/30"
                >
                  <td className="px-4 py-3">
                    <RankBadge rank={i + 1} />
                  </td>
                  <td className="px-4 py-3">
                    <EmailCell email={u.email} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {formatInt(u.events?.registrations)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatInt(u.events?.attended)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Bar value={num(u.events?.attendanceRate)} tone="good" />
                      </div>
                      <span className="w-12 text-right text-xs font-medium text-gray-700">
                        {formatPct(u.events?.attendanceRate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBar score={u.activityScore} />
                  </td>
                  <td className="px-4 py-3">
                    <EngagementBadge level={u.engagementLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                        SECTION 8 — NGO USER INTELLIGENCE                   */
/* -------------------------------------------------------------------------- */

function NgoStatusBadges({ ngo }: { ngo: UserNgo | null | undefined }) {
  if (!ngo) return <span className="text-xs text-gray-400">No NGO linked</span>;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Badge tone={ngo.status === "VERIFIED" ? "good" : "warn"}>{humanize(ngo.status)}</Badge>
      <Badge tone={ngo.isVerified ? "good" : "warn"}>{ngo.isVerified ? "Verified" : "Not verified"}</Badge>
      <Badge tone={ngo.canReceiveDonations ? "good" : "bad"}>
        {ngo.canReceiveDonations ? "Can receive donations" : "Cannot receive donations"}
      </Badge>
    </div>
  );
}

function NgoSection({ ngoIntel, onOpen }: { ngoIntel: NgoUserIntelligence; onOpen: (u: UserIntel) => void }) {
  const users = ngoIntel.users ?? [];
  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FaHandHoldingHeart className="h-5 w-5" />}
        title="NGO User Intelligence"
        subtitle="Verification status, donation readiness and campaign activity"
      />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="NGO users" value={formatInt(ngoIntel.totalNgoUsers)} />
        <Stat label="Verified" value={formatInt(ngoIntel.verifiedNgoUsers)} tone="good" />
        <Stat label="Pending" value={formatInt(ngoIntel.pendingNgoUsers)} tone={num(ngoIntel.pendingNgoUsers) > 0 ? "warn" : "dark"} />
      </div>
      {users.length === 0 ? (
        <EmptyNote>No NGO users found.</EmptyNote>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {users.map((u) => {
            const flags = u.attentionFlags ?? [];
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => onOpen(u)}
                className={`rounded-lg border p-4 text-left transition-colors hover:bg-gray-50 ${
                  flags.length > 0 ? "border-amber-200 bg-amber-50/30" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{u.ngo?.name?.trim() || "Unnamed NGO"}</p>
                    <p className="truncate text-xs text-gray-500" title={u.email}>
                      {u.email}
                    </p>
                  </div>
                  <EngagementBadge level={u.engagementLevel} />
                </div>
                <div className="mt-2">
                  <NgoStatusBadges ngo={u.ngo} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Campaigns created</p>
                    <p className="font-semibold text-gray-900">{formatInt(u.campaigns?.created)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Approved</p>
                    <p className="font-semibold text-gray-900">{formatInt(u.campaigns?.approved)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Activity score</p>
                    <p className="font-semibold text-gray-900">{formatScore(u.activityScore)}</p>
                  </div>
                </div>
                {flags.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {flags.map((f) => (
                      <span key={f} className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        {f}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                         SECTION 9 — TOP ENGAGED USERS                      */
/* -------------------------------------------------------------------------- */

function TopEngagedSection({ users, onOpen }: { users: UserIntel[]; onOpen: (u: UserIntel) => void }) {
  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiActivity className="h-5 w-5" />}
        title="Top Platform Users"
        subtitle="Ranked by Platform Activity Score"
      />
      {users.length === 0 ? (
        <EmptyNote>No engaged users to display.</EmptyNote>
      ) : (
        <div className="mt-4 space-y-2">
          {users.map((u, i) => (
            <button
              key={u.id}
              type="button"
              onClick={() => onOpen(u)}
              className={`flex w-full flex-col gap-4 rounded-lg border p-3 text-left transition-colors hover:border-red-300 hover:bg-red-50/30 lg:flex-row lg:items-center ${
                i === 0 ? "border-red-200 bg-red-50/40" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <RankBadge rank={i + 1} />
                <div className="min-w-0">
                  <EmailCell email={u.email} className="max-w-[280px] text-sm" />
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={roleTone(u.role)}>{humanize(u.role)}</Badge>
                    <EngagementBadge level={u.engagementLevel} />
                    {(u.opportunities ?? []).length > 0 ? (
                      <Badge tone="neutral">
                        {(u.opportunities ?? []).length} opportunit{(u.opportunities ?? []).length === 1 ? "y" : "ies"}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="grid flex-1 grid-cols-3 gap-3 text-xs sm:grid-cols-5">
                <div>
                  <p className="text-gray-400">Total donated</p>
                  <p className="font-semibold text-gray-900">{formatINR(u.donations?.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Donations</p>
                  <p className="font-semibold text-gray-900">{formatInt(u.donations?.count)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Events</p>
                  <p className="font-semibold text-gray-900">{formatInt(u.events?.registrations)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Attended</p>
                  <p className="font-semibold text-gray-900">{formatInt(u.events?.attended)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Campaigns created</p>
                  <p className="font-semibold text-gray-900">{formatInt(u.campaigns?.created)}</p>
                </div>
              </div>
              <div className="w-full lg:w-48">
                <p className="text-[11px] uppercase tracking-wide text-gray-400">Platform Activity Score</p>
                <p className="text-xl font-bold text-gray-900">{formatScore(u.activityScore)}</p>
                <div className="mt-1">
                  <Bar value={num(u.activityScore)} tone={scoreTone(u.activityScore)} height="h-2.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                       SECTION 10 — ATTENTION REQUIRED                      */
/* -------------------------------------------------------------------------- */

function AttentionSection({ users, onOpen }: { users: UserIntel[]; onOpen: (u: UserIntel) => void }) {
  const [showAll, setShowAll] = useState(false);

  const flagCounts = useMemo(() => {
    const map = new Map<string, number>();
    users.forEach((u) => (u.attentionFlags ?? []).forEach((f) => map.set(f, (map.get(f) ?? 0) + 1)));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [users]);

  const visible = showAll ? users : users.slice(0, 8);

  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiAlertTriangle className="h-5 w-5" />}
        title="Attention Required"
        subtitle="Users who may require management action"
        right={<Badge tone={users.length > 0 ? "warn" : "good"}>{formatInt(users.length)} users flagged</Badge>}
      />
      {users.length === 0 ? (
        <p className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
          No users currently require attention.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {flagCounts.map(([flag, count]) => (
              <span
                key={flag}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800"
              >
                {flag}
                <span className="rounded bg-amber-200 px-1.5 text-amber-900">{count}</span>
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
            {visible.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => onOpen(u)}
                className="rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:border-amber-300 hover:bg-amber-50/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <EmailCell email={u.email} className="max-w-[260px] text-sm" />
                  <Badge tone={roleTone(u.role)}>{humanize(u.role)}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(u.attentionFlags ?? []).map((f) => (
                    <span key={f} className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                      {f}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Joined {formatDate(u.createdAt)} · <span className="font-medium">{humanize(u.engagementLevel)}</span>
                  {u.ngo?.name ? ` · ${u.ngo.name.trim()}` : ""}
                </p>
              </button>
            ))}
          </div>
          {users.length > 8 ? (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {showAll ? "Show fewer" : `Show all ${users.length} users`}
              </button>
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                          SECTION 11 — OPPORTUNITIES                        */
/* -------------------------------------------------------------------------- */

function OpportunitiesSection({ users, onOpen }: { users: UserIntel[]; onOpen: (u: UserIntel) => void }) {
  const groups = useMemo(() => {
    const map = new Map<string, UserIntel[]>();
    users.forEach((u) => (u.opportunities ?? []).forEach((o) => map.set(o, [...(map.get(o) ?? []), u])));
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [users]);

  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiTrendingUp className="h-5 w-5" />}
        title="Opportunities"
        subtitle="Positive signals management can build on"
        right={<Badge tone="neutral">{groups.length} opportunity types</Badge>}
      />
      {groups.length === 0 ? (
        <EmptyNote>No opportunities identified yet.</EmptyNote>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {groups.map(([opp, list]) => {
            const sorted = [...list].sort((a, b) => num(b.activityScore) - num(a.activityScore));
            return (
              <div key={opp} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">{opp}</p>
                  <span className="shrink-0 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                    {list.length}
                  </span>
                </div>
                <div className="mt-3 space-y-1.5">
                  {sorted.slice(0, 4).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => onOpen(u)}
                      className="flex w-full items-center justify-between gap-2 rounded-md bg-gray-50 px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-red-50"
                    >
                      <span className="truncate text-gray-700" title={u.email}>
                        {u.email}
                      </span>
                      <span className="shrink-0 font-semibold text-gray-900">{Math.round(num(u.activityScore))}</span>
                    </button>
                  ))}
                  {list.length > 4 ? (
                    <p className="pt-1 text-xs text-gray-400">+{list.length - 4} more users</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                      SECTION 12 — FULL USER INTELLIGENCE                   */
/* -------------------------------------------------------------------------- */

type SortKey = "score" | "totalDonated" | "donationCount" | "attendance" | "campaignsCreated" | "created";
type TypeFilter = "all" | "donors" | "volunteers" | "ngo";

const PAGE_SIZE = 15;

function UserTable({
  users,
  roleKeys,
  engagementKeys,
  onOpen,
}: {
  users: UserIntel[];
  roleKeys: string[];
  engagementKeys: string[];
  onOpen: (u: UserIntel) => void;
}) {
  const [query, setQuery] = useState("");
  const [engagement, setEngagement] = useState("ALL");
  const [role, setRole] = useState("ALL");
  const [type, setType] = useState<TypeFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query, engagement, role, type, sortKey]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = users.filter((u) => {
      if (q) {
        const hay = `${u.email} ${u.role ?? ""} ${u.ngo?.name ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (engagement !== "ALL" && u.engagementLevel !== engagement) return false;
      if (role !== "ALL" && u.role !== role) return false;
      if (type === "donors" && !isDonor(u)) return false;
      if (type === "volunteers" && !isVolunteer(u)) return false;
      if (type === "ngo" && !isNgoUser(u)) return false;
      return true;
    });
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      switch (sortKey) {
        case "totalDonated":
          return num(b.donations?.totalAmount) - num(a.donations?.totalAmount);
        case "donationCount":
          return num(b.donations?.count) - num(a.donations?.count);
        case "attendance":
          return num(b.events?.attended) - num(a.events?.attended);
        case "campaignsCreated":
          return num(b.campaigns?.created) - num(a.campaigns?.created);
        case "created":
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
        default:
          return num(b.activityScore) - num(a.activityScore);
      }
    });
    return sorted;
  }, [users, query, engagement, role, type, sortKey]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
    }`;

  const selectCls =
    "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";

  return (
    <Card className="p-5">
      <SectionHeader
        icon={<FiUsers className="h-5 w-5" />}
        title="Full User Intelligence"
        subtitle={`${formatInt(rows.length)} of ${formatInt(users.length)} users`}
      />

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative lg:w-80">
          <FiSearch className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search email, role or NGO"
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={role} onChange={(e) => setRole(e.target.value)} className={selectCls} aria-label="Filter by role">
            <option value="ALL">All roles</option>
            {roleKeys.map((r) => (
              <option key={r} value={r}>
                {humanize(r)}
              </option>
            ))}
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className={selectCls}
            aria-label="Sort users"
          >
            <option value="score">Sort: Activity score</option>
            <option value="totalDonated">Sort: Total donated</option>
            <option value="donationCount">Sort: Donation count</option>
            <option value="attendance">Sort: Event attendance</option>
            <option value="campaignsCreated">Sort: Campaigns created</option>
            <option value="created">Sort: Created date</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
          <button type="button" onClick={() => setEngagement("ALL")} className={chip(engagement === "ALL")}>
            All
          </button>
          {engagementKeys.map((k) => (
            <button key={k} type="button" onClick={() => setEngagement(k)} className={chip(engagement === k)}>
              {humanize(k)}
            </button>
          ))}
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
          {(
            [
              ["all", "All users"],
              ["donors", "Donors"],
              ["volunteers", "Volunteers"],
              ["ngo", "NGO users"],
            ] as [TypeFilter, string][]
          ).map(([k, label]) => (
            <button key={k} type="button" onClick={() => setType(k)} className={chip(type === k)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[1500px] text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Engagement</th>
              <th className="min-w-[130px] px-4 py-3 font-medium">Activity score</th>
              <th className="px-4 py-3 text-right font-medium">Donations</th>
              <th className="px-4 py-3 text-right font-medium">Total donated</th>
              <th className="px-4 py-3 text-right font-medium">Average</th>
              <th className="px-4 py-3 text-right font-medium">Largest</th>
              <th className="px-4 py-3 text-right font-medium">Campaigns supported</th>
              <th className="px-4 py-3 text-right font-medium">Event regs</th>
              <th className="px-4 py-3 text-right font-medium">Attended</th>
              <th className="px-4 py-3 text-right font-medium">Campaigns created</th>
              <th className="px-4 py-3 font-medium">NGO</th>
              <th className="px-4 py-3 font-medium">Attention</th>
              <th className="px-4 py-3 font-medium">Opportunities</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={16} className="px-4 py-10 text-center text-gray-500">
                  No users match your filters.
                </td>
              </tr>
            ) : (
              pageRows.map((u) => {
                const flags = (u.attentionFlags ?? []).length;
                const opps = (u.opportunities ?? []).length;
                return (
                  <tr
                    key={u.id}
                    onClick={() => onOpen(u)}
                    className="cursor-pointer border-t border-gray-100 hover:bg-red-50/30"
                  >
                    <td className="px-4 py-3">
                      <EmailCell email={u.email} className="max-w-[240px]" />
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={roleTone(u.role)}>{humanize(u.role)}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <EngagementBadge level={u.engagementLevel} />
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBar score={u.activityScore} />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatInt(u.donations?.count)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900">
                      {formatINR(u.donations?.totalAmount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                      {formatINR(u.donations?.averageAmount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                      {formatINR(u.donations?.largestAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatInt(u.donations?.uniqueCampaigns)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatInt(u.events?.registrations)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatInt(u.events?.attended)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatInt(u.campaigns?.created)}</td>
                    <td className="max-w-[160px] truncate px-4 py-3 text-gray-700">
                      {u.ngo?.name?.trim() || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {flags > 0 ? (
                        <Badge tone="warn">
                          {flags} flag{flags > 1 ? "s" : ""}
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {opps > 0 ? (
                        <Badge tone="good">
                          {opps} found
                        </Badge>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                               USER DETAIL MODAL                            */
/* -------------------------------------------------------------------------- */

function CheckRow({ ok, label }: { ok: boolean | null | undefined; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-gray-700">
      {ok ? <FiCheckCircle className="h-4 w-4 text-emerald-600" /> : <FiXCircle className="h-4 w-4 text-red-400" />}
      <span>{label}</span>
    </div>
  );
}

function DetailModal({ user, onClose }: { user: UserIntel; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const d = user.donations;
  const e = user.events;
  const c = user.campaigns;
  const flags = user.attentionFlags ?? [];
  const opps = user.opportunities ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="User intelligence profile"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-white p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600">User Intelligence Profile</p>
            <h3 className="mt-0.5 truncate text-lg font-semibold text-gray-900" title={user.email}>
              {user.email}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone={roleTone(user.role)}>{humanize(user.role)}</Badge>
              <EngagementBadge level={user.engagementLevel} />
              <span className="text-xs text-gray-500">Joined {formatDate(user.createdAt)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div className="rounded-xl border border-red-100 bg-red-50/40 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Platform Activity Score</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{formatScore(user.activityScore)}</p>
            <div className="mt-2">
              <Bar value={num(user.activityScore)} tone={scoreTone(user.activityScore)} height="h-2.5" />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-gray-900">Donation Intelligence</p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Donations" value={formatInt(d?.count)} />
              <Stat label="Total amount" value={formatINR(d?.totalAmount)} tone="brand" />
              <Stat label="Average" value={formatINR(d?.averageAmount)} />
              <Stat label="Largest" value={formatINR(d?.largestAmount)} />
              <Stat label="Unique campaigns" value={formatInt(d?.uniqueCampaigns)} />
              <Stat label="Last 30 days" value={formatINR(d?.last30DaysAmount)} hint={`${formatInt(d?.last30DaysCount)} donations`} />
              <Stat label="Last 90 days" value={formatINR(d?.last90DaysAmount)} hint={`${formatInt(d?.last90DaysCount)} donations`} />
              <Stat label="High-value donations" value={formatInt(d?.highValueCount)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">Event Intelligence</p>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Registrations" value={formatInt(e?.registrations)} />
                <Stat label="Attended" value={formatInt(e?.attended)} />
                <Stat label="Last 30 days" value={formatInt(e?.last30Days)} />
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Attendance rate</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{formatPct(e?.attendanceRate)}</p>
                  <div className="mt-2">
                    <Bar value={num(e?.attendanceRate)} tone="good" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">Campaign Intelligence</p>
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Created" value={formatInt(c?.created)} />
                <Stat label="Approved" value={formatInt(c?.approved)} tone="good" />
              </div>
              <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Approval rate</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {num(c?.created) > 0 ? formatPct((num(c?.approved) / num(c?.created)) * 100) : "—"}
                </p>
                <div className="mt-2">
                  <Bar value={num(c?.created) > 0 ? (num(c?.approved) / num(c?.created)) * 100 : 0} tone="brand" />
                </div>
              </div>
            </div>
          </div>

          {user.ngo ? (
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">NGO</p>
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-base font-semibold text-gray-900">{user.ngo.name?.trim() || "Unnamed NGO"}</p>
                <p className="text-xs text-gray-500">Registered {formatDate(user.ngo.createdAt)}</p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-gray-500">Status:</span>
                    <Badge tone={user.ngo.status === "VERIFIED" ? "good" : "warn"}>{humanize(user.ngo.status)}</Badge>
                  </div>
                  <CheckRow ok={user.ngo.isVerified} label="Verified" />
                  <CheckRow ok={user.ngo.canReceiveDonations} label="Can receive donations" />
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                <FiAlertTriangle className="h-4 w-4 text-red-600" /> Attention
              </p>
              {flags.length > 0 ? (
                <ul className="space-y-1.5">
                  {flags.map((f) => (
                    <li key={f} className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                      {f}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-500">No attention flags.</p>
              )}
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                <FiTrendingUp className="h-4 w-4 text-red-600" /> Opportunities
              </p>
              {opps.length > 0 ? (
                <ul className="space-y-1.5">
                  {opps.map((o) => (
                    <li key={o} className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                      {o}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-500">No opportunities identified.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function UserIntelligencePage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selected, setSelected] = useState<UserIntel | null>(null);

  const load = useCallback(async (isRefresh: boolean) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      const res: unknown = await getUserInsights();
      const parsed = extractInsights(res);
      if (!parsed) throw new Error("Unexpected User Insights response shape");
      setData(parsed);
    } catch (err) {
      console.error("User Insights fetch failed:", err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const closeModal = useCallback(() => setSelected(null), []);
  const openUser = useCallback((u: UserIntel) => setSelected(u), []);

  const users = useMemo<UserIntel[]>(() => data?.userIntelligence ?? [], [data]);
  const roles = useMemo<Record<string, number>>(() => data?.roleDistribution ?? {}, [data]);
  const engagement = useMemo<Record<string, number>>(() => data?.engagementDistribution ?? {}, [data]);

  const roleKeys = useMemo(
    () => Object.keys(roles).sort((a, b) => num(roles[b]) - num(roles[a])),
    [roles]
  );
  const engagementKeys = useMemo(() => sortEngagementKeys(Object.keys(engagement)), [engagement]);

  const summary: ExecutiveSummary = data?.executiveSummary ?? {};
  const isEmpty = !!data && users.length === 0 && num(summary.totalUsers) === 0;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <div className="mx-auto w-full max-w-[2500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden h-12 w-1.5 rounded-full bg-red-600 sm:block" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Intelligence</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Understand who uses the platform, how they engage, what they contribute, and where management
                attention is required.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {data?.generatedAt ? (
              <p className="hidden text-xs text-gray-500 sm:block">
                Last updated
                <span className="block font-medium text-gray-700">{formatDateTime(data.generatedAt)}</span>
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </header>

        {loading ? (
          <DashboardSkeleton />
        ) : error && !data ? (
          <ErrorState onRetry={() => void load(false)} />
        ) : !data || isEmpty ? (
          <EmptyState onRefresh={() => void load(true)} />
        ) : (
          <>
            {error ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span>Unable to refresh. Showing previously loaded data.</span>
                <button
                  type="button"
                  onClick={() => void load(true)}
                  className="font-semibold underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            ) : null}

            <ExecutiveSummarySection s={summary} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <SegmentationSection seg={data.userSegments ?? {}} />
              </div>
              <RoleSection roles={roles} />
            </div>

            <EngagementSection dist={engagement} activeUsers={summary.activeUsers} />

            <DonorSection donor={data.donorIntelligence ?? {}} onOpen={openUser} />

            <HighValueSection list={data.donorIntelligence?.highValueDonorsList ?? []} onOpen={openUser} />

            <VolunteerSection vol={data.volunteerIntelligence ?? {}} onOpen={openUser} />

            <NgoSection ngoIntel={data.ngoUserIntelligence ?? {}} onOpen={openUser} />

            <TopEngagedSection users={data.topEngagedUsers ?? []} onOpen={openUser} />

            <AttentionSection users={data.attentionRequired ?? []} onOpen={openUser} />

            <OpportunitiesSection users={users} onOpen={openUser} />

            <UserTable users={users} roleKeys={roleKeys} engagementKeys={engagementKeys} onOpen={openUser} />
          </>
        )}
      </div>

      {selected ? <DetailModal user={selected} onClose={closeModal} /> : null}
    </div>
  );
}