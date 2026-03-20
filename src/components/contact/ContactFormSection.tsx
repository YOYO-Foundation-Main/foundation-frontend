"use client";

import { FaPhoneAlt, FaEnvelope, FaClock, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ContactSection() {
  return (
    <section className="bg-[#F5F5F5] py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        <div className="grid md:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-sm">

          {/* LEFT SIDE */}
          <div className="bg-black text-white p-8 md:p-10 flex flex-col justify-between">

            <div>
              <h3 className="text-2xl font-semibold mb-4 leading-snug">
                Share love,<br /> donate hope.
              </h3>

              <p className="text-gray-300 text-sm mb-6">
                Ut ac mattis senectus ac suspendisse vitae vel nulla eleifend.
              </p>

              <p className="text-sm mb-6">
                891 Tanglewood Ave,<br />
                Capitol Heights, MD 20743
              </p>

              <div className="space-y-3 text-sm">

                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-[#D2252B]" />
                  <span>+863-267-3634</span>
                </div>

                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-[#D2252B]" />
                  <span>charity@email.net</span>
                </div>

                <div className="flex items-center gap-3">
                  <FaClock className="text-[#D2252B]" />
                  <span>Mon-Fri: 8:00am - 6:00pm</span>
                </div>

              </div>
            </div>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-8">
              <FaFacebookF className="cursor-pointer hover:text-[#D2252B]" />
              <FaXTwitter className="cursor-pointer hover:text-[#D2252B]" />
              <FaInstagram className="cursor-pointer hover:text-[#D2252B]" />
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="p-8 md:p-10 bg-white">

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* First Name */}
              <input
                type="text"
                placeholder="First Name"
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-[#D2252B]"
              />

              {/* Last Name */}
              <input
                type="text"
                placeholder="Last Name"
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-[#D2252B]"
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-[#D2252B]"
              />

              {/* Phone */}
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-[#D2252B]"
              />

              {/* Subject */}
              <input
                type="text"
                placeholder="Subject"
                className="md:col-span-2 w-full border border-gray-200 rounded-md px-4 py-3 text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-[#D2252B]"
              />

              {/* Message */}
              <textarea
                placeholder="Message"
                rows={5}
                className="md:col-span-2 w-full border border-gray-200 rounded-md px-4 py-3 text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:border-[#D2252B]"
              />

              {/* Button */}
              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="bg-[#D2252B] text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                  SEND MESSAGE
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}