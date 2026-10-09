"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowDownRight,
  FiArrowUpRight,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiCreditCard,
  FiFlag,
  FiHeart,
  FiInbox,
  FiInfo,
  FiMinus,
  FiRefreshCw,
  FiShield,
  FiTarget,
  FiUserCheck,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";

// Adjust this path if your api.ts lives elsewhere.
import { getPlatformIntelligence } from "@/features/super-admin/api/finance.api";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface ExecutiveSummary {
  totalUsers?: number | null;
  newUsersLast30Days?: number | null;
  newUsersPrevious30Days?: number | null;
  newUsersLast90Days?: number | null;
  userGrowthPercent?: number | null;
  activeContributors?: number | null;
  donorUsers?: number | null;
  volunteerUsers?: number | null;
  totalNgos?: number | null;
  verifiedNgos?: number | null;
  pendingNgos?: number | null;
  totalCampaigns?: number | null;
  activeCampaigns?: number | null;
  approvedCampaigns?: number | null;
  pendingCampaigns?: number | null;
  successfulDonationTransactions?: number | null;
  successfulDonationAmount?: number | null;
  successfulDonationAmountLast30Days?: number | null;
  successfulDonationAmountPrevious30Days?: number | null;
  donationGrowthPercent?: number | null;
  failedPayments?: number | null;
  pendingPayments?: number | null;
  totalEvents?: number | null;
  activeEvents?: number | null;
  totalVolunteerRegistrations?: number | null;
  attendanceRatePercent?: number | null;
}

interface UserAcquisition {
  currentPeriodUsers?: number | null;
  previousPeriodUsers?: number | null;
  changePercent?: number | null;
  periodDays?: number | null;
}

interface DonationValueTrend {
  currentPeriod?: number | null;
  previousPeriod?: number | null;
  changePercent?: number | null;
  periodDays?: number | null;
}

interface VolunteerRegistrationsTrend {
  last30Days?: number | null;
  total?: number | null;
}

interface Trends {
  userAcquisition?: UserAcquisition | null;
  successfulDonationValue?: DonationValueTrend | null;
  volunteerRegistrations?: VolunteerRegistrationsTrend | null;
}

interface OperationalQueues {
  pendingNgoVerification?: number | null;
  pendingCampaignApprovals?: number | null;
  pendingPayments?: number | null;
  failedPayments?: number | null;
  verifiedNgosUnableToReceiveDonations?: number | null;
}

interface CampaignRow {
  id: number;
  title?: string | null;
  goalAmount?: number | null;
  raisedAmount?: number | null;
  achievementPercent?: number | null;
  daysUntilEnd?: number | null;
}

interface CampaignAchievement {
  activeCampaigns?: number | null;
  under25PercentOfGoal?: number | null;
  withNoSuccessfulDonations?: number | null;
  endingWithin7Days?: number | null;
  campaigns?: CampaignRow[] | null;
}

interface NgoReadiness {
  total?: number | null;
  verified?: number | null;
  pendingReview?: number | null;
  unableToReceiveDonations?: number | null;
  withNoCampaigns?: number | null;
}

interface VolunteerEngagement {
  activeEvents?: number | null;
  registrationsLast30Days?: number | null;
  totalRegistrations?: number | null;
  attendedRegistrations?: number | null;
  attendanceRatePercent?: number | null;
  eventsWithNoRegistrations?: number | null;
}

interface Performance {
  campaignAchievement?: CampaignAchievement | null;
  ngoReadiness?: NgoReadiness | null;
  volunteerEngagement?: VolunteerEngagement | null;
}

interface AlertItem {
  severity?: string | null;
  category?: string | null;
  title?: string | null;
  message?: string | null;
  count?: number | null;
}

interface ActionItem {
  priority?: string | null;
  title?: string | null;
  reason?: string | null;
  count?: number | null;
}

interface PlatformData {
  generatedAt?: string | null;
  executiveSummary?: ExecutiveSummary | null;
  trends?: Trends | null;
  operationalQueues?: OperationalQueues | null;
  performance?: Performance | null;
  alerts?: AlertItem[] | null;
  recommendedActions?: ActionItem[] | null;
  limitations?: string[] | null;
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function extractData(res: unknown): PlatformData | null {
  if (!isRecord(res)) return null;
  if ("executiveSummary" in res) return res as unknown as PlatformData;
  const d1 = res.data;
  if (isRecord(d1)) {
    if ("executiveSummary" in d1) return d1 as unknown as PlatformData;
    const d2 = d1.data;
    if (isRecord(d2) && "executiveSummary" in d2) return d2 as unknown as PlatformData;
  }
  return null;
}

function isNum(v: number | null | undefined): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function n0(v: number | null | undefined): number {
  return isNum(v) ? v : 0;
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, v));
}

const intFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function fmtInt(v: number | null | undefined): string {
  return isNum(v) ? intFmt.format(Math.round(v)) : "—";
}

