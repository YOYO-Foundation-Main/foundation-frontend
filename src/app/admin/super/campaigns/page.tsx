"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FiTrendingUp,
  FiTarget,
  FiDollarSign,
  FiAward,
  FiUsers,
  FiRefreshCw,
} from "react-icons/fi";
import { getTopCampaigns } from "@/features/super-admin/api/finance.api";

type Campaign = {
  id: number;
  title: string;
  image: string;
  cause: {
    id: number;
    name: string;
  };
  goalAmount: number;
  raisedAmount: number;
  totalRaised: number;
  totalDonations: number;
  progress: number;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className={`h-1 ${color}`} />

      <div className="p-6 flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-60 bg-gray-200" />

      <div className="p-6 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-3/4" />

        <div className="h-4 bg-gray-100 rounded w-1/2" />

        <div className="h-2 rounded-full bg-gray-200" />

        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 bg-gray-100 rounded-xl" />
          <div className="h-16 bg-gray-100 rounded-xl" />
        </div>

        <div className="h-10 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function TopCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCampaigns = async () => {
    try {
      setLoading(true);

      const res = await getTopCampaigns();

      setCampaigns(res.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const stats = useMemo(() => {
    const totalRaised = campaigns.reduce(
      (sum, item) => sum + item.raisedAmount,
      0
    );

    const totalGoal = campaigns.reduce(
      (sum, item) => sum + item.goalAmount,
      0
    );

    const totalDonations = campaigns.reduce(
      (sum, item) => sum + item.totalDonations,
      0
    );

    const avgProgress =
      campaigns.length > 0
        ? campaigns.reduce((sum, c) => sum + c.progress, 0) /
        campaigns.length
        : 0;

    return {
      totalRaised,
      totalGoal,
      totalDonations,
      avgProgress,
      topCampaign: campaigns[0]?.title ?? "--",
    };
  }, [campaigns]);

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Top Revenue Campaigns
          </h1>

          <p className="text-gray-500 mt-2">
            Highest performing campaigns by total revenue.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 rounded-3xl bg-white animate-pulse"
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-7">
          {[1, 2, 3, 4].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          Failed to load campaigns
        </h2>

        <p className="text-red-500 mt-2">{error}</p>

        <button
          onClick={loadCampaigns}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 transition"
        >
          <FiRefreshCw />
          Retry
        </button>
      </div>
    );
  }

  if (!campaigns.length) {
    return (
      <div className="rounded-3xl bg-white p-16 border text-center">
        <FiTarget
          className="mx-auto text-gray-300"
          size={70}
        />

        <h2 className="mt-5 text-2xl font-bold text-gray-700">
          No Campaigns Found
        </h2>

        <p className="mt-2 text-gray-500">
          There are no revenue campaigns available.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Top Revenue Campaigns
          </h1>

          <p className="text-gray-500 mt-2">
            Monitor the best performing fundraising campaigns across the
            platform.
          </p>
        </div>

        <button
          onClick={loadCampaigns}
          className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 transition flex items-center gap-2"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {/* Summary */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Raised"
          value={formatCurrency(stats.totalRaised)}
          icon={<FiDollarSign size={24} />}
          color="bg-gradient-to-r from-red-500 to-red-600"
        />

        <StatCard
          title="Total Goal"
          value={formatCurrency(stats.totalGoal)}
          icon={<FiTarget size={24} />}
          color="bg-gradient-to-r from-orange-500 to-red-500"
        />

        <StatCard
          title="Total Donations"
          value={stats.totalDonations}
          icon={<FiUsers size={24} />}
          color="bg-gradient-to-r from-indigo-500 to-blue-500"
        />

        <StatCard
          title="Average Progress"
          value={`${stats.avgProgress.toFixed(1)}%`}
          icon={<FiTrendingUp size={24} />}
          color="bg-gradient-to-r from-emerald-500 to-green-500"
        />

      </div>
      {/* Campaign Grid */}
      {campaigns.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign, index) => {
            const progress = Math.min(campaign.progress, 100);

            return (
              <div
                key={campaign.id}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
                    #{index + 1}
                  </div>

                  {campaign.progress >= 100 && (
                    <div className="absolute right-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow">
                      Fully Funded
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-red-600 backdrop-blur">
                      {campaign.cause.name}
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-lg font-bold text-white">
                      {campaign.title}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-5 p-5">
                  {/* Progress */}
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium text-gray-500">
                        Progress
                      </span>

                      <span className="font-bold text-red-600">
                        {campaign.progress.toFixed(2)}%
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-red-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Raised
                      </p>

                      <p className="mt-1 text-lg font-bold text-red-600">
                        {formatCurrency(campaign.raisedAmount)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-100 p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Goal
                      </p>

                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {formatCurrency(campaign.goalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gray-200 p-4 text-center">
                      <p className="text-xs uppercase text-gray-500">
                        Donations
                      </p>

                      <p className="mt-1 text-xl font-bold text-gray-900">
                        {campaign.totalDonations}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-4 text-center">
                      <p className="text-xs uppercase text-gray-500">
                        Revenue
                      </p>

                      <p className="mt-1 text-xl font-bold text-green-600">
                        {formatCurrency(campaign.totalRaised)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-sm text-gray-500">
                      Campaign #{campaign.id}
                    </span>

                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                      Top Performer
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-24 text-center">
          <FiAward className="mx-auto h-12 w-12 text-gray-300" />

          <h3 className="mt-4 text-xl font-bold text-gray-700">
            No campaigns found
          </h3>

          <p className="mt-2 text-gray-500">
            There are no top campaigns available.
          </p>
        </div>
      )}
      {/* </>
      )} */}
    </div>
  );
}