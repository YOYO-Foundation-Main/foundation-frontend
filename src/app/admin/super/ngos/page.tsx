"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Building2,
    CalendarDays,
    CheckCircle2,
    Gauge,
    Heart,
    IndianRupee,
    Inbox,
    Lightbulb,
    MapPin,
    Megaphone,
    RefreshCw,
    Search,
    ShieldCheck,
    Target,
    TrendingUp,
    Trophy,
    Users,
    X,
    XCircle,
} from "lucide-react";

import { getNgoInsights } from "@/features/super-admin/api/finance.api";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface Summary {
    verifiedNgos?: number | null;
    activeFundraisingNgos?: number | null;
    highPerformers?: number | null;
    growthPotential?: number | null;
    needsAttention?: number | null;
    totalGoal?: number | null;
    totalRaised?: number | null;
    remainingFundingGap?: number | null;
    overallGoalAchievement?: number | null;
    averageRaisedPerNgo?: number | null;
    averageGoalAchievement?: number | null;
    averageManagementScore?: number | null;
    successfulDonations?: number | null;
    recent30DayRaised?: number | null;
    recent30DayDonations?: number | null;
    totalEvents?: number | null;
    totalEventRegistrations?: number | null;
    totalSuccessStories?: number | null;
}

interface RankRaised {
    rank: number;
    id: number;
    ngoName: string;
    raised?: number | null;
    goal?: number | null;
    progress?: number | null;
    campaigns?: number | null;
    donations?: number | null;
    managementScore?: number | null;
}

interface RankCampaigns {
    rank: number;
    id: number;
    ngoName: string;
    campaigns?: number | null;
    raised?: number | null;
    managementScore?: number | null;
}

interface RankDonors {
    rank: number;
    id: number;
    ngoName: string;
    uniqueDonors?: number | null;
    donations?: number | null;
    repeatDonationRate?: number | null;
    raised?: number | null;
}

interface RankScore {
    rank: number;
    id: number;
    ngoName: string;
    managementScore?: number | null;
    classification?: string | null;
    raised?: number | null;
    goalAchievement?: number | null;
    campaigns?: number | null;
    donors?: number | null;
}

interface Rankings {
    topByRaised?: RankRaised[] | null;
    topByCampaigns?: RankCampaigns[] | null;
    topByDonors?: RankDonors[] | null;
    topByManagementScore?: RankScore[] | null;
}

interface GeoRow {
    state: string;
    ngos?: number | null;
    raised?: number | null;
    goal?: number | null;
    donations?: number | null;
    goalAchievement?: number | null;
}

interface DecisionInsight {
    type: string;
    priority?: string | null;
    message: string;
    count?: number | null;
}

interface Category {
    id: number;
    name: string;
}

interface CampaignMetrics {
    total?: number | null;
    approved?: number | null;
    active?: number | null;
    inactive?: number | null;
    completed?: number | null;
    withFunding?: number | null;
    withoutFunding?: number | null;
    fullyFunded?: number | null;
    successRate?: number | null;
}

interface FinancialMetrics {
    totalGoal?: number | null;
    totalRaised?: number | null;
    remainingGoal?: number | null;
    goalAchievement?: number | null;
    successfulDonationAmount?: number | null;
    successfulDonationCount?: number | null;
    averageDonation?: number | null;
    largestDonation?: number | null;
    actualDonationCoverage?: number | null;
}

interface DonorMetrics {
    uniqueDonors?: number | null;
    successfulDonations?: number | null;
    averageDonation?: number | null;
    repeatDonationRate?: number | null;
    recent30DayDonors?: number | null;
    recent30DayDonationCount?: number | null;
    recent30DayRaised?: number | null;
}

interface Momentum {
    lastDonationAt?: string | null;
    daysSinceLastDonation?: number | null;
    last30DaysRaised?: number | null;
    last30DaysDonations?: number | null;
    fundraisingActive?: boolean | null;
}

interface EventMetrics {
    total?: number | null;
    approved?: number | null;
    active?: number | null;
    registrations?: number | null;
    averageRegistrationsPerEvent?: number | null;
    successStories?: number | null;
}

interface ImpactMetrics {
    campaignSuccessStories?: number | null;
    eventSuccessStories?: number | null;
    totalSuccessStories?: number | null;
}

interface ReadinessChecks {
    verified?: boolean | null;
    canReceiveDonations?: boolean | null;
    hasActiveCampaign?: boolean | null;
    hasApprovedCampaign?: boolean | null;
    hasWebsite?: boolean | null;
    hasCategories?: boolean | null;
    hasSuccessStories?: boolean | null;
}

interface OperationalReadiness {
    score?: number | null;
    checks?: ReadinessChecks | null;
}