function fmtPct(v: number | null | undefined): string {
  return isNum(v) ? `${Number(v.toFixed(2))}%` : "—";
}

function fmtINR(v: number | null | undefined, forceDecimals = false): string {
  if (!isNum(v)) return "—";
  const decimals = !forceDecimals && Number.isInteger(v) ? 0 : 2;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
  }).format(v);
}

function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
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

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

type Tone = "good" | "warn" | "bad" | "neutral" | "brand";

const chipCls: Record<Tone, string> = {
  good: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warn: "bg-amber-50 text-amber-700 ring-amber-200",
  bad: "bg-red-50 text-red-700 ring-red-200",
  neutral: "bg-gray-100 text-gray-600 ring-gray-200",
  brand: "bg-red-600 text-white ring-red-600",
};

const fillCls: Record<Tone, string> = {
  good: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-red-500",
  neutral: "bg-gray-300",
  brand: "bg-red-600",
};

const strokeCls: Record<Tone, string> = {
  good: "stroke-emerald-500",
  warn: "stroke-amber-500",
  bad: "stroke-red-500",
  neutral: "stroke-gray-400",
  brand: "stroke-red-600",
};

const valueCls: Record<Tone, string> = {
  good: "text-emerald-700",
  warn: "text-amber-700",
  bad: "text-red-600",
  neutral: "text-gray-900",
  brand: "text-red-600",
};

function achievementTone(p: number | null | undefined): Tone {
  if (!isNum(p)) return "neutral";
  if (p < 25) return "bad";
  if (p < 75) return "warn";
  return "good";
}

interface SeverityStyle {
  rank: number;
  rail: string;
  chip: string;
  label: string;
}

function severityStyle(sev: string | null | undefined): SeverityStyle {
  switch ((sev ?? "").toUpperCase()) {
    case "HIGH":
      return { rank: 0, rail: "bg-red-600", chip: "bg-red-50 text-red-700 ring-red-200", label: "High" };
    case "MEDIUM":
      return { rank: 1, rail: "bg-amber-500", chip: "bg-amber-50 text-amber-700 ring-amber-200", label: "Medium" };
    case "LOW":
      return { rank: 2, rail: "bg-slate-300", chip: "bg-slate-100 text-slate-600 ring-slate-200", label: "Low" };
    default:
      return { rank: 3, rail: "bg-gray-300", chip: "bg-gray-100 text-gray-600 ring-gray-200", label: humanize(sev) };
  }
}

function daysInfo(d: number | null | undefined): { text: string; tone: Tone } {
  if (!isNum(d)) return { text: "No end date", tone: "neutral" };
  if (d === 0) return { text: "Ends today", tone: "warn" };
  if (d > 0) return { text: `${d} ${plural(d, "day", "days")} left`, tone: d <= 7 ? "warn" : "neutral" };
  const ago = Math.abs(d);
  return { text: `Ended ${ago} ${plural(ago, "day", "days")} ago`, tone: "neutral" };
}

/* -------------------------------------------------------------------------- */
/*                               SMALL COMPONENTS                             */
/* -------------------------------------------------------------------------- */

