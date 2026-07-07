"use client";

import { useEffect, useState } from "react";
import {
  FiUsers,
  FiRepeat,
  FiUserCheck,
  FiEyeOff,
  FiUser,
  FiTrendingUp,
  FiDollarSign,
  FiAward,
} from "react-icons/fi";

import { getDonationAnalytics } from "@/features/super-admin/api/finance.api";

type DonationAnalytics = {
  totalDonations: number;
  totalDonors: number;
  averageDonation: number;
  largestDonation: number;
  smallestDonation: number;
  repeatDonors: number;
  oneTimeDonors: number;
  anonymousDonations: number;
  namedDonations: number;
  anonymousPercentage: number;
  namedPercentage: number;
  averageDonationsPerDonor: number;
};

export default function DonationAnalyticsPage() {
  const [analytics, setAnalytics] = useState<DonationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const res = await getDonationAnalytics();

      setAnalytics(res.data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[450px]">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analytics) return null;

  const cards = [
    {
      title: "Total Donations",
      value: analytics.totalDonations,
      icon: FiTrendingUp,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Total Donors",
      value: analytics.totalDonors,
      icon: FiUsers,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Average Donation",
      value: `₹${analytics.averageDonation.toLocaleString()}`,
      icon: FiDollarSign,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Largest Donation",
      value: `₹${analytics.largestDonation.toLocaleString()}`,
      icon: FiAward,
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Donation Analytics
        </h1>

        <p className="text-gray-500 mt-1">
          Insights about donors, donations and contribution behaviour.
        </p>
      </div>

      {/* Top Cards */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${card.color}`} />

            <div className="p-6 flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-lg`}
              >
                <card.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}

      <div className="grid xl:grid-cols-2 gap-6">
        {/* Donor Behaviour */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Donor Behaviour
          </h2>

          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiRepeat className="text-red-500" size={20} />

                <span className="text-gray-600">Repeat Donors</span>
              </div>

              <span className="font-bold text-lg">
                {analytics.repeatDonors}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiUserCheck className="text-blue-500" size={20} />

                <span className="text-gray-600">One Time Donors</span>
              </div>

              <span className="font-bold text-lg">
                {analytics.oneTimeDonors}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Avg Donations / Donor
              </span>

              <span className="font-bold text-lg text-green-600">
                {analytics.averageDonationsPerDonor}
              </span>
            </div>
          </div>
        </div>

        {/* Donation Type */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Donation Type
          </h2>

          <div className="space-y-7">
            <div>
              <div className="flex justify-between mb-2">
                <span className="flex items-center gap-2 text-gray-600">
                  <FiUser />
                  Named Donations
                </span>

                <span className="font-bold">
                  {analytics.namedPercentage}%
                </span>
              </div>

              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${analytics.namedPercentage}%`,
                  }}
                />
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {analytics.namedDonations} donations
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="flex items-center gap-2 text-gray-600">
                  <FiEyeOff />
                  Anonymous Donations
                </span>

                <span className="font-bold">
                  {analytics.anonymousPercentage}%
                </span>
              </div>

              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${analytics.anonymousPercentage}%`,
                  }}
                />
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {analytics.anonymousDonations} donations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary */}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white p-6 shadow-lg">
          <p className="text-red-100 text-sm">
            Smallest Donation
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{analytics.smallestDonation.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 shadow-lg">
          <p className="text-green-100 text-sm">
            Average Donation
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{analytics.averageDonation.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 shadow-lg">
          <p className="text-blue-100 text-sm">
            Largest Donation
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{analytics.largestDonation.toLocaleString()}
          </h2>
        </div>
      </div>
    </div>
  );
}