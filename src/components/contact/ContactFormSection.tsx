"use client";

import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { sendContactForm } from "@/features/contact/api/contact.api";
import { ContactFormData } from "@/features/contact/types/contact.types";

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    try {
      setLoading(true);

      await sendContactForm(formData);

      setSuccess("Message sent successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

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

            <div className="flex gap-4 mt-8">
              <FaFacebookF className="cursor-pointer hover:text-[#D2252B]" />
              <FaXTwitter className="cursor-pointer hover:text-[#D2252B]" />
              <FaInstagram className="cursor-pointer hover:text-[#D2252B]" />
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="p-8 md:p-10 bg-white">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="input"
                required
              />

              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="input"
                required
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="input"
                required
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="input"
              />

              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="input md:col-span-2"
                required
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows={5}
                className="input md:col-span-2"
                required
              />

              {/* STATUS MESSAGES */}
              {success && (
                <p className="text-green-600 text-sm md:col-span-2">
                  {success}
                </p>
              )}

              {error && (
                <p className="text-red-500 text-sm md:col-span-2">
                  {error}
                </p>
              )}

              {/* BUTTON */}
              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#D2252B] text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition w-full disabled:opacity-50"
                >
                  {loading ? "Sending..." : "SEND MESSAGE"}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}