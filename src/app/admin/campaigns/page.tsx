import Image from "next/image";
import { getCampaigns } from "@/features/campaigns/api/campaign.api";
import { Campaign } from "@/features/campaigns/types/campaign.types";

// ✅ SAFE IMAGE CHECK
function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default async function AdminCampaignsPage() {
  let campaigns: Campaign[] = [];

  try {
    const data = await getCampaigns();
    campaigns = data.campaigns;
  } catch (err) {
    console.error("Failed to fetch campaigns:", err);
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl text-black font-semibold">Campaigns</h1>
        <p className="text-sm text-gray-500">Admin / Campaigns</p>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="col-span-8 bg-white rounded-xl border p-4">

          <div className="space-y-3">
            {campaigns.map((item) => {

              const progress = item.goalAmount
                ? Math.min(
                    Math.round((item.raisedAmount / item.goalAmount) * 100),
                    100
                  )
                : 0;

              const daysLeft = Math.max(
                0,
                Math.ceil(
                  (new Date(item.endDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              );

              const validImage = isValidUrl(item.image);

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50"
                >
                  {/* ✅ SAFE IMAGE */}
                  {validImage ? (
                    <Image
                      src={item.image as string}
                      alt={item.title}
                      width={70}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-[70px] h-[50px] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* INFO */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">
                      {item.cause?.name || "General"}
                    </p>

                    <h3 className="font-medium">{item.title}</h3>

                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span>
                        ₹{item.raisedAmount} / ₹{item.goalAmount}
                      </span>
                      <span>{daysLeft} days left</span>
                    </div>

                    {/* PROGRESS */}
                    <div className="w-full h-1 bg-gray-200 rounded mt-2">
                      <div
                        className="h-1 bg-blue-500 rounded"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* STATUS */}
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600">
                    {(item as any).status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-4 bg-white rounded-xl border p-4">
          <h2 className="font-semibold text-black mb-3">Campaign Details</h2>
          <p className="text-sm text-gray-500">
            Select a campaign to view details
          </p>
        </div>

      </div>
    </div>
  );
}