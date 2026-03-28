import Image from "next/image";
import { getCampaigns } from "@/features/campaigns/api/campaign.api";
import { Campaign } from "@/features/campaigns/types/campaign.types";

// ✅ Safe image check
function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

// ✅ Progress percentage
function getProgress(raised: number, goal: number): number {
  if (!goal) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
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
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <p className="text-[#D2252B] text-sm mb-2">Our Campaigns</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-black">
            Join Our Campaigns And <br />
            Be A Part Of Positive Change
          </h2>
        </div>

        {/* EMPTY */}
        {campaigns.length === 0 && (
          <p className="text-center text-gray-500 py-10">No campaigns available</p>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {campaigns.map((item) => {
            const progress = getProgress(item.raisedAmount, item.goalAmount);
            const validImage = isValidUrl(item.image);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition"
              >
                {/* CAUSE TAG */}
                <p className="text-sm text-[#D2252B] mb-2">
                  • {item.cause?.name || "General"}
                </p>

                {/* TITLE */}
                <h3 className="text-lg font-semibold text-black mb-4">
                  {item.title}
                </h3>

                {/* IMAGE */}
                <div className="relative">
                  {validImage ? (
                    <Image
                      src={item.image as string}
                      alt={item.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}

                  {/* PROGRESS OVERLAY */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white rounded-md px-3 py-2 shadow">
                    <div className="flex justify-between text-xs mb-1">
                      <span>₹{item.raisedAmount.toLocaleString()} raised</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded">
                      <div
                        className="h-1 bg-[#D2252B] rounded transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* DESC */}
                <p className="text-sm text-gray-500 mt-4 line-clamp-2">
                  {item.description}
                </p>

                {/* LOCATION + DATE */}
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>📍 {item.location}</span>
                  <span>Goal: ₹{item.goalAmount.toLocaleString()}</span>
                </div>

                {/* BUTTON */}
                <button className="mt-4 text-[#D2252B] text-sm font-medium hover:underline">
                  Donate Now ↗
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}