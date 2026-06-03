import Link from "next/link";
import {
  BadgeCheck,
  ShieldCheck,
  FileCheck,
  Landmark,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";

export default function PartnersPage() {
  const features = [
    {
      title: "Verified NGO Badge",
      description:
        "Build donor trust with Foundation verified NGO verification system.",
      icon: BadgeCheck,
    },
    {
      title: "Transparent Fundraising",
      description:
        "Create authentic campaigns with proper verification and moderation.",
      icon: ShieldCheck,
    },
    {
      title: "Document Verification",
      description:
        "Secure NGO onboarding with PAN, registration certificates and compliance validation.",
      icon: FileCheck,
    },
    {
      title: "Donation Ready",
      description:
        "Enable secure donation collection with verified bank accounts.",
      icon: Landmark,
    },
  ];

  const documents = [
    "NGO PAN Card",
    "Trust / Society / Section 8 Certificate",
    "12A Certificate",
    "80G Certificate",
    "NGO Darpan ID",
    "Event Photos",
    "Annual Reports",
    "Project Reports",
    "Press Coverage",
  ];

  const steps = [
    {
      title: "Register NGO",
      description:
        "Submit organization details and official contact information.",
    },
    {
      title: "Upload Documents",
      description:
        "Upload legal certificates, PAN card and work activity proof.",
    },
    {
      title: "Verification Review",
      description:
        "Foundation admin team reviews submitted details and documents.",
    },
    {
      title: "Get Verified Badge",
      description:
        "Approved NGOs receive verified status and fundraising access.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
                <BadgeCheck className="h-4 w-4" />
                Trusted NGO Verification System
              </div>

              <h1 className="text-5xl font-bold leading-tight text-gray-900">
                Become a Verified NGO Partner on Foundation
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Join a transparent and trusted ecosystem designed for NGOs,
                donors, volunteers, and communities. Build credibility, launch
                impactful campaigns, and reach more supporters.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/partners/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D2252B] px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  Register NGO
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/contact"
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Contact Team
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-red-100 p-4">
                  <HeartHandshake className="h-10 w-10 text-red-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Foundation NGO Program
                  </h2>

                  <p className="text-gray-500">
                    Secure • Transparent • Verified
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  "Verified NGO Badge",
                  "Donation Access",
                  "Admin Moderation",
                  "Fraud Prevention",
                  "Campaign Visibility",
                  "Trust-Based Ecosystem",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border p-4"
                  >
                    <BadgeCheck className="h-5 w-5 text-green-600" />

                    <span className="font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-gray-900">
              Why NGOs Join Foundation
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              We are building a trusted ecosystem for verified organizations to
              create real impact with transparency and accountability.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-6 inline-flex rounded-2xl bg-red-100 p-4">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REQUIRED DOCUMENTS */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                NGO Verification Requirements
              </h2>

              <p className="mt-4 text-lg text-gray-600">
                To ensure transparency and donor trust, NGOs must complete a
                verification process before fundraising access is enabled.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {documents.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-3 rounded-2xl border bg-white p-4"
                  >
                    <FileCheck className="h-5 w-5 text-green-600" />

                    <span className="font-medium text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-10 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900">
                Verification Status System
              </h3>

              <div className="mt-8 space-y-5">
                {[
                  {
                    label: "Pending Verification",
                    color: "bg-yellow-100 text-yellow-700",
                  },
                  {
                    label: "Under Review",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    label: "Verified NGO",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    label: "Rejected",
                    color: "bg-red-100 text-red-700",
                  },
                ].map((status) => (
                  <div
                    key={status.label}
                    className="flex items-center justify-between rounded-2xl border p-5"
                  >
                    <span className="font-semibold text-gray-800">
                      {status.label}
                    </span>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${status.color}`}
                    >
                      Status
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              NGO Verification Process
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              Simple onboarding designed for secure and transparent verification.
            </p>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-3xl border bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D2252B] text-xl font-bold text-white">
                  {index + 1}
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#D2252B] py-24">
        <div className="mx-auto max-w-4xl px-6 text-center text-white">
          <h2 className="text-5xl font-bold">
            Join Foundation NGO Ecosystem
          </h2>

          <p className="mt-6 text-lg leading-8 text-red-100">
            Build donor trust, launch transparent fundraising campaigns, and
            create measurable impact with Foundation.
          </p>

          <div className="mt-10">
            <Link
              href="/partners/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-red-600 transition hover:bg-red-100"
            >
              Start NGO Registration
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}