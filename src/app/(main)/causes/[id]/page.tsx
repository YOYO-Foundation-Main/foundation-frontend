import BlogSection from "@/components/common/BlogSection";
import DonationGallery from "@/components/common/DonationGallery";
import FaqSection from "@/components/common/FaqSection";
import { getCauseById } from "@/features/causes/api/causes.api";
import Image from "next/image";

export default async function CauseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ Next.js 15 — must be Promise
}) {
  const { id } = await params; // ✅ must await

  let cause: any = null;

  try {
    cause = await getCauseById(id);
  } catch (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <p className="text-gray-500">Failed to load this cause.</p>
      </div>
    );
  }

  if (!cause?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <p className="text-gray-500">Cause not found.</p>
      </div>
    );
  }

  const safeImage = cause.image || "/fallback.jpg";

  return (
    <div className="bg-[#F5F5F5]">

      {/* HERO */}
      <div className="text-center py-16 border-b border-gray-200 mt-15">
        <p className="text-sm text-gray-500 mb-4">Home &gt; Causes</p>
        <h1 className="text-4xl font-bold text-black mb-4">{cause.name}</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">{cause.description}</p>
      </div>

      {/* MAIN */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="md:col-span-2">

            <h2 className="text-2xl text-black font-semibold mb-6">{cause.name}</h2>

            <Image
              src={safeImage}
              alt={cause.name}
              width={800}
              height={400}
              className="w-full h-[350px] object-cover rounded-xl"
            />

            <div className="mt-8 text-gray-700 space-y-4">
              <p>{cause.description}</p>
            </div>

            {/* Donation Box */}
            <div className="mt-10 bg-white p-6 rounded-xl shadow text-black">
              <h3 className="font-semibold mb-4">Donation Amount</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {[10, 25, 50, 100, 500].map((amt) => (
                  <button
                    key={amt}
                    className="px-4 py-2 border rounded text-sm hover:bg-[#D2252B] hover:text-white transition"
                  >
                    ₹{amt}
                  </button>
                ))}
                <button className="px-4 py-2 bg-[#D2252B] text-white rounded text-sm">
                  CUSTOM AMOUNT
                </button>
              </div>

              <h4 className="font-medium mb-3">Personal Information</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input placeholder="First Name" className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400" />
                <input placeholder="Last Name" className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400" />
              </div>
              <input
                placeholder="Email Address"
                className="border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 w-full mb-4"
              />

              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  Donation Total: <span className="text-[#D2252B]">₹0</span>
                </span>
                <button className="bg-[#D2252B] text-white px-5 py-2 rounded-full text-sm hover:bg-red-700 transition">
                  Donate Now
                </button>
              </div>
            </div>

            <DonationGallery />
            <FaqSection />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6 text-black">
            <input
              placeholder="Search..."
              className="border border-gray-200 rounded px-3 py-2 text-sm outline-none w-full focus:border-[#D2252B]"
            />

            <div className="bg-white p-5 rounded-xl shadow">
              <h4 className="font-semibold mb-3">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {["Clean Water (3)", "Education (6)", "Ecology (4)", "Ending Hunger (8)", "Health Care (8)", "Local communities (3)"].map((cat) => (
                  <li key={cat} className="cursor-pointer hover:text-[#D2252B] transition">{cat}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h4 className="font-semibold mb-3">Subscribe to our newsletter</h4>
              <input
                placeholder="Enter your email"
                className="border border-gray-200 rounded px-3 py-2 text-sm outline-none w-full mb-3"
              />
              <button className="w-full bg-[#D2252B] text-white py-2 rounded text-sm hover:bg-red-700 transition">
                SUBSCRIBE
              </button>
            </div>
          </div>

        </div>
      </div>

      <BlogSection />
    </div>
  );
}
