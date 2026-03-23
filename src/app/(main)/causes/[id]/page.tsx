import BlogSection from "@/components/common/BlogSection";
import DonationGallery from "@/components/common/DonationGallery";
import FaqSection from "@/components/common/FaqSection";
import { causes } from "@/constants/causes";
import Image from "next/image";

export default async function CauseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cause = causes.find((c) => c.id === Number(id));

  if (!cause) return <div>Cause not found</div>;

  const progress = (cause.raised / cause.goal) * 100;

  return (
    <div className="bg-[#F5F5F5]">

      {/* ================= HERO SECTION ================= */}
      <div className="text-center py-16 border-b border-gray-200">
        <p className="text-sm text-gray-500 mb-8">
          Home &gt; Causes
        </p>

        <h1 className="text-4xl font-bold text-black mb-4">
          Donate Today: Save a Life
        </h1>

        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          Libero dictum ut purus ut vel sit egestas. Ut ac mattis senectus ac
          suspendisse vitae vel nulla eleifend. Est eros facilisi aenean nisl a.
          Vitae et fusce purus consectetur.
        </p>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

          {/* ================= LEFT ================= */}
          <div className="md:col-span-2">

            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-black mb-6">
              {cause.title}
            </h2>

            {/* IMAGE */}
            <Image
              src={cause.image}
              alt={cause.title}
              width={800}
              height={400}
              className="w-full h-[350px] object-cover rounded-xl"
            />

            {/* PROGRESS */}
            <div className="mt-6">
              <div className="w-full h-3 bg-gray-200 rounded">
                <div
                  className="h-3 bg-[#D2252B] rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Goal: ₹{cause.goal}</span>
                <span>{cause.donations} donations</span>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8 text-gray-700 space-y-4">
              <p>{cause.description}</p>
              <p>
                Help children rise out of poverty by supporting this cause.
                Your contribution can make a real difference.
              </p>
            </div>

            {/* ================= DONATION BOX ================= */}
            <div className="mt-10 bg-white p-6 rounded-xl shadow text-black">

              <h3 className="font-semibold mb-4">Donation Amount</h3>

              <div className="flex flex-wrap gap-2 mb-4">
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

              <h4 className="font-medium mb-2">Select Payment Method</h4>

              <div className="flex gap-4 mb-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" defaultChecked />
                  Credit Card
                </label>

                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" />
                  PayPal
                </label>
              </div>

              <input
                placeholder="Credit Card Number"
                className="input mb-4"
              />

              <h4 className="font-medium mb-2">Personal Information</h4>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <input placeholder="First Name" className="input" />
                <input placeholder="Last Name" className="input" />
              </div>

              <input placeholder="Email Address" className="input mb-4" />

              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  Donation Total:{" "}
                  <span className="text-[#D2252B]">₹600</span>
                </span>

                <button className="bg-[#D2252B] text-white px-5 py-2 rounded-full text-sm">
                  Donate Now
                </button>
              </div>
            </div>

            {/* EXTRA CONTENT */}
            <div className="mt-10 space-y-6 text-gray-700">
              <h3 className="text-xl font-semibold">
                Vivamus a dignissim nulla
              </h3>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <h3 className="text-xl font-semibold">
                Pharetra malesuada velit
              </h3>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <Image
                src="/assets/c2.jpg"
                alt="extra"
                width={800}
                height={400}
                className="rounded-xl"
              />
            </div>
            <DonationGallery />
<FaqSection />

          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="space-y-6 text-black">

            {/* SEARCH */}
            <input
              placeholder="Search..."
              className="input w-full"
            />

            {/* CATEGORIES */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h4 className="font-semibold mb-3">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Clean Water (3)</li>
                <li>Education (6)</li>
                <li>Ecology (4)</li>
                <li>Ending Hunger (8)</li>
                <li>Health Care (8)</li>
                <li>Local communities (3)</li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h4 className="font-semibold mb-3">
                Subscribe to our newsletter
              </h4>

              <input
                placeholder="Enter your email"
                className="input mb-3"
              />

              <button className="w-full bg-[#D2252B] text-white py-2 rounded">
                SUBSCRIBE
              </button>
            </div>

            {/* URGENT CAUSES */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h4 className="font-semibold mb-4">Urgent Causes</h4>

              {causes.slice(0, 3).map((item) => (
                <div key={item.id} className="flex gap-3 mb-3">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={60}
                    height={60}
                    className="rounded"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      {item.title}
                    </p>
                    <span className="text-xs text-gray-500">
                      View Details
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ================= BLOG ================= */}
      <BlogSection />

    </div>
  );
}