interface NgoCampaign {
    id: number;
    title: string;
    status?: string | null;
    isActive?: boolean | null;
    goalAmount?: number | null;
    raisedAmount?: number | null;
    progress?: number | null;
    remainingAmount?: number | null;
    successfulDonations?: number | null;
    donationAmount?: number | null;
    averageDonation?: number | null;
    largestDonation?: number | null;
    daysSinceLastDonation?: number | null;
    isStalled?: boolean | null;
    dataMismatch?: boolean | null;
    dataMismatchAmount?: number | null;
    hasSuccessStory?: boolean | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

interface Ngo {
    id: number;
    ngoName: string;
    email?: string | null;
    mobile?: string | null;
    website?: string | null;
    district?: string | null;
    state?: string | null;
    pincode?: string | null;
    registrationType?: string | null;
    status?: string | null;
    isVerified?: boolean | null;
    verifiedAt?: string | null;
    canReceiveDonations?: boolean | null;
    categories?: Category[] | null;
    managementScore?: number | null;
    classification?: string | null;
    campaignMetrics?: CampaignMetrics | null;
    financialMetrics?: FinancialMetrics | null;
    donorMetrics?: DonorMetrics | null;
    momentum?: Momentum | null;
    eventMetrics?: EventMetrics | null;
    impactMetrics?: ImpactMetrics | null;
    operationalReadiness?: OperationalReadiness | null;
    campaigns?: NgoCampaign[] | null;
    riskFlags?: string[] | null;
    opportunities?: string[] | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

interface InsightsData {
    summary?: Summary | null;
    rankings?: Rankings | null;
    geography?: GeoRow[] | null;
    decisionInsights?: DecisionInsight[] | null;
    ngos?: Ngo[] | null;
}

interface InsightsResponse {
    success: boolean;
    data?: InsightsData | null;
    message?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function num(v: number | null | undefined): number {
    return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function clamp(v: number, min = 0, max = 100): number {
    return Math.min(max, Math.max(min, v));
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

function formatINR(v: number | null | undefined): string {
    return inrFormatter.format(Math.round(num(v)));
}

function formatCompact(v: number | null | undefined): string {
    const n = num(v);
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    return String(Math.round(n));
}

function formatCompactINR(v: number | null | undefined): string {
    return `₹${formatCompact(v)}`;
}

function formatInt(v: number | null | undefined): string {
    return new Intl.NumberFormat("en-IN").format(Math.round(num(v)));
}

function formatPct(v: number | null | undefined): string {
    return `${Math.round(num(v))}%`;
}

function formatScore(v: number | null | undefined): string {
    return `${Math.round(num(v))}/100`;
}

function formatDate(iso: string | null | undefined): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(d: Date): string {
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function humanize(s: string | null | undefined): string {
    if (!s) return "—";
    return s
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

type Tone = "good" | "warn" | "bad" | "neutral" | "brand";

function scoreTone(score: number | null | undefined): Tone {
    const s = num(score);
    if (s >= 60) return "good";
    if (s >= 30) return "warn";
    return "bad";
}

function classificationTone(c: string | null | undefined): Tone {
    switch (c) {
        case "HIGH_PERFORMER":
        case "STABLE":
            return "good";
        case "GROWTH_POTENTIAL":
            return "warn";
        case "NEEDS_ATTENTION":
            return "bad";
        default:
            return "neutral";
    }
}

const badgeClasses: Record<Tone, string> = {
    good: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warn: "bg-amber-50 text-amber-700 ring-amber-200",
    bad: "bg-red-50 text-red-700 ring-red-200",
    neutral: "bg-gray-100 text-gray-700 ring-gray-200",
    brand: "bg-red-600 text-white ring-red-600",
};

const barClasses: Record<Tone, string> = {
    good: "bg-emerald-500",
    warn: "bg-amber-500",
    bad: "bg-red-500",
    neutral: "bg-gray-400",
    brand: "bg-red-600",
};

const textToneClasses: Record<Tone, string> = {
    good: "text-emerald-700",
    warn: "text-amber-700",
    bad: "text-red-700",
    neutral: "text-gray-900",
    brand: "text-red-600",
};

/* -------------------------------------------------------------------------- */
/*                              SMALL UI COMPONENTS                           */
/* -------------------------------------------------------------------------- */

function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
    return (
        <span
            className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeClasses[tone]}`}
        >
            {children}
        </span>
    );
}

function ProgressBar({
    value,
    tone = "brand",
    height = "h-2",
}: {
    value: number;
    tone?: Tone;
    height?: string;
}) {
    const w = clamp(value);
    return (
        <div className={`w-full overflow-hidden rounded-full bg-gray-100 ${height}`}>
            <div
                className={`${height} rounded-full ${barClasses[tone]}`}
                style={{ width: `${w}%` }}
                role="progressbar"
                aria-valuenow={Math.round(w)}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    );
}

function Card({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
            {children}
        </div>
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

function MetricBlock({
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
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
            <p className={`mt-1 text-xl font-semibold ${textToneClasses[tone]}`}>{value}</p>
            {hint ? <p className="mt-0.5 text-xs text-gray-500">{hint}</p> : null}
        </div>
    );
}

function LabeledBar({
    label,
    valueLabel,
    value,
    tone = "brand",
}: {
    label: string;
    valueLabel: string;
    value: number;
    tone?: Tone;
}) {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-900">{valueLabel}</span>
            </div>
            <ProgressBar value={value} tone={tone} />
        </div>
    );
}

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />;
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6" aria-busy="true" aria-label="Loading NGO insights">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-28" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <Skeleton className="h-96 xl:col-span-2" />
                <Skeleton className="h-96" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Skeleton className="h-72" />
                <Skeleton className="h-72" />
            </div>
            <Skeleton className="h-96" />
        </div>
    );
}

function ReadinessCheck({ ok, label }: { ok: boolean | null | undefined; label: string }) {
    return (
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
            {ok ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
                <XCircle className="h-4 w-4 text-red-400" />
            )}
            <span>{label}</span>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                              KPI CARDS SECTION                             */
/* -------------------------------------------------------------------------- */

function HeroKpi({
    label,
    value,
    sub,
    icon,
}: {
    label: string;
    value: string;
    sub: ReactNode;
    icon: ReactNode;
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-white via-white to-red-50 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md">
            {/* Top accent bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-red-300" />

            {/* Soft decorative glow */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-red-100/70 blur-2xl" />

            <div className="relative flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {label}
                </p>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-inset ring-red-100 transition-colors  group-hover:text-red group-hover:ring-red-600">
                    {icon}
                </div>
            </div>

            <p className="relative mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {value}
            </p>

            <div className="relative mt-2 inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-100">
                {sub}
            </div>
        </div>
    );
}

function Kpi({
    label,
    value,
    sub,
    icon,
}: {
    label: string;
    value: string;
    sub?: string;
    icon: ReactNode;
}) {
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

function ExecutiveSummary({ summary }: { summary: Summary }) {
    return (
        <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <HeroKpi
                    label="Total Raised"
                    value={formatINR(summary.totalRaised)}
                    icon={<IndianRupee className="h-5 w-5" />}
                    sub={
                        <>
                            {formatPct(summary.overallGoalAchievement)} of {formatCompactINR(summary.totalGoal)} goal
                        </>
                    }
                />
                <HeroKpi
                    label="Verified NGOs"
                    value={formatInt(summary.verifiedNgos)}
                    icon={<Building2 className="h-5 w-5" />}
                    sub={<>{formatInt(summary.activeFundraisingNgos)} actively fundraising</>}
                />
                <HeroKpi
                    label="Avg. Management Score"
                    value={formatScore(summary.averageManagementScore)}
                    icon={<Gauge className="h-5 w-5" />}
                    sub={<>{formatInt(summary.needsAttention)} NGOs need attention</>}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Kpi
                    label="Avg. Raised / NGO"
                    value={formatINR(summary.averageRaisedPerNgo)}
                    icon={<TrendingUp className="h-4 w-4" />}
                />
                <Kpi
                    label="Successful Donations"
                    value={formatInt(summary.successfulDonations)}
                    sub={`${formatInt(summary.recent30DayDonations)} in last 30 days`}
                    icon={<Heart className="h-4 w-4" />}
                />
                <Kpi
                    label="Funding Gap"
                    value={formatCompactINR(summary.remainingFundingGap)}
                    sub={`Goal ${formatCompactINR(summary.totalGoal)}`}
                    icon={<Target className="h-4 w-4" />}
                />
                <Kpi
                    label="Total Events"
                    value={formatInt(summary.totalEvents)}
                    sub={`${formatInt(summary.totalEventRegistrations)} registrations`}
                    icon={<CalendarDays className="h-4 w-4" />}
                />
                <Kpi
                    label="Success Stories"
                    value={formatInt(summary.totalSuccessStories)}
                    icon={<Trophy className="h-4 w-4" />}
                />
                <Kpi
                    label="Avg. Goal Achievement"
                    value={formatPct(summary.averageGoalAchievement)}
                    icon={<Activity className="h-4 w-4" />}
                />
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*                         DECISION INSIGHTS (TOP BANNER)                     */
/* -------------------------------------------------------------------------- */

function DecisionInsights({ items }: { items: DecisionInsight[] }) {
    if (items.length === 0) return null;
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {items.map((item, i) => {
                const tone: Tone =
                    item.priority === "HIGH" ? "bad" : item.priority === "MEDIUM" ? "warn" : "neutral";
                return (
                    <Card key={`${item.type}-${i}`} className="flex items-start gap-3 p-4">
                        <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone === "bad"
                                ? "bg-red-50 text-red-600"
                                : tone === "warn"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">{humanize(item.type)}</span>
                                {item.priority ? <Badge tone={tone}>{humanize(item.priority)} priority</Badge> : null}
                                {typeof item.count === "number" ? (
                                    <Badge tone="neutral">{item.count} NGOs</Badge>
                                ) : null}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                               RANKINGS SECTION                             */
/* -------------------------------------------------------------------------- */

type RankTab = "raised" | "campaigns" | "donors" | "score";

interface RankRowData {
    rank: number;
    id: number;
    name: string;
    primaryLabel: string;
    primaryValue: string;
    stats: { label: string; value: string }[];
    badge?: ReactNode;
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
        <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${cls}`}
        >
            #{rank}
        </div>
    );
}

function RankRow({ row, onOpen }: { row: RankRowData; onOpen: (id: number) => void }) {
    const prominent = row.rank <= 3;
    return (
        <button
            type="button"
            onClick={() => onOpen(row.id)}
            className={`flex w-full flex-col gap-3 rounded-lg border p-3 text-left transition-colors hover:border-red-300 hover:bg-red-50/40 sm:flex-row sm:items-center sm:gap-4 ${row.rank === 1
                ? "border-red-200 bg-red-50/50"
                : prominent
                    ? "border-gray-200 bg-white"
                    : "border-gray-100 bg-white"
                }`}
        >
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <RankBadge rank={row.rank} />
                <div className="min-w-0">
                    <p
                        className={`truncate font-semibold text-gray-900 ${prominent ? "text-base" : "text-sm"}`}
                    >
                        {row.name.trim() || "Unnamed NGO"}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        {row.badge}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="hidden gap-4 md:flex">
                    {row.stats.map((s) => (
                        <div key={s.label} className="text-right">
                            <p className="text-[11px] uppercase tracking-wide text-gray-400">{s.label}</p>
                            <p className="text-sm font-medium text-gray-800">{s.value}</p>
                        </div>
                    ))}
                </div>
                <div className="min-w-[96px] text-right">
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">{row.primaryLabel}</p>
                    <p className={`font-semibold text-gray-900 ${prominent ? "text-lg" : "text-base"}`}>
                        {row.primaryValue}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 md:hidden">
                {row.stats.map((s) => (
                    <div key={s.label}>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400">{s.label}</p>
                        <p className="text-sm font-medium text-gray-800">{s.value}</p>
                    </div>
                ))}
            </div>
        </button>
    );
}

function Rankings({
    rankings,
    onOpen,
}: {
    rankings: Rankings;
    onOpen: (id: number) => void;
}) {
    const [tab, setTab] = useState<RankTab>("raised");

    const rows: RankRowData[] = useMemo(() => {
        switch (tab) {
            case "raised":
                return (rankings.topByRaised ?? []).map((r) => ({
                    rank: r.rank,
                    id: r.id,
                    name: r.ngoName,
                    primaryLabel: "Raised",
                    primaryValue: formatINR(r.raised),
                    stats: [
                        { label: "Campaigns", value: formatInt(r.campaigns) },
                        { label: "Donations", value: formatInt(r.donations) },
                        { label: "Score", value: formatScore(r.managementScore) },
                    ],
                    badge:
                        num(r.goal) > 0 ? (
                            <span className="text-xs text-gray-500">
                                {formatPct(r.progress)} of {formatCompactINR(r.goal)} goal
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">No funding goal set</span>
                        ),
                }));
            case "campaigns":
                return (rankings.topByCampaigns ?? []).map((r) => ({
                    rank: r.rank,
                    id: r.id,
                    name: r.ngoName,
                    primaryLabel: "Campaigns",
                    primaryValue: formatInt(r.campaigns),
                    stats: [
                        { label: "Raised", value: formatCompactINR(r.raised) },
                        { label: "Score", value: formatScore(r.managementScore) },
                    ],
                }));
            case "donors":
                return (rankings.topByDonors ?? []).map((r) => ({
                    rank: r.rank,
                    id: r.id,
                    name: r.ngoName,
                    primaryLabel: "Donors",
                    primaryValue: formatInt(r.uniqueDonors),
                    stats: [
                        { label: "Donations", value: formatInt(r.donations) },
                        { label: "Repeat", value: formatPct(r.repeatDonationRate) },
                        { label: "Raised", value: formatCompactINR(r.raised) },
                    ],
                }));
            case "score":
                return (rankings.topByManagementScore ?? []).map((r) => ({
                    rank: r.rank,
                    id: r.id,
                    name: r.ngoName,
                    primaryLabel: "Score",
                    primaryValue: formatScore(r.managementScore),
                    stats: [
                        { label: "Goal ach.", value: formatPct(r.goalAchievement) },
                        { label: "Campaigns", value: formatInt(r.campaigns) },
                        { label: "Donors", value: formatInt(r.donors) },
                    ],
                    badge: (
                        <Badge tone={classificationTone(r.classification)}>{humanize(r.classification)}</Badge>
                    ),
                }));
            default:
                return [];
        }
    }, [rankings, tab]);

    const tabs: { key: RankTab; label: string }[] = [
        { key: "raised", label: "Top by Raised" },
        { key: "campaigns", label: "Top by Campaigns" },
        { key: "donors", label: "Top by Donors" },
        { key: "score", label: "Top by Score" },
    ];

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<BarChart3 className="h-5 w-5" />}
                title="NGO Performance Rankings"
                subtitle="Click any NGO to open its full intelligence profile."
            />
            <div className="mt-4 flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setTab(t.key)}
                        className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${tab === t.key
                            ? "bg-white text-red-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="mt-4 space-y-2">
                {rows.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">No ranking data available.</p>
                ) : (
                    rows.map((r) => <RankRow key={`${tab}-${r.id}`} row={r} onOpen={onOpen} />)
                )}
            </div>
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                            FINANCIAL INTELLIGENCE                          */
/* -------------------------------------------------------------------------- */

function FinancialSection({
    summary,
    campaignCount,
    topRaised,
}: {
    summary: Summary;
    campaignCount: number;
    topRaised: RankRaised[];
}) {
    const avgPerCampaign = campaignCount > 0 ? num(summary.totalRaised) / campaignCount : 0;
    const maxRaised = Math.max(1, ...topRaised.map((r) => num(r.raised)));
    const funded = topRaised.filter((r) => num(r.raised) > 0).slice(0, 5);

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<IndianRupee className="h-5 w-5" />}
                title="Financial Intelligence"
                subtitle="Funding performance against goals."
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricBlock label="Total raised" value={formatINR(summary.totalRaised)} />
                <MetricBlock label="Total goal" value={formatINR(summary.totalGoal)} />
                <MetricBlock label="Avg. per NGO" value={formatINR(summary.averageRaisedPerNgo)} />
                <MetricBlock
                    label="Avg. per campaign"
                    value={formatINR(avgPerCampaign)}
                    hint={`${formatInt(campaignCount)} campaigns`}
                />
                <MetricBlock
                    label="Last 30 days"
                    value={formatINR(summary.recent30DayRaised)}
                    hint={`${formatInt(summary.recent30DayDonations)} donations`}
                    tone="brand"
                />
                <MetricBlock
                    label="Funding gap"
                    value={formatINR(summary.remainingFundingGap)}
                    tone="warn"
                />
            </div>
            <div className="mt-5 space-y-4">
                <LabeledBar
                    label="Overall goal achievement"
                    valueLabel={formatPct(summary.overallGoalAchievement)}
                    value={num(summary.overallGoalAchievement)}
                    tone={scoreTone(summary.overallGoalAchievement)}
                />
                <LabeledBar
                    label="Average goal achievement (per NGO)"
                    valueLabel={formatPct(summary.averageGoalAchievement)}
                    value={num(summary.averageGoalAchievement)}
                    tone={scoreTone(summary.averageGoalAchievement)}
                />
            </div>
            {funded.length > 0 ? (
                <div className="mt-5">
                    <p className="mb-3 text-sm font-semibold text-gray-900">Top performing NGOs by raised</p>
                    <div className="space-y-3">
                        {funded.map((r) => (
                            <div key={r.id}>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="truncate pr-2 text-gray-700">{r.ngoName.trim()}</span>
                                    <span className="font-medium text-gray-900">{formatCompactINR(r.raised)}</span>
                                </div>
                                <ProgressBar value={(num(r.raised) / maxRaised) * 100} tone="brand" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                              DONOR INTELLIGENCE                            */
/* -------------------------------------------------------------------------- */

function DonorSection({
    summary,
    topDonors,
    ngos,
}: {
    summary: Summary;
    topDonors: RankDonors[];
    ngos: Ngo[];
}) {
    const totalDonorRelations = ngos.reduce((a, n) => a + num(n.donorMetrics?.uniqueDonors), 0);
    const recentDonors = ngos.reduce((a, n) => a + num(n.donorMetrics?.recent30DayDonors), 0);
    const donations = num(summary.successfulDonations);
    const avgDonation = donations > 0 ? num(summary.totalRaised) / donations : 0;
    const largest = ngos.reduce((a, n) => Math.max(a, num(n.financialMetrics?.largestDonation)), 0);
    const withDonors = topDonors.filter((d) => num(d.uniqueDonors) > 0);
    const maxDonors = Math.max(1, ...withDonors.map((d) => num(d.uniqueDonors)));

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<Users className="h-5 w-5" />}
                title="Donor Intelligence"
                subtitle="Donor base and giving behaviour across NGOs."
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricBlock
                    label="Donor relationships"
                    value={formatInt(totalDonorRelations)}
                    hint="Unique donors summed per NGO"
                />
                <MetricBlock
                    label="Active last 30 days"
                    value={formatInt(recentDonors)}
                    tone="brand"
                />
                <MetricBlock label="Successful donations" value={formatInt(donations)} />
                <MetricBlock label="Avg. donation" value={formatINR(avgDonation)} />
                <MetricBlock label="Largest donation" value={formatINR(largest)} />
                <MetricBlock
                    label="Donations (30 days)"
                    value={formatInt(summary.recent30DayDonations)}
                />
            </div>
            {withDonors.length > 0 ? (
                <div className="mt-5">
                    <p className="mb-3 text-sm font-semibold text-gray-900">Top NGOs by donor count</p>
                    <div className="space-y-4">
                        {withDonors.slice(0, 5).map((d) => (
                            <div key={d.id}>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="truncate pr-2 text-gray-700">{d.ngoName.trim()}</span>
                                    <span className="font-medium text-gray-900">
                                        {formatInt(d.uniqueDonors)} donors
                                    </span>
                                </div>
                                <ProgressBar value={(num(d.uniqueDonors) / maxDonors) * 100} tone="brand" />
                                <p className="mt-1 text-xs text-gray-500">
                                    Repeat donation rate{" "}
                                    <span className="font-medium text-gray-700">{formatPct(d.repeatDonationRate)}</span>{" "}
                                    · {formatInt(d.donations)} donations
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                    No donor activity recorded yet.
                </p>
            )}
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                               CAMPAIGN HEALTH                              */
/* -------------------------------------------------------------------------- */

function campaignStatusTone(status: string | null | undefined): Tone {
    switch (status) {
        case "APPROVED":
            return "good";
        case "COMPLETED":
            return "brand";
        case "PENDING":
            return "warn";
        case "REJECTED":
            return "bad";
        default:
            return "neutral";
    }
}

function CampaignHealth({ ngos }: { ngos: Ngo[] }) {
    const totals = ngos.reduce(
        (acc, n) => {
            const c = n.campaignMetrics;
            acc.total += num(c?.total);
            acc.approved += num(c?.approved);
            acc.active += num(c?.active);
            acc.inactive += num(c?.inactive);
            acc.completed += num(c?.completed);
            acc.withFunding += num(c?.withFunding);
            acc.withoutFunding += num(c?.withoutFunding);
            acc.fullyFunded += num(c?.fullyFunded);
            return acc;
        },
        {
            total: 0,
            approved: 0,
            active: 0,
            inactive: 0,
            completed: 0,
            withFunding: 0,
            withoutFunding: 0,
            fullyFunded: 0,
        }
    );

    const allCampaigns = ngos.flatMap((n) =>
        (n.campaigns ?? []).map((c) => ({ ...c, ngoName: n.ngoName }))
    );
    const pending = allCampaigns.filter((c) => c.status === "PENDING").length;
    const stalled = allCampaigns.filter((c) => c.isStalled).length;
    const mismatched = allCampaigns.filter((c) => c.dataMismatch).length;
    const sorted = [...allCampaigns].sort((a, b) => num(b.raisedAmount) - num(a.raisedAmount));

    const pct = (v: number) => (totals.total > 0 ? (v / totals.total) * 100 : 0);

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<Megaphone className="h-5 w-5" />}
                title="Campaign Health"
                subtitle="Status mix, funding coverage and individual campaign progress."
            />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <MetricBlock label="Total campaigns" value={formatInt(totals.total)} />
                <MetricBlock label="Active" value={formatInt(totals.active)} tone="good" />
                <MetricBlock label="Approved" value={formatInt(totals.approved)} />
                <MetricBlock label="Completed" value={formatInt(totals.completed)} tone="brand" />
                <MetricBlock label="Pending" value={formatInt(pending)} tone={pending > 0 ? "warn" : "neutral"} />
                <MetricBlock label="Fully funded" value={formatInt(totals.fullyFunded)} />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <LabeledBar
                    label="Campaigns with funding"
                    valueLabel={`${formatInt(totals.withFunding)} / ${formatInt(totals.total)}`}
                    value={pct(totals.withFunding)}
                    tone="good"
                />
                <LabeledBar
                    label="Campaigns without funding"
                    valueLabel={`${formatInt(totals.withoutFunding)} / ${formatInt(totals.total)}`}
                    value={pct(totals.withoutFunding)}
                    tone={totals.withoutFunding > 0 ? "warn" : "neutral"}
                />
            </div>
            {(stalled > 0 || mismatched > 0) && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {stalled > 0 ? <Badge tone="warn">{stalled} stalled campaigns</Badge> : null}
                    {mismatched > 0 ? <Badge tone="bad">{mismatched} data mismatches</Badge> : null}
                </div>
            )}
            {sorted.length > 0 ? (
                <div className="mt-5 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                                <th className="py-2 pr-4 font-medium">Campaign</th>
                                <th className="py-2 pr-4 font-medium">NGO</th>
                                <th className="py-2 pr-4 font-medium">Status</th>
                                <th className="py-2 pr-4 text-right font-medium">Raised</th>
                                <th className="py-2 font-medium">Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.slice(0, 8).map((c) => (
                                <tr key={c.id} className="border-b border-gray-100 last:border-0">
                                    <td className="max-w-[200px] truncate py-2.5 pr-4 font-medium text-gray-900">
                                        {c.title.trim()}
                                    </td>
                                    <td className="max-w-[160px] truncate py-2.5 pr-4 text-gray-600">
                                        {c.ngoName.trim()}
                                    </td>
                                    <td className="py-2.5 pr-4">
                                        <div className="flex items-center gap-1.5">
                                            <Badge tone={campaignStatusTone(c.status)}>{humanize(c.status)}</Badge>
                                            {c.isActive ? <Badge tone="good">Live</Badge> : null}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-2.5 pr-4 text-right text-gray-900">
                                        {formatINR(c.raisedAmount)}
                                        <span className="block text-xs text-gray-400">
                                            of {formatCompactINR(c.goalAmount)}
                                        </span>
                                    </td>
                                    <td className="min-w-[120px] py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <ProgressBar
                                                    value={num(c.progress)}
                                                    tone={num(c.progress) >= 100 ? "good" : num(c.progress) > 0 ? "brand" : "neutral"}
                                                />
                                            </div>
                                            <span className="w-10 text-right text-xs font-medium text-gray-700">
                                                {formatPct(c.progress)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                               EVENT ENGAGEMENT                             */
/* -------------------------------------------------------------------------- */

function EventSection({ summary, ngos }: { summary: Summary; ngos: Ngo[] }) {
    const approved = ngos.reduce((a, n) => a + num(n.eventMetrics?.approved), 0);
    const active = ngos.reduce((a, n) => a + num(n.eventMetrics?.active), 0);
    const eventStories = ngos.reduce((a, n) => a + num(n.impactMetrics?.eventSuccessStories), 0);
    const totalEvents = num(summary.totalEvents);
    const regs = num(summary.totalEventRegistrations);
    const avgReg = totalEvents > 0 ? regs / totalEvents : 0;
    const withEvents = ngos
        .filter((n) => num(n.eventMetrics?.total) > 0)
        .sort((a, b) => num(b.eventMetrics?.registrations) - num(a.eventMetrics?.registrations));
    const maxRegs = Math.max(1, ...withEvents.map((n) => num(n.eventMetrics?.registrations)));

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<CalendarDays className="h-5 w-5" />}
                title="Event Engagement"
                subtitle="Event volume and volunteer registrations."
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricBlock label="Total events" value={formatInt(totalEvents)} />
                <MetricBlock label="Approved events" value={formatInt(approved)} />
                <MetricBlock label="Active events" value={formatInt(active)} tone="good" />
                <MetricBlock label="Registrations" value={formatInt(regs)} tone="brand" />
                <MetricBlock label="Avg. per event" value={avgReg.toFixed(1)} />
                <MetricBlock label="Event success stories" value={formatInt(eventStories)} />
            </div>
            {withEvents.length > 0 ? (
                <div className="mt-5 space-y-4">
                    <p className="text-sm font-semibold text-gray-900">Registrations by NGO</p>
                    {withEvents.map((n) => (
                        <div key={n.id}>
                            <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="truncate pr-2 text-gray-700">{n.ngoName.trim()}</span>
                                <span className="font-medium text-gray-900">
                                    {formatInt(n.eventMetrics?.registrations)} · {formatInt(n.eventMetrics?.total)} events
                                </span>
                            </div>
                            <ProgressBar value={(num(n.eventMetrics?.registrations) / maxRegs) * 100} tone="brand" />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                    No events have been organised yet.
                </p>
            )}
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                                SUCCESS STORIES                             */
/* -------------------------------------------------------------------------- */

function SuccessStories({ summary, ngos }: { summary: Summary; ngos: Ngo[] }) {
    const campaignStories = ngos.reduce((a, n) => a + num(n.impactMetrics?.campaignSuccessStories), 0);
    const eventStories = ngos.reduce((a, n) => a + num(n.impactMetrics?.eventSuccessStories), 0);

    const stories = ngos
        .flatMap((n) =>
            (n.campaigns ?? [])
                .filter((c) => c.hasSuccessStory)
                .map((c) => ({ campaign: c, ngoName: n.ngoName }))
        )
        .sort(
            (a, b) =>
                new Date(b.campaign.updatedAt ?? 0).getTime() - new Date(a.campaign.updatedAt ?? 0).getTime()
        );

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<Trophy className="h-5 w-5" />}
                title="Success Stories"
                subtitle="Completed campaigns and events that delivered impact."
            />
            <div className="mt-4 grid grid-cols-3 gap-3">
                <MetricBlock label="Total" value={formatInt(summary.totalSuccessStories)} tone="brand" />
                <MetricBlock label="Campaign" value={formatInt(campaignStories)} />
                <MetricBlock label="Event" value={formatInt(eventStories)} />
            </div>
            {stories.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {stories.map(({ campaign, ngoName }) => (
                        <div key={campaign.id} className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-900">{campaign.title.trim()}</p>
                                <Badge tone="good">{humanize(campaign.status)}</Badge>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-500">
                                {ngoName.trim()} · {formatDate(campaign.updatedAt)}
                            </p>
                            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <p className="text-gray-400">Raised</p>
                                    <p className="font-semibold text-gray-900">{formatCompactINR(campaign.raisedAmount)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Goal reached</p>
                                    <p className="font-semibold text-gray-900">{formatPct(campaign.progress)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Donations</p>
                                    <p className="font-semibold text-gray-900">{formatInt(campaign.successfulDonations)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                    No campaign success stories to display yet.
                </p>
            )}
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                             OPERATIONAL READINESS                          */
/* -------------------------------------------------------------------------- */

function OperationalReadinessSection({ ngos }: { ngos: Ngo[] }) {
    const total = ngos.length;
    const count = (fn: (c: ReadinessChecks) => boolean | null | undefined) =>
        ngos.filter((n) => (n.operationalReadiness?.checks ? fn(n.operationalReadiness.checks) : false)).length;

    const checks: { label: string; n: number }[] = [
        { label: "Verified", n: count((c) => c.verified) },
        { label: "Can receive donations", n: count((c) => c.canReceiveDonations) },
        { label: "Has website", n: count((c) => c.hasWebsite) },
        { label: "Has categories", n: count((c) => c.hasCategories) },
        { label: "Approved campaign", n: count((c) => c.hasApprovedCampaign) },
        { label: "Active campaign", n: count((c) => c.hasActiveCampaign) },
        { label: "Success stories", n: count((c) => c.hasSuccessStories) },
    ];

    const avgReadiness =
        total > 0 ? ngos.reduce((a, n) => a + num(n.operationalReadiness?.score), 0) / total : 0;
    const avgScore =
        total > 0 ? ngos.reduce((a, n) => a + num(n.managementScore), 0) / total : 0;

    const sorted = [...ngos].sort(
        (a, b) => num(b.operationalReadiness?.score) - num(a.operationalReadiness?.score)
    );

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Operational Readiness"
                subtitle="Verification, donation readiness and platform completeness."
            />
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Avg. operational readiness
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{formatPct(avgReadiness)}</p>
                    <div className="mt-2">
                        <ProgressBar value={avgReadiness} tone={scoreTone(avgReadiness)} height="h-2.5" />
                    </div>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Avg. management score
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{formatScore(avgScore)}</p>
                    <div className="mt-2">
                        <ProgressBar value={avgScore} tone={scoreTone(avgScore)} height="h-2.5" />
                    </div>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {checks.map((c) => (
                    <LabeledBar
                        key={c.label}
                        label={c.label}
                        valueLabel={`${c.n}/${total}`}
                        value={total > 0 ? (c.n / total) * 100 : 0}
                        tone={total > 0 && c.n / total >= 0.7 ? "good" : c.n === 0 ? "bad" : "warn"}
                    />
                ))}
            </div>
            <div className="mt-5 space-y-2">
                <p className="text-sm font-semibold text-gray-900">Readiness by NGO</p>
                {sorted.map((n) => (
                    <div key={n.id} className="flex items-center gap-3">
                        <span className="w-40 shrink-0 truncate text-sm text-gray-700 sm:w-56">
                            {n.ngoName.trim()}
                        </span>
                        <div className="flex-1">
                            <ProgressBar
                                value={num(n.operationalReadiness?.score)}
                                tone={scoreTone(n.operationalReadiness?.score)}
                            />
                        </div>
                        <span className="w-10 text-right text-sm font-medium text-gray-900">
                            {formatPct(n.operationalReadiness?.score)}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                          RISK FLAGS & OPPORTUNITIES                        */
/* -------------------------------------------------------------------------- */

interface RiskItem {
    ngo: Ngo;
    reasons: string[];
}

function RiskSection({ ngos, onOpen }: { ngos: Ngo[]; onOpen: (id: number) => void }) {
    const items: RiskItem[] = ngos
        .map((ngo) => {
            const reasons: string[] = [...(ngo.riskFlags ?? [])];
            if (num(ngo.managementScore) < 30) reasons.push("Low management score");
            if (num(ngo.campaignMetrics?.total) === 0) reasons.push("No campaigns created");
            if (num(ngo.donorMetrics?.uniqueDonors) === 0) reasons.push("No donor engagement");
            const readiness = num(ngo.operationalReadiness?.score);
            if (readiness < 60) reasons.push(`Readiness at ${formatPct(readiness)}`);
            if ((ngo.campaigns ?? []).some((c) => c.isStalled)) reasons.push("Stalled campaign");
            if ((ngo.campaigns ?? []).some((c) => c.dataMismatch)) reasons.push("Campaign data mismatch");
            return { ngo, reasons: Array.from(new Set(reasons)) };
        })
        .filter((i) => i.reasons.length > 0)
        .sort((a, b) => {
            const flagDiff = (b.ngo.riskFlags?.length ?? 0) - (a.ngo.riskFlags?.length ?? 0);
            if (flagDiff !== 0) return flagDiff;
            return num(a.ngo.managementScore) - num(b.ngo.managementScore);
        });

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<AlertTriangle className="h-5 w-5" />}
                title="Risk & Attention Required"
                subtitle="NGOs with flagged risks or weak performance signals."
                right={<Badge tone={items.length > 0 ? "bad" : "good"}>{items.length} NGOs flagged</Badge>}
            />
            {items.length === 0 ? (
                <p className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
                    No risks detected. All NGOs are operating within healthy thresholds.
                </p>
            ) : (
                <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
                    {items.map(({ ngo, reasons }) => {
                        const hasExplicit = (ngo.riskFlags?.length ?? 0) > 0;
                        return (
                            <button
                                key={ngo.id}
                                type="button"
                                onClick={() => onOpen(ngo.id)}
                                className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-gray-50 ${hasExplicit ? "border-red-200 bg-red-50/40" : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-sm font-semibold text-gray-900">{ngo.ngoName.trim()}</p>
                                    <Badge tone={scoreTone(ngo.managementScore)}>{formatScore(ngo.managementScore)}</Badge>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {reasons.map((r) => {
                                        const explicit = ngo.riskFlags?.includes(r) ?? false;
                                        return (
                                            <span
                                                key={r}
                                                className={`rounded-md px-2 py-0.5 text-xs ${explicit
                                                    ? "bg-red-100 font-medium text-red-700"
                                                    : "bg-amber-50 text-amber-700"
                                                    }`}
                                            >
                                                {r}
                                            </span>
                                        );
                                    })}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}

function OpportunitiesSection({ ngos, onOpen }: { ngos: Ngo[]; onOpen: (id: number) => void }) {
    const items = ngos
        .filter((n) => (n.opportunities?.length ?? 0) > 0)
        .sort((a, b) => num(b.managementScore) - num(a.managementScore));

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<Lightbulb className="h-5 w-5" />}
                title="Opportunities"
                subtitle="Positive signals management can build on."
                right={<Badge tone="neutral">{items.length} NGOs</Badge>}
            />
            {items.length === 0 ? (
                <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                    No opportunities identified yet.
                </p>
            ) : (
                <div className="mt-4 space-y-3">
                    {items.map((n) => (
                        <button
                            key={n.id}
                            type="button"
                            onClick={() => onOpen(n.id)}
                            className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-red-300 hover:bg-red-50/30"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-semibold text-gray-900">{n.ngoName.trim()}</p>
                                <Badge tone={classificationTone(n.classification)}>
                                    {humanize(n.classification)}
                                </Badge>
                            </div>
                            <ul className="mt-2 space-y-1.5">
                                {(n.opportunities ?? []).map((o) => (
                                    <li key={o} className="flex items-start gap-2 text-sm text-gray-600">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                                        <span>{o}</span>
                                    </li>
                                ))}
                            </ul>
                        </button>
                    ))}
                </div>
            )}
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                               GEOGRAPHY SECTION                            */
/* -------------------------------------------------------------------------- */

function GeographySection({ rows }: { rows: GeoRow[] }) {
    const sorted = [...rows].sort((a, b) => num(b.raised) - num(a.raised) || num(b.ngos) - num(a.ngos));
    const maxRaised = Math.max(1, ...sorted.map((r) => num(r.raised)));

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<MapPin className="h-5 w-5" />}
                title="State-wise Intelligence"
                subtitle="Geographic spread of NGOs and funds raised."
            />
            {sorted.length === 0 ? (
                <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                    No geographic data available.
                </p>
            ) : (
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                                <th className="py-2 pr-4 font-medium">State</th>
                                <th className="py-2 pr-4 text-right font-medium">NGOs</th>
                                <th className="py-2 pr-4 text-right font-medium">Donations</th>
                                <th className="py-2 pr-4 text-right font-medium">Goal</th>
                                <th className="py-2 pr-4 text-right font-medium">Goal ach.</th>
                                <th className="min-w-[180px] py-2 font-medium">Raised</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((r) => (
                                <tr key={r.state} className="border-b border-gray-100 last:border-0">
                                    <td className="py-2.5 pr-4 font-medium text-gray-900">{r.state}</td>
                                    <td className="py-2.5 pr-4 text-right text-gray-700">{formatInt(r.ngos)}</td>
                                    <td className="py-2.5 pr-4 text-right text-gray-700">{formatInt(r.donations)}</td>
                                    <td className="whitespace-nowrap py-2.5 pr-4 text-right text-gray-700">
                                        {formatCompactINR(r.goal)}
                                    </td>
                                    <td className="py-2.5 pr-4 text-right text-gray-700">{formatPct(r.goalAchievement)}</td>
                                    <td className="py-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1">
                                                <ProgressBar value={(num(r.raised) / maxRaised) * 100} tone="brand" />
                                            </div>
                                            <span className="w-16 text-right text-xs font-semibold text-gray-900">
                                                {formatCompactINR(r.raised)}
                                            </span>
                                        </div>
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
/*                           FULL NGO INTELLIGENCE TABLE                      */
/* -------------------------------------------------------------------------- */

type SortKey = "score" | "raised" | "campaigns" | "donors" | "name";

function NgoTable({ ngos, onOpen }: { ngos: Ngo[]; onOpen: (id: number) => void }) {
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("score");

    const rows = useMemo(() => {
        const q = query.trim().toLowerCase();
        const filtered = ngos.filter(
            (n) =>
                q === "" ||
                n.ngoName.toLowerCase().includes(q) ||
                (n.state ?? "").toLowerCase().includes(q) ||
                (n.district ?? "").toLowerCase().includes(q)
        );
        const sorted = [...filtered];
        sorted.sort((a, b) => {
            switch (sortKey) {
                case "raised":
                    return num(b.financialMetrics?.totalRaised) - num(a.financialMetrics?.totalRaised);
                case "campaigns":
                    return num(b.campaignMetrics?.total) - num(a.campaignMetrics?.total);
                case "donors":
                    return num(b.donorMetrics?.uniqueDonors) - num(a.donorMetrics?.uniqueDonors);
                case "name":
                    return a.ngoName.localeCompare(b.ngoName);
                default:
                    return num(b.managementScore) - num(a.managementScore);
            }
        });
        return sorted;
    }, [ngos, query, sortKey]);

    return (
        <Card className="p-5">
            <SectionHeader
                icon={<Building2 className="h-5 w-5" />}
                title="Full NGO Intelligence"
                subtitle={`${rows.length} of ${ngos.length} NGOs`}
                right={
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search NGO or state"
                                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 sm:w-56"
                            />
                        </div>
                        <select
                            value={sortKey}
                            onChange={(e) => setSortKey(e.target.value as SortKey)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                            aria-label="Sort NGOs"
                        >
                            <option value="score">Sort: Management score</option>
                            <option value="raised">Sort: Raised</option>
                            <option value="campaigns">Sort: Campaigns</option>
                            <option value="donors">Sort: Donors</option>
                            <option value="name">Sort: Name</option>
                        </select>
                    </div>
                }
            />
            <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-[1100px] w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                            <th className="px-4 py-3 font-medium">NGO</th>
                            <th className="px-4 py-3 font-medium">State</th>
                            <th className="px-4 py-3 text-right font-medium">Raised</th>
                            <th className="px-4 py-3 text-right font-medium">Campaigns</th>
                            <th className="px-4 py-3 text-right font-medium">Donors</th>
                            <th className="px-4 py-3 text-right font-medium">Events</th>
                            <th className="px-4 py-3 text-right font-medium">Stories</th>
                            <th className="px-4 py-3 font-medium">Goal ach.</th>
                            <th className="px-4 py-3 font-medium">Readiness</th>
                            <th className="px-4 py-3 font-medium">Score</th>
                            <th className="px-4 py-3 font-medium">Risk</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="px-4 py-10 text-center text-gray-500">
                                    No NGOs match your search.
                                </td>
                            </tr>
                        ) : (
                            rows.map((n) => {
                                const riskCount = n.riskFlags?.length ?? 0;
                                return (
                                    <tr
                                        key={n.id}
                                        onClick={() => onOpen(n.id)}
                                        className="cursor-pointer border-t border-gray-100 hover:bg-red-50/30"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="max-w-[200px] truncate font-semibold text-gray-900">
                                                {n.ngoName.trim()}
                                            </p>
                                            <p className="max-w-[200px] truncate text-xs text-gray-500">
                                                {humanize(n.registrationType)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{n.state ?? "—"}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900">
                                            {formatINR(n.financialMetrics?.totalRaised)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-700">
                                            {formatInt(n.campaignMetrics?.total)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-700">
                                            {formatInt(n.donorMetrics?.uniqueDonors)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-700">
                                            {formatInt(n.eventMetrics?.total)}
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-700">
                                            {formatInt(n.impactMetrics?.totalSuccessStories)}
                                        </td>
                                        <td className="min-w-[110px] px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <ProgressBar
                                                        value={num(n.financialMetrics?.goalAchievement)}
                                                        tone={scoreTone(n.financialMetrics?.goalAchievement)}
                                                    />
                                                </div>
                                                <span className="w-9 text-right text-xs text-gray-700">
                                                    {formatPct(n.financialMetrics?.goalAchievement)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="min-w-[110px] px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1">
                                                    <ProgressBar
                                                        value={num(n.operationalReadiness?.score)}
                                                        tone={scoreTone(n.operationalReadiness?.score)}
                                                    />
                                                </div>
                                                <span className="w-9 text-right text-xs text-gray-700">
                                                    {formatPct(n.operationalReadiness?.score)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <span className={`font-semibold ${textToneClasses[scoreTone(n.managementScore)]}`}>
                                                {formatScore(n.managementScore)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {riskCount > 0 ? (
                                                <Badge tone="bad">{riskCount} flag{riskCount > 1 ? "s" : ""}</Badge>
                                            ) : (
                                                <Badge tone="good">Clear</Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge tone={classificationTone(n.classification)}>
                                                {humanize(n.classification)}
                                            </Badge>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                                 DETAIL MODAL                               */
/* -------------------------------------------------------------------------- */

function DetailModal({ ngo, onClose }: { ngo: Ngo; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const f = ngo.financialMetrics;
    const d = ngo.donorMetrics;
    const c = ngo.campaignMetrics;
    const e = ngo.eventMetrics;
    const i = ngo.impactMetrics;
    const r = ngo.operationalReadiness;
    const checks = r?.checks;
    const campaigns = ngo.campaigns ?? [];

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${ngo.ngoName} details`}
            onClick={onClose}
        >
            <div
                className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
                onClick={(ev) => ev.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-white p-5">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-lg font-semibold text-gray-900">{ngo.ngoName.trim()}</h3>
                            <Badge tone={classificationTone(ngo.classification)}>{humanize(ngo.classification)}</Badge>
                            {ngo.isVerified ? <Badge tone="good">Verified</Badge> : null}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            {[ngo.district, ngo.state].filter(Boolean).join(", ") || "Location not provided"} ·{" "}
                            {humanize(ngo.registrationType)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-6 p-5">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <MetricBlock
                            label="Management score"
                            value={formatScore(ngo.managementScore)}
                            tone={scoreTone(ngo.managementScore)}
                        />
                        <MetricBlock
                            label="Readiness"
                            value={formatPct(r?.score)}
                            tone={scoreTone(r?.score)}
                        />
                        <MetricBlock label="Raised" value={formatINR(f?.totalRaised)} tone="brand" />
                        <MetricBlock label="Goal achievement" value={formatPct(f?.goalAchievement)} />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-900">Financial</p>
                            <div className="grid grid-cols-2 gap-3">
                                <MetricBlock label="Goal" value={formatINR(f?.totalGoal)} />
                                <MetricBlock label="Remaining" value={formatINR(f?.remainingGoal)} />
                                <MetricBlock label="Avg. donation" value={formatINR(f?.averageDonation)} />
                                <MetricBlock label="Largest donation" value={formatINR(f?.largestDonation)} />
                            </div>
                            <LabeledBar
                                label="Donation coverage"
                                valueLabel={formatPct(f?.actualDonationCoverage)}
                                value={num(f?.actualDonationCoverage)}
                                tone="good"
                            />
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-900">Donors</p>
                            <div className="grid grid-cols-2 gap-3">
                                <MetricBlock label="Unique donors" value={formatInt(d?.uniqueDonors)} />
                                <MetricBlock label="Donations" value={formatInt(d?.successfulDonations)} />
                                <MetricBlock label="Last 30 days" value={formatINR(d?.recent30DayRaised)} />
                                <MetricBlock
                                    label="Last donation"
                                    value={formatDate(ngo.momentum?.lastDonationAt)}
                                    hint={
                                        typeof ngo.momentum?.daysSinceLastDonation === "number"
                                            ? `${ngo.momentum.daysSinceLastDonation} days ago`
                                            : undefined
                                    }
                                />
                            </div>
                            <LabeledBar
                                label="Repeat donation rate"
                                valueLabel={formatPct(d?.repeatDonationRate)}
                                value={num(d?.repeatDonationRate)}
                                tone="brand"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-900">Campaigns</p>
                            <div className="grid grid-cols-3 gap-3">
                                <MetricBlock label="Total" value={formatInt(c?.total)} />
                                <MetricBlock label="Active" value={formatInt(c?.active)} />
                                <MetricBlock label="Completed" value={formatInt(c?.completed)} />
                            </div>
                            <LabeledBar
                                label="Campaign success rate"
                                valueLabel={formatPct(c?.successRate)}
                                value={num(c?.successRate)}
                                tone={scoreTone(c?.successRate)}
                            />
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-900">Events & impact</p>
                            <div className="grid grid-cols-3 gap-3">
                                <MetricBlock label="Events" value={formatInt(e?.total)} />
                                <MetricBlock label="Registrations" value={formatInt(e?.registrations)} />
                                <MetricBlock label="Stories" value={formatInt(i?.totalSuccessStories)} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-semibold text-gray-900">Readiness checklist</p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            <ReadinessCheck ok={checks?.verified} label="Verified" />
                            <ReadinessCheck ok={checks?.canReceiveDonations} label="Can receive donations" />
                            <ReadinessCheck ok={checks?.hasWebsite} label="Has website" />
                            <ReadinessCheck ok={checks?.hasCategories} label="Has categories" />
                            <ReadinessCheck ok={checks?.hasApprovedCampaign} label="Approved campaign" />
                            <ReadinessCheck ok={checks?.hasActiveCampaign} label="Active campaign" />
                            <ReadinessCheck ok={checks?.hasSuccessStories} label="Success stories" />
                        </div>
                    </div>

                    {(ngo.categories?.length ?? 0) > 0 ? (
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-900">Categories</p>
                            <div className="flex flex-wrap gap-1.5">
                                {(ngo.categories ?? []).map((cat) => (
                                    <Badge key={cat.id} tone="neutral">
                                        {cat.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {campaigns.length > 0 ? (
                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-900">Campaigns ({campaigns.length})</p>
                            <div className="space-y-2">
                                {campaigns.map((cp) => (
                                    <div key={cp.id} className="rounded-lg border border-gray-200 p-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-gray-900">{cp.title.trim()}</p>
                                            <div className="flex items-center gap-1.5">
                                                <Badge tone={campaignStatusTone(cp.status)}>{humanize(cp.status)}</Badge>
                                                {cp.isActive ? <Badge tone="good">Live</Badge> : null}
                                                {cp.isStalled ? <Badge tone="warn">Stalled</Badge> : null}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center gap-3">
                                            <div className="flex-1">
                                                <ProgressBar
                                                    value={num(cp.progress)}
                                                    tone={num(cp.progress) >= 100 ? "good" : "brand"}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-gray-700">
                                                {formatINR(cp.raisedAmount)} / {formatINR(cp.goalAmount)} ({formatPct(cp.progress)})
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                                <AlertTriangle className="h-4 w-4 text-red-600" /> Risk flags
                            </p>
                            {(ngo.riskFlags?.length ?? 0) > 0 ? (
                                <ul className="space-y-1.5">
                                    {(ngo.riskFlags ?? []).map((flag) => (
                                        <li key={flag} className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                                            {flag}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-500">No risk flags.</p>
                            )}
                        </div>
                        <div>
                            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                                <Lightbulb className="h-4 w-4 text-red-600" /> Opportunities
                            </p>
                            {(ngo.opportunities?.length ?? 0) > 0 ? (
                                <ul className="space-y-1.5">
                                    {(ngo.opportunities ?? []).map((o) => (
                                        <li key={o} className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                            {o}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-500">
                                    No opportunities identified.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 sm:grid-cols-3">
                        <span>Verified on {formatDate(ngo.verifiedAt)}</span>
                        <span className="truncate">{ngo.email ?? "—"}</span>
                        <span>{ngo.mobile ?? "—"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                               STATE SCREENS                                */
/* -------------------------------------------------------------------------- */

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <Card className="mx-auto max-w-lg p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Unable to load NGO insights</h2>
            <p className="mt-1 text-sm text-gray-500">
                Something went wrong while fetching the data. Please try again.
            </p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
                <RefreshCw className="h-4 w-4" />
                Retry
            </button>
        </Card>
    );
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
    return (
        <Card className="mx-auto max-w-lg p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <Inbox className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No NGO intelligence available</h2>
            <p className="mt-1 text-sm text-gray-500">
                There are no verified NGOs to analyse yet. Data will appear here once NGOs are verified.
            </p>
            <button
                type="button"
                onClick={onRefresh}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <RefreshCw className="h-4 w-4" />
                Refresh
            </button>
        </Card>
    );
}

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function NgoInsightsPage() {
    const [data, setData] = useState<InsightsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const load = useCallback(async (isRefresh: boolean) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        setError(false);

        try {
            const json = await getNgoInsights();

            setData(json.data);
            setUpdatedAt(new Date());
        } catch (err) {
            console.error("NGO Insights fetch failed:", err);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void load(false);
    }, [load]);

    const ngos = useMemo<Ngo[]>(() => data?.ngos ?? [], [data]);
    const selectedNgo = useMemo(
        () => (selectedId === null ? null : ngos.find((n) => n.id === selectedId) ?? null),
        [ngos, selectedId]
    );
    const closeModal = useCallback(() => setSelectedId(null), []);
    const openNgo = useCallback((id: number) => setSelectedId(id), []);

    const summary: Summary = data?.summary ?? {};
    const rankings: Rankings = data?.rankings ?? {};
    const totalCampaigns = ngos.reduce((a, n) => a + num(n.campaignMetrics?.total), 0);
    const isEmpty = !!data && ngos.length === 0 && num(summary.verifiedNgos) === 0;

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
            <div className="mx-auto w-full max-w-[20000px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="hidden h-12 w-1.5 rounded-full bg-red-600 sm:block" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">NGO Intelligence</h1>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Management overview of verified NGOs, financial performance, donor engagement and
                                operational health.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {updatedAt ? (
                            <p className="hidden text-xs text-gray-500 sm:block">
                                Last updated
                                <span className="block font-medium text-gray-700">{formatTime(updatedAt)}</span>
                            </p>
                        ) : null}
                        <button
                            type="button"
                            onClick={() => void load(true)}
                            disabled={loading || refreshing}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
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
                                <span>Unable to refresh insights. Showing previously loaded data.</span>
                                <button
                                    type="button"
                                    onClick={() => void load(true)}
                                    className="font-semibold underline underline-offset-2"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : null}

                        <ExecutiveSummary summary={summary} />

                        <DecisionInsights items={data.decisionInsights ?? []} />

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            <div className="xl:col-span-2">
                                <Rankings rankings={rankings} onOpen={openNgo} />
                            </div>
                            <div className="space-y-6">
                                <RiskSection ngos={ngos} onOpen={openNgo} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <FinancialSection
                                summary={summary}
                                campaignCount={totalCampaigns}
                                topRaised={rankings.topByRaised ?? []}
                            />
                            <DonorSection
                                summary={summary}
                                topDonors={rankings.topByDonors ?? []}
                                ngos={ngos}
                            />
                        </div>

                        <CampaignHealth ngos={ngos} />

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <EventSection summary={summary} ngos={ngos} />
                            <OperationalReadinessSection ngos={ngos} />
                        </div>

                        <SuccessStories summary={summary} ngos={ngos} />

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            <OpportunitiesSection ngos={ngos} onOpen={openNgo} />
                            <GeographySection rows={data.geography ?? []} />
                        </div>

                        <NgoTable ngos={ngos} onOpen={openNgo} />
                    </>
                )}
            </div>

            {selectedNgo ? <DetailModal ngo={selectedNgo} onClose={closeModal} /> : null}
        </div>
    );
}



