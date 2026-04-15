import Image from "next/image";
import Link from "next/link";
import { getCampaigns } from "@/features/campaigns/api/campaign.api";
import { Campaign } from "@/features/campaigns/types/campaign.types";
import { FiMapPin, FiClock, FiArrowRight } from "react-icons/fi";

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

function getProgress(raised: number, goal: number): number {
  if (!goal) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

function getDaysLeft(endDate: string | null): number | null {
  if (!endDate) return null;
  const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

export default async function CampaignListSection() {
  let campaigns: Campaign[] = [];
  try {
    const data = await getCampaigns();
    campaigns = data.campaigns;
  } catch (err) {
    console.error("❌ CampaignListSection error:", err);
  }

  return (
    <section className="bg-[#f5f5f5] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#D2252B] text-xs font-bold tracking-[0.2em] uppercase mb-3">Make an Impact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-black">
            Join Our Campaigns
          </h2>
          <p className="text-gray-500 text-base mt-3 max-w-xl mx-auto">
            Every donation counts. Browse active campaigns and be part of positive change.
          </p>
        </div>

        {campaigns.length === 0 && (
          <p className="text-center text-gray-500 py-10">No campaigns available</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {campaigns.map((item) => {
            const progress = getProgress(item.raisedAmount, item.goalAmount);
            const daysLeft = getDaysLeft(item.endDate);
            const validImage = isValidUrl(item.image);
            const donorCount = item.donations?.length ?? 0;
            const productCount = item.campaignProducts?.length ?? 0;

            return (
              <Link key={item.id} href={`/campaigns/${item.id}`} className="block group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full flex flex-col">

                  {/* Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
                    {validImage ? (
                      <Image src={item.image!} alt={item.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}

                    {/* Cause badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur text-[#D2252B] text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {item.cause?.name || "General"}
                      </span>
                    </div>

                    {/* Days left badge */}
                    {daysLeft !== null && (
                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          daysLeft <= 5 ? "bg-red-500 text-white" : "bg-black/60 text-white"
                        }`}>
                          {daysLeft === 0 ? "Ending today" : `${daysLeft}d left`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#D2252B] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <FiMapPin size={11} /> {item.location}
                        </span>
                      )}
                      {donorCount > 0 && (
                        <span className="flex items-center gap-1">
                          {donorCount} donor{donorCount !== 1 ? "s" : ""}
                        </span>
                      )}
                      {productCount > 0 && (
                        <span className="flex items-center gap-1">
                          {productCount} product{productCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-gray-700">₹{item.raisedAmount.toLocaleString("en-US")} raised</span>
                        <span className="text-[#D2252B]">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-2 bg-[#D2252B] rounded-full transition-all"
                          style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Goal: ₹{item.goalAmount.toLocaleString("en-US")}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-bold text-[#D2252B] flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        Donate Now <FiArrowRight size={14} />
                      </span>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        item.status === "APPROVED" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {item.status === "APPROVED" ? "Active" : item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link href="/campaigns"
            className="inline-flex items-center gap-2 border-2 border-black text-black px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all">
            View All Campaigns <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}