"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDonationById, downloadInvoice } from "@/features/donations/api/donation.api";
import Image from "next/image";
import Link from "next/link";

/* ================= INNER COMPONENT ================= */
function SuccessContent() {
  const params = useSearchParams();
  const donationId = params.get("donationId");

  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!donationId) return;

    const fetchDonation = async () => {
      try {
        const res = await getDonationById(donationId);
        setDonation(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  const handleDownload = async () => {
    try {
      const blob = await downloadInvoice(donation.id);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${donation.id}.pdf`;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your donation...
      </div>
    );
  }

  if (!donation) {
    return <div className="p-10">No donation found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-4 py-10">

      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-2xl w-full animate-fadeIn">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
            <span className="text-4xl text-green-600">✔</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">
            Donation Successful
          </h1>
          <p className="text-gray-500 mt-2">
            Your contribution is making a real impact ❤️
          </p>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-6">
          <div className="w-20 h-20 relative rounded-lg overflow-hidden">
            <Image
              src={donation.campaign?.image || "/assets/placeholder.png"}
              alt="campaign"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="font-semibold text-lg">
              {donation.campaign?.title}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(donation.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-lg font-semibold mb-6 border-b pb-3">
          <span>Total Paid</span>
          <span className="text-green-600 text-2xl">
            ₹{donation.amount}
          </span>
        </div>

        {donation.donationItems?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-700">
              Items Donated
            </h3>

            <div className="space-y-3">
              {donation.donationItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl hover:shadow transition"
                >
                  <div className="w-14 h-14 relative rounded-lg overflow-hidden">
                    <Image
                      src={
                        item.campaignProduct?.image ||
                        "/assets/placeholder.png"
                      }
                      alt={item.campaignProduct?.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {item.campaignProduct?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <div className="text-sm font-semibold">
                    ₹{item.totalAmount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm mb-6">
          <p>
            <span className="font-semibold">Payment ID:</span>{" "}
            {donation.razorpayPaymentId}
          </p>
          <p className="mt-1">
            <span className="font-semibold">Donor:</span>{" "}
            {donation.isAnonymous ? "Anonymous" : donation.donorName}
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/campaigns" className="w-full">
            <button className="w-full bg-[#D2252B] hover:bg-[#b91c1c] transition text-white py-3 rounded-xl font-semibold">
              Explore More Campaigns
            </button>
          </Link>

          <Link href="/" className="w-full">
            <button className="w-full border border-gray-300 hover:bg-gray-100 transition py-3 rounded-xl font-semibold">
              Go Home
            </button>

            <button
              onClick={handleDownload}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Download Receipt (PDF)
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}

/* ================= MAIN EXPORT ================= */
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}