function Chip({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${chipCls[tone]}`}
    >
      {children}
    </span>
  );
}

function Bar({ value, tone = "brand", height = "h-2" }: { value: number; tone?: Tone; height?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-gray-100 ${height}`}>
      <div
        className={`${height} rounded-full ${fillCls[tone]}`}
        style={{ width: `${clamp(value)}%` }}
        role="progressbar"
        aria-valuenow={Math.round(clamp(value))}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

function Ring({
  value,
  tone = "brand",
  size = "h-28 w-28",
  caption,
}: {
  value: number | null | undefined;
  tone?: Tone;
  size?: string;
  caption?: string;
}) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const pct = isNum(value) ? clamp(value) : 0;
  return (
    <div className={`relative shrink-0 ${size}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-gray-100" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          className={strokeCls[tone]}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold leading-none text-gray-900">{fmtPct(value)}</span>
        {caption ? <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">{caption}</span> : null}
      </div>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

function SectionTitle({
  index,
  title,
  subtitle,
  right,
}: {
  index: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-end gap-4">
        <span className="text-sm font-bold tabular-nums text-red-600">{index}</span>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p> : null}
        </div>
      </div>
      {right}
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gray-200 bg-white ${className}`}>{children}</div>;
}

function MiniTile({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold tracking-tight ${valueCls[tone]}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

function Delta({ percent }: { percent: number | null | undefined }) {
  if (!isNum(percent)) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
        <FiMinus className="h-3 w-3" />
        No previous baseline
      </span>
    );
  }
  if (percent === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-200">
        <FiMinus className="h-3 w-3" />
        No change
      </span>
    );
  }
  const up = percent > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        up ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-red-50 text-red-700 ring-red-200"
      }`}
    >
      {up ? <FiArrowUpRight className="h-3 w-3" /> : <FiArrowDownRight className="h-3 w-3" />}
      {up ? "+" : ""}
      {fmtPct(percent)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                           01 — EXECUTIVE SUMMARY                           */
/* -------------------------------------------------------------------------- */

function RibbonCell({
  label,
  value,
  sub,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: ReactNode;
  icon: ReactNode;
  tone?: Tone;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center gap-2 text-red-600">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      </div>
      <p className={`mt-3 text-3xl font-bold tracking-tight ${valueCls[tone]}`}>{value}</p>
      {sub ? <div className="mt-1.5 text-xs text-gray-500">{sub}</div> : null}
    </div>
  );
}

interface LedgerRow {
  label: string;
  value: ReactNode;
  tone?: Tone;
}

function LedgerCard({ title, icon, rows }: { title: string; icon: ReactNode; rows: LedgerRow[] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">{icon}</div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">{title}</h3>
      </div>
      <dl className="mt-4">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-3 border-b border-dashed border-gray-300 py-2.5 last:border-b-0"
          >
            <dt className="text-sm text-gray-600">{r.label}</dt>
            <dd className={`text-sm font-bold ${valueCls[r.tone ?? "neutral"]}`}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ExecutiveSummarySection({ s }: { s: ExecutiveSummary }) {
  return (
    <section className="space-y-5">
      <SectionTitle index="01" title="Executive Summary" subtitle="The six numbers that define the platform right now" />

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 xl:grid-cols-6">
        <RibbonCell
          label="Total Users"
          value={fmtInt(s.totalUsers)}
          icon={<FiUsers className="h-4 w-4" />}
          sub={`${fmtInt(s.newUsersLast90Days)} joined in 90 days`}
        />
        <RibbonCell
          label="Active Contributors"
          value={fmtInt(s.activeContributors)}
          icon={<FiActivity className="h-4 w-4" />}
          sub="Donated, registered or created a campaign"
        />
        <RibbonCell
          label="Donation Amount"
          value={fmtINR(s.successfulDonationAmount, true)}
          icon={<FiHeart className="h-4 w-4" />}
          tone="brand"
          sub={`${fmtInt(s.successfulDonationTransactions)} successful transactions`}
        />
        <RibbonCell
          label="Campaign Approvals"
          value={fmtInt(s.pendingCampaigns)}
          icon={<FiClock className="h-4 w-4" />}
          tone={n0(s.pendingCampaigns) > 0 ? "warn" : "neutral"}
          sub="Pending admin approval"
        />
        <RibbonCell
          label="Pending Payments"
          value={fmtInt(s.pendingPayments)}
          icon={<FiCreditCard className="h-4 w-4" />}
          tone={n0(s.pendingPayments) > 0 ? "warn" : "neutral"}
          sub={`${fmtInt(s.failedPayments)} failed`}
        />
        <RibbonCell
          label="Pending NGOs"
          value={fmtInt(s.pendingNgos)}
          icon={<FiShield className="h-4 w-4" />}
          tone={n0(s.pendingNgos) > 0 ? "bad" : "neutral"}
          sub={`of ${fmtInt(s.totalNgos)} total NGOs`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <LedgerCard
          title="People"
          icon={<FiUsers className="h-4 w-4" />}
          rows={[
            { label: "New users · last 30 days", value: fmtInt(s.newUsersLast30Days) },
            { label: "User growth", value: <Delta percent={s.userGrowthPercent} /> },
            { label: "Donor users", value: fmtInt(s.donorUsers) },
            { label: "Volunteer users", value: fmtInt(s.volunteerUsers) },
          ]}
        />
        <LedgerCard
          title="NGOs"
          icon={<FiShield className="h-4 w-4" />}
          rows={[
            { label: "Total NGOs", value: fmtInt(s.totalNgos) },
            { label: "Verified NGOs", value: fmtInt(s.verifiedNgos), tone: "good" },
            { label: "Pending NGOs", value: fmtInt(s.pendingNgos), tone: n0(s.pendingNgos) > 0 ? "warn" : "neutral" },
          ]}
        />
        <LedgerCard
          title="Campaigns"
          icon={<FiFlag className="h-4 w-4" />}
          rows={[
            { label: "Total campaigns", value: fmtInt(s.totalCampaigns) },
            { label: "Active campaigns", value: fmtInt(s.activeCampaigns), tone: "good" },
            { label: "Approved campaigns", value: fmtInt(s.approvedCampaigns) },
            {
              label: "Pending approvals",
              value: fmtInt(s.pendingCampaigns),
              tone: n0(s.pendingCampaigns) > 0 ? "warn" : "neutral",
            },
          ]}
        />
        <LedgerCard
          title="Payments & Events"
          icon={<FiCreditCard className="h-4 w-4" />}
          rows={[
            { label: "Successful transactions", value: fmtInt(s.successfulDonationTransactions) },
            { label: "Successful amount", value: fmtINR(s.successfulDonationAmount, true), tone: "brand" },
            { label: "Failed payments", value: fmtInt(s.failedPayments), tone: n0(s.failedPayments) > 0 ? "bad" : "neutral" },
            { label: "Pending payments", value: fmtInt(s.pendingPayments), tone: n0(s.pendingPayments) > 0 ? "warn" : "neutral" },
            { label: "Active events", value: fmtInt(s.activeEvents) },
            { label: "Volunteer attendance rate", value: fmtPct(s.attendanceRatePercent) },
          ]}
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                         02 — GROWTH AND TREND INTELLIGENCE                 */
/* -------------------------------------------------------------------------- */

function CompareRow({
  label,
  value,
  display,
  max,
  tone,
}: {
  label: string;
  value: number;
  display: string;
  max: number;
  tone: Tone;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold text-gray-900">{display}</span>
      </div>
      <Bar value={max > 0 ? (value / max) * 100 : 0} tone={tone} height="h-3" />
    </div>
  );
}

function TrendCard({
  title,
  icon,
  badge,
  children,
}: {
  title: string;
  icon: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">{icon}</div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
        {badge}
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </Panel>
  );
}

function TrendsSection({ t }: { t: Trends }) {
  const ua = t.userAcquisition ?? {};
  const dv = t.successfulDonationValue ?? {};
  const vr = t.volunteerRegistrations ?? {};

  const uaMax = Math.max(n0(ua.currentPeriodUsers), n0(ua.previousPeriodUsers));
  const dvMax = Math.max(n0(dv.currentPeriod), n0(dv.previousPeriod));
  const vrTotal = n0(vr.total);
  const vrShare = vrTotal > 0 ? (n0(vr.last30Days) / vrTotal) * 100 : null;

  const uaDays = isNum(ua.periodDays) ? ua.periodDays : null;
  const dvDays = isNum(dv.periodDays) ? dv.periodDays : null;
  const noBaseline = !isNum(dv.changePercent) && n0(dv.previousPeriod) === 0;

  return (
    <section className="space-y-5">
      <SectionTitle
        index="02"
        title="Growth & Trend Intelligence"
        subtitle="Current period compared with the period before it"
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <TrendCard title="User acquisition" icon={<FiUsers className="h-4 w-4" />} badge={<Delta percent={ua.changePercent} />}>
          <CompareRow
            label={uaDays ? `Last ${uaDays} days` : "Current period"}
            value={n0(ua.currentPeriodUsers)}
            display={`${fmtInt(ua.currentPeriodUsers)} users`}
            max={uaMax}
            tone="brand"
          />
          <CompareRow
            label={uaDays ? `Preceding ${uaDays} days` : "Previous period"}
            value={n0(ua.previousPeriodUsers)}
            display={`${fmtInt(ua.previousPeriodUsers)} users`}
            max={uaMax}
            tone="neutral"
          />
        </TrendCard>

        <TrendCard
          title="Successful donation value"
          icon={<FiHeart className="h-4 w-4" />}
          badge={<Delta percent={dv.changePercent} />}
        >
          <CompareRow
            label={dvDays ? `Last ${dvDays} days` : "Current period"}
            value={n0(dv.currentPeriod)}
            display={fmtINR(dv.currentPeriod, true)}
            max={dvMax}
            tone="brand"
          />
          <CompareRow
            label={dvDays ? `Preceding ${dvDays} days` : "Previous period"}
            value={n0(dv.previousPeriod)}
            display={fmtINR(dv.previousPeriod, true)}
            max={dvMax}
            tone="neutral"
          />
          {noBaseline ? (
            <p className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              No percentage comparison is available because the previous period has no recorded successful donations.
            </p>
          ) : null}
        </TrendCard>

        <TrendCard
          title="Volunteer registrations"
          icon={<FiUserCheck className="h-4 w-4" />}
          badge={vrShare !== null ? <Chip tone="neutral">{fmtPct(vrShare)} of total are recent</Chip> : undefined}
        >
          <CompareRow
            label="Last 30 days"
            value={n0(vr.last30Days)}
            display={`${fmtInt(vr.last30Days)} registrations`}
            max={vrTotal}
            tone="brand"
          />
          <CompareRow
            label="All time"
            value={vrTotal}
            display={`${fmtInt(vr.total)} registrations`}
            max={vrTotal}
            tone="neutral"
          />
        </TrendCard>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                          03 — OPERATIONAL BOTTLENECKS                      */
/* -------------------------------------------------------------------------- */

interface QueueDef {
  key: string;
  label: string;
  count: number | null | undefined;
  desc: string;
  icon: ReactNode;
  severity: "critical" | "attention";
}

function BottleneckSection({ q }: { q: OperationalQueues }) {
  const queues: QueueDef[] = [
    {
      key: "ngo",
      label: "Pending NGO verification",
      count: q.pendingNgoVerification,
      desc: "NGOs waiting for verification or a status review.",
      icon: <FiShield className="h-5 w-5" />,
      severity: "critical",
    },
    {
      key: "approvals",
      label: "Pending campaign approvals",
      count: q.pendingCampaignApprovals,
      desc: "Campaigns awaiting admin approval before they can go live.",
      icon: <FiFlag className="h-5 w-5" />,
      severity: "attention",
    },
    {
      key: "pay-pending",
      label: "Pending payments",
      count: q.pendingPayments,
      desc: "Payments stored as pending. They may need reconciliation.",
      icon: <FiClock className="h-5 w-5" />,
      severity: "attention",
    },
    {
      key: "pay-failed",
      label: "Failed payments",
      count: q.failedPayments,
      desc: "Payments recorded with a failed status.",
      icon: <FiXCircle className="h-5 w-5" />,
      severity: "critical",
    },
    {
      key: "unable",
      label: "Verified NGOs unable to receive donations",
      count: q.verifiedNgosUnableToReceiveDonations,
      desc: "Verified NGOs that cannot currently accept donations.",
      icon: <FiAlertTriangle className="h-5 w-5" />,
      severity: "critical",
    },
  ];

  const open = queues.reduce((a, x) => a + n0(x.count), 0);

  return (
    <section className="space-y-5">
      <SectionTitle index="03" title="Operational Bottlenecks" subtitle="Where work is waiting on the team" />
      <div className="rounded-3xl bg-gray-900 p-5 sm:p-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Queue overview</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {fmtInt(open)} open {plural(open, "item", "items")}
              <span className="ml-2 text-base font-medium text-gray-400">across {queues.length} queues</span>
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {queues.map((item) => {
            const c = n0(item.count);
            const status =
              c === 0
                ? { label: "Clear", cls: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30" }
                : item.severity === "critical"
                ? { label: "Critical", cls: "bg-red-500/20 text-red-300 ring-red-500/40" }
                : { label: "Attention", cls: "bg-amber-500/15 text-amber-300 ring-amber-500/30" };
            return (
              <div key={item.key} className="flex flex-col rounded-2xl border border-gray-700 bg-gray-800/60 p-5">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c === 0 ? "bg-gray-700 text-gray-300" : "bg-red-600 text-white"}`}>
                    {item.icon}
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${status.cls}`}>
                    {status.label}
                  </span>
                </div>
                <p className="mt-5 text-4xl font-bold tracking-tight text-white">{fmtInt(item.count)}</p>
                <p className="mt-1 text-sm font-semibold text-gray-100">{item.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                    04 / 05 — ALERTS AND RECOMMENDED ACTIONS                */
/* -------------------------------------------------------------------------- */

function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  const sorted = useMemo(
    () => [...alerts].sort((a, b) => severityStyle(a.severity).rank - severityStyle(b.severity).rank),
    [alerts]
  );
  return (
    <div>
      <SectionTitle index="04" title="Critical Alerts" subtitle="Signals raised by the platform" />
      <div className="mt-5 space-y-3">
        {sorted.length === 0 ? (
          <Panel className="flex items-center gap-3 p-5 text-sm text-gray-600">
            <FiCheckCircle className="h-5 w-5 text-emerald-600" />
            No alerts at the moment. Nothing needs escalation.
          </Panel>
        ) : (
          sorted.map((a, i) => {
            const sev = severityStyle(a.severity);
            return (
              <div
                key={`${a.category ?? "x"}-${a.title ?? "alert"}-${i}`}
                className="flex overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className={`w-1.5 shrink-0 ${sev.rail}`} />
                <div className="flex flex-1 items-start justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${sev.chip}`}>
                        {sev.label}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        {humanize(a.category)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-gray-900">{a.title ?? "Untitled alert"}</p>
                    {a.message ? <p className="mt-0.5 text-sm text-gray-500">{a.message}</p> : null}
                  </div>
                  {isNum(a.count) ? (
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-bold leading-none text-gray-900">{fmtInt(a.count)}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">affected</p>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ActionsPanel({ actions }: { actions: ActionItem[] }) {
  const sorted = useMemo(
    () => [...actions].sort((a, b) => severityStyle(a.priority).rank - severityStyle(b.priority).rank),
    [actions]
  );
  return (
    <div>
      <SectionTitle index="05" title="Recommended Actions" subtitle="What management should do next" />
      <Panel className="mt-5 overflow-hidden">
        <div className="flex items-center gap-2 bg-red-600 px-5 py-3 text-white">
          <FiTarget className="h-4 w-4" />
          <p className="text-xs font-bold uppercase tracking-widest">Action queue</p>
          <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">{sorted.length}</span>
        </div>
        {sorted.length === 0 ? (
          <p className="flex items-center gap-3 p-5 text-sm text-gray-600">
            <FiInbox className="h-5 w-5 text-gray-400" />
            No recommended actions right now.
          </p>
        ) : (
          <ol className="divide-y divide-gray-100">
            {sorted.map((a, i) => {
              const sev = severityStyle(a.priority);
              return (
                <li key={`${a.title ?? "action"}-${i}`} className="flex gap-4 p-4">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      sev.rank === 0 ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{a.title ?? "Untitled action"}</p>
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${sev.chip}`}>
                        {sev.label} priority
                      </span>
                    </div>
                    {a.reason ? <p className="mt-1 text-sm text-gray-500">{a.reason}</p> : null}
                    {isNum(a.count) ? (
                      <p className="mt-2 text-xs font-semibold text-gray-700">
                        {fmtInt(a.count)} {plural(a.count, "record", "records")} affected
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Panel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         06 — CAMPAIGN INTELLIGENCE                         */
/* -------------------------------------------------------------------------- */

type CampFilter = "all" | "low" | "none" | "soon" | "ended";
type CampSort = "achAsc" | "achDesc" | "endSoon" | "raised" | "goal";

function endRank(d: number | null | undefined): number {
  if (!isNum(d)) return 2;
  return d >= 0 ? 0 : 1;
}

function CampaignSection({ ca }: { ca: CampaignAchievement }) {
  const [filter, setFilter] = useState<CampFilter>("all");
  const [sort, setSort] = useState<CampSort>("achAsc");

  const list = useMemo<CampaignRow[]>(() => ca.campaigns ?? [], [ca.campaigns]);

  const counts = useMemo(
    () => ({
      all: list.length,
      low: list.filter((c) => isNum(c.achievementPercent) && c.achievementPercent < 25).length,
      none: list.filter((c) => n0(c.raisedAmount) === 0).length,
      soon: list.filter((c) => isNum(c.daysUntilEnd) && c.daysUntilEnd >= 0 && c.daysUntilEnd <= 7).length,
      ended: list.filter((c) => isNum(c.daysUntilEnd) && c.daysUntilEnd < 0).length,
    }),
    [list]
  );

  const rows = useMemo(() => {
    const filtered = list.filter((c) => {
      switch (filter) {
        case "low":
          return isNum(c.achievementPercent) && c.achievementPercent < 25;
        case "none":
          return n0(c.raisedAmount) === 0;
        case "soon":
          return isNum(c.daysUntilEnd) && c.daysUntilEnd >= 0 && c.daysUntilEnd <= 7;
        case "ended":
          return isNum(c.daysUntilEnd) && c.daysUntilEnd < 0;
        default:
          return true;
      }
    });
    const out = [...filtered];
    out.sort((a, b) => {
      switch (sort) {
        case "achDesc":
          return n0(b.achievementPercent) - n0(a.achievementPercent);
        case "raised":
          return n0(b.raisedAmount) - n0(a.raisedAmount);
        case "goal":
          return n0(b.goalAmount) - n0(a.goalAmount);
        case "endSoon": {
          const ra = endRank(a.daysUntilEnd);
          const rb = endRank(b.daysUntilEnd);
          if (ra !== rb) return ra - rb;
          if (ra === 0) return n0(a.daysUntilEnd) - n0(b.daysUntilEnd);
          return n0(b.daysUntilEnd) - n0(a.daysUntilEnd);
        }
        default:
          return n0(a.achievementPercent) - n0(b.achievementPercent);
      }
    });
    return out;
  }, [list, filter, sort]);

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
    }`;

  const filters: { key: CampFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "low", label: "Below 25%" },
    { key: "none", label: "No funds raised" },
    { key: "soon", label: "Ending in 7 days" },
    { key: "ended", label: "Past end date" },
  ];

  return (
    <section className="space-y-5">
      <SectionTitle
        index="06"
        title="Campaign Intelligence"
        subtitle="Goal achievement across active campaigns"
      />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MiniTile label="Active campaigns" value={fmtInt(ca.activeCampaigns)} tone="brand" />
        <MiniTile
          label="Below 25% of goal"
          value={fmtInt(ca.under25PercentOfGoal)}
          tone={n0(ca.under25PercentOfGoal) > 0 ? "warn" : "neutral"}
          hint="Heuristic indicator"
        />
        <MiniTile
          label="No successful donations"
          value={fmtInt(ca.withNoSuccessfulDonations)}
          tone={n0(ca.withNoSuccessfulDonations) > 0 ? "warn" : "neutral"}
        />
        <MiniTile label="Ending within 7 days" value={fmtInt(ca.endingWithin7Days)} />
      </div>

      <Panel className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button key={f.key} type="button" onClick={() => setFilter(f.key)} className={chip(filter === f.key)}>
                {f.label} <span className="ml-1 opacity-70">{counts[f.key]}</span>
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as CampSort)}
            aria-label="Sort campaigns"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="achAsc">Sort: Lowest achievement</option>
            <option value="achDesc">Sort: Highest achievement</option>
            <option value="endSoon">Sort: Ending soonest</option>
            <option value="raised">Sort: Amount raised</option>
            <option value="goal">Sort: Goal amount</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[940px] text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Campaign</th>
                <th className="px-4 py-3 text-right font-semibold">Goal</th>
                <th className="px-4 py-3 text-right font-semibold">Raised</th>
                <th className="min-w-[200px] px-4 py-3 font-semibold">Achievement</th>
                <th className="px-4 py-3 font-semibold">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No campaigns match this filter.
                  </td>
                </tr>
              ) : (
                rows.map((c) => {
                  const tone = achievementTone(c.achievementPercent);
                  const d = daysInfo(c.daysUntilEnd);
                  return (
                    <tr key={c.id} className="border-t border-gray-100 transition-colors hover:bg-red-50/30">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">#{c.id}</td>
                      <td className="max-w-[320px] px-4 py-3 font-semibold text-gray-900">
                        <span className="block truncate" title={c.title ?? ""}>
                          {c.title?.trim() || "Untitled campaign"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                        {isNum(c.goalAmount) && c.goalAmount > 0 ? fmtINR(c.goalAmount) : "No goal"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900">
                        {fmtINR(c.raisedAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Bar value={isNum(c.achievementPercent) ? c.achievementPercent : 0} tone={tone} height="h-2.5" />
                          </div>
                          <span className={`w-16 text-right text-xs font-bold ${valueCls[tone]}`}>
                            {fmtPct(c.achievementPercent)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Chip tone={d.tone}>{d.text}</Chip>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Showing {fmtInt(rows.length)} of {fmtInt(list.length)} listed campaigns
          {isNum(ca.activeCampaigns) ? ` · ${fmtInt(ca.activeCampaigns)} active in total` : ""}. Past-end-date campaigns are
          shown for context only and are not treated as failed.
        </p>
      </Panel>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                             07 — NGO READINESS                             */
/* -------------------------------------------------------------------------- */

function NgoSection({ ngo }: { ngo: NgoReadiness }) {
  const total = n0(ngo.total);
  const verified = n0(ngo.verified);
  const pending = n0(ngo.pendingReview);
  const other = Math.max(0, total - verified - pending);
  const pct = (v: number) => (total > 0 ? (v / total) * 100 : 0);
  const rate = total > 0 ? pct(verified) : null;

  return (
    <section className="space-y-5">
      <SectionTitle index="07" title="NGO Readiness" subtitle="Verification and donation readiness across partner NGOs" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel className="flex flex-col items-center gap-5 p-6 sm:flex-row xl:col-span-1 xl:flex-col xl:items-center">
          <Ring value={rate} tone="brand" size="h-36 w-36" caption="verified" />
          <div className="w-full">
            <p className="text-sm font-bold text-gray-900">Verification breakdown</p>
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="bg-emerald-500" style={{ width: `${pct(verified)}%` }} />
              <div className="bg-amber-500" style={{ width: `${pct(pending)}%` }} />
              <div className="bg-gray-400" style={{ width: `${pct(other)}%` }} />
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Verified
                </span>
                <span className="font-bold text-gray-900">{fmtInt(ngo.verified)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending review
                </span>
                <span className="font-bold text-gray-900">{fmtInt(ngo.pendingReview)}</span>
              </li>
              {other > 0 ? (
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    Other statuses
                  </span>
                  <span className="font-bold text-gray-900">{fmtInt(other)}</span>
                </li>
              ) : null}
            </ul>
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-4 xl:col-span-2">
          <MiniTile label="Total NGOs" value={fmtInt(ngo.total)} />
          <MiniTile label="Verified NGOs" value={fmtInt(ngo.verified)} tone="good" />
          <MiniTile
            label="Pending review"
            value={fmtInt(ngo.pendingReview)}
            tone={n0(ngo.pendingReview) > 0 ? "warn" : "neutral"}
          />
          <MiniTile
            label="Verified, unable to receive donations"
            value={fmtInt(ngo.unableToReceiveDonations)}
            tone={n0(ngo.unableToReceiveDonations) > 0 ? "bad" : "good"}
            hint={n0(ngo.unableToReceiveDonations) === 0 ? "All verified NGOs can receive donations" : undefined}
          />
          <div className="col-span-2 rounded-xl border border-gray-200 bg-gray-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">NGOs with no campaigns</p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900">{fmtInt(ngo.withNoCampaigns)}</p>
              </div>
              <Chip tone="neutral">Operational observation</Chip>
            </div>
            <div className="mt-3">
              <Bar value={pct(n0(ngo.withNoCampaigns))} tone="neutral" />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {fmtPct(pct(n0(ngo.withNoCampaigns)))} of NGOs have not created a campaign. This is an observation and not
              evidence of poor performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                      08 — VOLUNTEER AND EVENT ENGAGEMENT                   */
/* -------------------------------------------------------------------------- */

function VolunteerSection({ v }: { v: VolunteerEngagement }) {
  const rate = v.attendanceRatePercent;
  const zero = isNum(rate) && rate === 0;
  const total = n0(v.totalRegistrations);
  const recentShare = total > 0 ? (n0(v.registrationsLast30Days) / total) * 100 : 0;

  return (
    <section className="space-y-5">
      <SectionTitle index="08" title="Volunteer & Event Engagement" subtitle="Event activity and volunteer participation" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel className="flex flex-col items-center gap-4 p-6 text-center">
          <Ring value={rate} tone={zero ? "neutral" : "good"} size="h-36 w-36" caption="attendance" />
          <div>
            <p className="text-sm font-bold text-gray-900">Attendance rate</p>
            <p className="mt-1 text-xs text-gray-500">
              {zero
                ? "No attendance recorded"
                : `${fmtInt(v.attendedRegistrations)} of ${fmtInt(v.totalRegistrations)} registrations attended`}
            </p>
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-4 xl:col-span-2">
          <MiniTile label="Active events" value={fmtInt(v.activeEvents)} tone="brand" />
          <MiniTile
            label="Events with no registrations"
            value={fmtInt(v.eventsWithNoRegistrations)}
            tone={n0(v.eventsWithNoRegistrations) > 0 ? "warn" : "neutral"}
          />
          <MiniTile label="Registrations · last 30 days" value={fmtInt(v.registrationsLast30Days)} />
          <MiniTile label="Total registrations" value={fmtInt(v.totalRegistrations)} />
          <MiniTile
            label="Attended registrations"
            value={fmtInt(v.attendedRegistrations)}
            hint={zero ? "No attendance recorded" : undefined}
          />
          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Recent share of registrations</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900">{fmtPct(recentShare)}</p>
            <div className="mt-2">
              <Bar value={recentShare} tone="brand" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                         09 — DEFINITIONS AND LIMITATIONS                   */
/* -------------------------------------------------------------------------- */

function LimitationsSection({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <Panel>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 p-5 text-left"
        >
          <span className="flex items-center gap-3">
            <span className="text-sm font-bold tabular-nums text-red-600">09</span>
            <span>
              <span className="block text-base font-bold text-gray-900">Metric Definitions & Limitations</span>
              <span className="block text-sm text-gray-500">How to interpret the numbers on this page</span>
            </span>
          </span>
          <FiChevronDown className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? (
          <div className="border-t border-gray-100 p-5">
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">No additional notes were provided.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </Panel>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              LOADING AND ERROR                             */
/* -------------------------------------------------------------------------- */

function LoadingState() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading platform intelligence">
      <div className="space-y-5">
        <Skeleton className="h-7 w-64" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-3xl" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}

function ErrorState({ onRetry, busy }: { onRetry: () => void; busy: boolean }) {
  return (
    <Panel className="mx-auto max-w-lg p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <FiAlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-gray-900">Unable to load platform intelligence</h2>
      <p className="mt-1 text-sm text-gray-500">Something went wrong while fetching the data. Please try again.</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={busy}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
      >
        <FiRefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
        Retry
      </button>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function PlatformIntelligencePage() {
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const inFlight = useRef<boolean>(false);

  const load = useCallback(async (isRefresh: boolean) => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      const res: unknown = await getPlatformIntelligence();
      const parsed = extractData(res);
      if (!parsed) throw new Error("Unexpected Platform Intelligence response shape");
      setData(parsed);
    } catch (err) {
      console.error("Platform Intelligence fetch failed:", err);
      setError(true);
    } finally {
      inFlight.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const busy = loading || refreshing;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 border-t-4 border-t-red-600 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-7 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">YOYO Foundation · Super Admin</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Platform Intelligence</h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Executive overview of platform growth, fundraising performance, operational bottlenecks, and management
              priorities.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Last refreshed</p>
              <p className="text-sm font-semibold text-gray-800">
                {refreshing ? "Updating…" : fmtDateTime(data?.generatedAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={busy}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingState />
        ) : error && !data ? (
          <ErrorState onRetry={() => void load(false)} busy={busy} />
        ) : data ? (
          <>
            {error ? (
              <div className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
                <span>Unable to refresh. Showing the last loaded data.</span>
                <button
                  type="button"
                  onClick={() => void load(true)}
                  disabled={busy}
                  className="self-start font-semibold underline underline-offset-2 disabled:opacity-60"
                >
                  Retry
                </button>
              </div>
            ) : null}

            <ExecutiveSummarySection s={data.executiveSummary ?? {}} />

            <TrendsSection t={data.trends ?? {}} />

            <BottleneckSection q={data.operationalQueues ?? {}} />

            <div className="grid grid-cols-1 gap-10 xl:grid-cols-2">
              <AlertsPanel alerts={data.alerts ?? []} />
              <ActionsPanel actions={data.recommendedActions ?? []} />
            </div>

            <CampaignSection ca={data.performance?.campaignAchievement ?? {}} />

            <NgoSection ngo={data.performance?.ngoReadiness ?? {}} />

            <VolunteerSection v={data.performance?.volunteerEngagement ?? {}} />

            <LimitationsSection items={data.limitations ?? []} />
          </>
        ) : null}
      </main>
    </div>
  );
}