"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  approveNgo,
  getNgoById,
  rejectNgo,
} from "@/features/admin/api/admin.api";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Facebook,
  FileText,
  Globe,
  Instagram,
  Landmark,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User2,
  XCircle,
} from "lucide-react";

export default function SingleNgoPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [ngo, setNgo] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");


  const id = Number(params.id);

  const fetchNgo = async () => {
    try {
      setLoading(true);
      const response = await getNgoById(id);
      setNgo(response.data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchNgo();
  }, [params.id]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approveNgo(id);
      alert("NGO approved successfully");
      fetchNgo();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      if (!rejectionReason) return alert("Please enter rejection reason");
      setActionLoading(true);
      await rejectNgo(id, rejectionReason);
      alert("NGO rejected");
      fetchNgo();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setActionLoading(false);
    }
  };
  // const fetchNgo = async () => {
  //   try {
  //     setLoading(true);
  //     // const response = await getNgoById(params.id as string);
  //     const id = Number(params.id);
  //     const response = await getNgoById(id);
  //     setNgo(response.data);
  //   } catch (error: any) {
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (params.id) fetchNgo();
  // }, [params.id]);

  // const handleApprove = async () => {
  //   try {
  //     setActionLoading(true);
  //     await approveNgo(params.id as string);
  //     alert("NGO approved successfully");
  //     fetchNgo();
  //   } catch (error: any) {
  //     alert(error.message);
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  // const handleReject = async () => {
  //   try {
  //     if (!rejectionReason) return alert("Please enter rejection reason");
  //     setActionLoading(true);
  //     await rejectNgo(params.id as string, rejectionReason);
  //     alert("NGO rejected");
  //     fetchNgo();
  //   } catch (error: any) {
  //     alert(error.message);
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading NGO details…</p>
        </div>
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl bg-white px-10 py-8 text-center shadow-sm">
          <p className="text-slate-500">NGO not found</p>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  };
  const statusDotColors: Record<string, string> = {
    APPROVED: "bg-emerald-500",
    REJECTED: "bg-red-500",
    PENDING: "bg-amber-500",
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── TOP HEADER ─────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white">
        {/* Orange accent bar */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400" />

        <div className="mx-auto max-w-7xl px-6 py-7">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to NGOs
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: title + meta */}
            <div className="flex items-start gap-4">
              <div className="hidden shrink-0 rounded-2xl bg-orange-50 p-3 sm:block">
                <Building2 className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {ngo.ngoName}
                  </h1>
                  {ngo.isVerified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified NGO
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[ngo.status] ?? "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusDotColors[ngo.status] ?? "bg-slate-400"
                        }`}
                    />
                    {ngo.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {ngo.district}, {ngo.state}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    {ngo.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {ngo.mobile}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(ngo.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex shrink-0 flex-wrap gap-3">
              <button
                disabled={actionLoading}
                onClick={handleApprove}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve NGO
              </button>
              <button
                disabled={actionLoading}
                onClick={handleReject}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95 disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" />
                Reject NGO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Quick-stats strip */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Registration Type", value: ngo.registrationType },
            { label: "Registration No.", value: ngo.registrationNumber },
            { label: "PAN Number", value: ngo.panNumber },
            { label: "Darpan ID", value: ngo.darpanId || "—" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
            >
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                {s.label}
              </p>
              <p className="truncate text-sm font-semibold text-slate-800">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── LEFT COL ──────────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-2">

            {/* NGO Information */}
            <Section icon={<Building2 className="h-5 w-5 text-orange-500" />} title="NGO Information">
              <div className="grid gap-5 sm:grid-cols-2">
                <Info label="District" value={ngo.district} />
                <Info label="State" value={ngo.state} />
                <Info label="Pincode" value={ngo.pincode} />
                <Info label="Address" value={ngo.address} />
              </div>
              <div className="mt-6 space-y-5 border-t border-slate-100 pt-6">
                <TextBlock title="About NGO" value={ngo.about} />
                <TextBlock title="Mission" value={ngo.mission} />
                <TextBlock title="Vision" value={ngo.vision} />
              </div>
            </Section>

            {/* Documents */}
            <Section
              icon={<FileText className="h-5 w-5 text-orange-500" />}
              title="NGO Documents"
              badge={`${ngo.documents.length} files`}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {ngo.documents.map((doc: any) => (
                  <a
                    key={doc.id}
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-400 hover:bg-orange-50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${doc.mimeType === "application/pdf"
                        ? "bg-red-100 text-red-500"
                        : "bg-blue-100 text-blue-500"
                        }`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-orange-700">
                        {doc.type.replaceAll("_", " ")}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">{doc.originalName}</p>
                      <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[doc.status] ?? "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:text-orange-400" />
                  </a>
                ))}
              </div>
            </Section>

            {/* Representatives */}
            <Section
              icon={<User2 className="h-5 w-5 text-orange-500" />}
              title="Representatives"
              badge={`${ngo.representatives.length} members`}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {ngo.representatives.map((rep: any, i: number) => {
                  const palette = [
                    ["bg-violet-100", "text-violet-700"],
                    ["bg-sky-100", "text-sky-700"],
                    ["bg-emerald-100", "text-emerald-700"],
                    ["bg-rose-100", "text-rose-700"],
                  ];
                  const [bg, tc] = palette[i % palette.length];
                  const initials = rep.fullName
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);
                  return (
                    <div
                      key={rep.id}
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${bg} ${tc}`}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{rep.fullName}</p>
                          <p className="text-xs text-slate-400">{rep.designation}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-slate-500">
                        <p className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {rep.email}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {rep.mobile}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Bank */}
            {ngo.bank && (
              <Section
                icon={<Landmark className="h-5 w-5 text-orange-500" />}
                title="Bank Information"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Info label="Bank Name" value={ngo.bank.bankName} />
                  <Info label="Status" value={ngo.bank.status} />
                </div>
              </Section>
            )}

            {/* Verification Logs */}
            {ngo.verificationLogs?.length > 0 && (
              <Section
                icon={<BadgeCheck className="h-5 w-5 text-orange-500" />}
                title="Verification Logs"
              >
                <div className="relative pl-5">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-100" />
                  <div className="space-y-4">
                    {ngo.verificationLogs.map((log: any) => {
                      const isRej = log.action.includes("REJECTED");
                      return (
                        <div key={log.id} className="relative">
                          <div
                            className={`absolute -left-5 flex h-6 w-6 items-center justify-center rounded-full ${isRej ? "bg-red-100" : "bg-emerald-100"
                              }`}
                          >
                            {isRej ? (
                              <XCircle className={`h-3.5 w-3.5 text-red-500`} />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                          </div>
                          <div className="rounded-xl bg-slate-50 p-4">
                            <div className="mb-1 flex items-center justify-between gap-2">
                              <span
                                className={`text-xs font-bold ${isRej ? "text-red-600" : "text-emerald-600"
                                  }`}
                              >
                                {log.action.replaceAll("_", " ")}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(log.createdAt).toLocaleString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {log.note && (
                              <p className="text-xs leading-relaxed text-slate-600">{log.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Section>
            )}
          </div>

          {/* ── RIGHT COL ─────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Verification Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="rounded-xl bg-orange-50 p-2">
                  <BadgeCheck className="h-5 w-5 text-orange-500" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Verification Status</h2>
              </div>

              <div
                className={`rounded-xl border p-4 text-center ${statusColors[ngo.status] ?? "bg-slate-50 border-slate-200"
                  }`}
              >
                <p className="mb-1 text-xs text-slate-500">Current Status</p>
                <p
                  className={`text-xl font-extrabold ${ngo.status === "APPROVED"
                    ? "text-emerald-700"
                    : ngo.status === "REJECTED"
                      ? "text-red-700"
                      : "text-amber-700"
                    }`}
                >
                  {ngo.status}
                </p>
              </div>

              {ngo.rejectionReason && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="mb-1.5 text-xs font-semibold text-red-600">Rejection Reason</p>
                  <p className="text-xs leading-relaxed text-red-700">{ngo.rejectionReason}</p>
                </div>
              )}

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Can receive donations</span>
                  <span
                    className={`font-semibold ${ngo.canReceiveDonations ? "text-emerald-600" : "text-red-500"
                      }`}
                  >
                    {ngo.canReceiveDonations ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Verified</span>
                  <span
                    className={`font-semibold ${ngo.isVerified ? "text-emerald-600" : "text-slate-400"
                      }`}
                  >
                    {ngo.isVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>NGO ID</span>
                  <span className="font-semibold text-slate-700">#{ngo.id}</span>
                </div>
              </div>
            </div>

            {/* Applicant */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="rounded-xl bg-sky-50 p-2">
                  <User2 className="h-5 w-5 text-sky-500" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Applicant</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-base font-bold text-sky-700">
                  {(ngo.user?.name || "U")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{ngo.user?.name}</p>
                  <p className="text-xs text-slate-400">User ID: #{ngo.user?.id}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{ngo.user?.email}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>{ngo.user?.mobile}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(ngo.website || ngo.instagram || ngo.facebook || ngo.linkedin) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="rounded-xl bg-indigo-50 p-2">
                    <Globe className="h-5 w-5 text-indigo-500" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Social & Web</h2>
                </div>
                <div className="space-y-2">
                  {[
                    { key: "website", label: "Website", Icon: Globe, color: "bg-blue-50 text-blue-600" },
                    { key: "instagram", label: "Instagram", Icon: Instagram, color: "bg-pink-50 text-pink-600" },
                    { key: "facebook", label: "Facebook", Icon: Facebook, color: "bg-blue-50 text-blue-700" },
                    { key: "linkedin", label: "LinkedIn", Icon: Linkedin, color: "bg-sky-50 text-sky-700" },
                  ]
                    .filter((s) => ngo[s.key])
                    .map(({ key, label, Icon, color }) => (
                      <a
                        key={key}
                        href={ngo[key]}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-400 hover:text-orange-700"
                      >
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span>{label}</span>
                        <ExternalLink className="ml-auto h-3.5 w-3.5 text-slate-300 transition group-hover:text-orange-400" />
                      </a>
                    ))}
                </div>
              </div>
            )}

            {/* Reject Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="rounded-xl bg-red-50 p-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Reject NGO</h2>
              </div>
              <textarea
                rows={4}
                placeholder="Enter a detailed rejection reason…"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
              <button
                disabled={actionLoading}
                onClick={handleReject}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95 disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" />
                Submit Rejection
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper Components ───────────────────────────────────────── */

function Section({
  icon,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-6 py-4">
        <div className="rounded-xl bg-orange-50 p-2">{icon}</div>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {badge && (
          <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-orange-500">{title}</p>
      <p className="text-sm leading-7 text-slate-600">{value || "No information provided."}</p>
    </div>
  );
}
