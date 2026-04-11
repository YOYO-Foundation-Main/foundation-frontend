// src/components/profile/KYCModal.tsx

"use client";
import { useState, useRef, useEffect } from "react";
import { FiX, FiUpload, FiTrash2, FiCheck, FiShield, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { uploadUserKyc, uploadCampaignKyc } from "@/features/auth/api/user.api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaigns?: { id: number; title: string }[];
  onSuccess?: () => void;
}

const USER_DOC_TYPES = ["PAN", "AADHAAR", "PASSPORT", "VOTER_ID", "DRIVING_LICENSE"];
const CAMPAIGN_DOC_TYPES = ["Aadhaar", "PAN", "Passport", "Voter ID", "Driving License"];

export default function KYCModal({ isOpen, onClose, campaigns = [], onSuccess }: Props) {
  const [step, setStep] = useState<1 | 2>(1); // Step 1 = User KYC, Step 2 = Campaign KYC
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const [success, setSuccess] = useState(false);
  const [userKycCompleted, setUserKycCompleted] = useState(false);

  // Step 1: User KYC fields
  const [userDocType, setUserDocType] = useState("PAN");
  const [userFile, setUserFile] = useState<File | null>(null);
  const [userPreview, setUserPreview] = useState<string | null>(null);
  const userFileRef = useRef<HTMLInputElement>(null);

  // Step 2: Campaign KYC fields
  const [campaignId, setCampaignId] = useState("");
  const [campaignDocType, setCampaignDocType] = useState("Aadhaar");
  const [campaignFile, setCampaignFile] = useState<File | null>(null);
  const [campaignPreview, setCampaignPreview] = useState<string | null>(null);
  const campaignFileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 4000);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (p: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const reset = () => {
    setStep(1);
    setUserKycCompleted(false);
    setUserFile(null);
    setUserPreview(null);
    setUserDocType("PAN");
    setCampaignFile(null);
    setCampaignPreview(null);
    setCampaignDocType("Aadhaar");
    setCampaignId("");
    setSuccess(false);
    setToast({ msg: "", type: "" });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // ── Step 1: Submit User KYC ────────────────────────────────────────────────
  const handleUserKyc = async () => {
    if (!userFile) {
      showToast("Please upload a document", "error");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("documentType", userDocType);
      fd.append("document", userFile);
      fd.append("type", "CAMPAIGNER");

      await uploadUserKyc(fd);
      
      // Mark step 1 as completed and move to step 2
      setUserKycCompleted(true);
      setStep(2);
      showToast("User KYC uploaded successfully! Now upload beneficiary KYC.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload KYC", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Submit Campaign KYC ────────────────────────────────────────────
  const handleCampaignKyc = async () => {
    if (!campaignId) {
      showToast("Please select a campaign", "error");
      return;
    }
    if (!campaignFile) {
      showToast("Please upload a document", "error");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("document", campaignFile);
      fd.append("documentType", campaignDocType);
      fd.append("type", "BENEFICIARY");

      await uploadCampaignKyc(Number(campaignId), fd);
      
      // Both steps complete → show success screen
      setSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      showToast(err.message || "Failed to upload campaign KYC", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ── Success screen (after both steps) ──────────────────────────────────────
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <FiCheck size={28} className="text-green-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">KYC Submitted!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Both documents have been submitted for verification. We'll update your KYC status within 24–48 hours.
          </p>
          <button
            onClick={handleClose}
            className="w-full bg-[#D2252B] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
              <FiShield size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">KYC Verification</h2>
              <p className="text-xs text-gray-400">
                Step {step} of 2: {step === 1 ? "Campaigner KYC" : "Beneficiary KYC"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-1 rounded-full transition ${step >= 1 ? "bg-green-500" : "bg-gray-200"}`} />
            <div className={`flex-1 h-1 rounded-full transition ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
            <span className={step >= 1 ? "text-green-600 font-medium" : ""}>Campaigner KYC</span>
            <span className={step >= 2 ? "text-green-600 font-medium" : ""}>Beneficiary KYC</span>
          </div>
        </div>

        {/* Toast */}
        {toast.msg && (
          <div className={`mx-6 mt-4 px-4 py-2 rounded-xl text-sm text-center font-medium ${
            toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>
            {toast.msg}
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* ── STEP 1: USER/CAMPAIGNER KYC ── */}
          {step === 1 && (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-600">
                <span className="font-semibold">Step 1/2:</span> Submit your own identity proof to get verified as a campaigner. Accepted: PAN, Aadhaar, Passport.
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={userDocType}
                  onChange={(e) => setUserDocType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] text-gray-700 transition"
                >
                  {USER_DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Upload Document <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => userFileRef.current?.click()}
                    className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-200 shrink-0"
                  >
                    {userPreview ? (
                      <img src={userPreview} alt="doc" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <FiUpload size={18} className="text-gray-400" />
                        <span className="text-[9px] text-gray-400 mt-1">Upload</span>
                      </>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => userFileRef.current?.click()}
                      className="px-4 py-2 bg-[#D2252B] text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                      {userFile ? "Change File" : "Choose File"}
                    </button>
                    {userFile && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 truncate max-w-[140px]">{userFile.name}</span>
                        <button onClick={() => { setUserFile(null); setUserPreview(null); }}>
                          <FiTrash2 size={11} className="text-red-400" />
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, PDF · Max 5MB</p>
                    <input
                      ref={userFileRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setUserFile, setUserPreview)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: CAMPAIGN/BENEFICIARY KYC ── */}
          {step === 2 && (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-600">
                <span className="font-semibold">Step 2/2:</span> Submit beneficiary's identity proof for a specific campaign. This verifies who will receive the funds.
              </div>

              {/* Campaign selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Select Campaign <span className="text-red-500">*</span>
                </label>
                {campaigns.length === 0 ? (
                  <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3 border border-gray-200">
                    No campaigns found. Create a campaign first.
                  </p>
                ) : (
                  <select
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] text-gray-700 transition"
                  >
                    <option value="">Select a campaign</option>
                    {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                )}
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={campaignDocType}
                  onChange={(e) => setCampaignDocType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] text-gray-700 transition"
                >
                  {CAMPAIGN_DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Upload Beneficiary Document <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => campaignFileRef.current?.click()}
                    className="w-24 h-20 rounded-xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition border-2 border-dashed border-gray-200 shrink-0"
                  >
                    {campaignPreview ? (
                      <img src={campaignPreview} alt="doc" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <FiUpload size={18} className="text-gray-400" />
                        <span className="text-[9px] text-gray-400 mt-1">Upload</span>
                      </>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => campaignFileRef.current?.click()}
                      className="px-4 py-2 bg-[#D2252B] text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                      {campaignFile ? "Change File" : "Choose File"}
                    </button>
                    {campaignFile && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 truncate max-w-[140px]">{campaignFile.name}</span>
                        <button onClick={() => { setCampaignFile(null); setCampaignPreview(null); }}>
                          <FiTrash2 size={11} className="text-red-400" />
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, PDF · Max 5MB</p>
                    <input
                      ref={campaignFileRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setCampaignFile, setCampaignPreview)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer with navigation buttons */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition"
            >
              <FiArrowLeft size={14} /> Back
            </button>
          )}
          <div className="flex-1" />
          <button onClick={handleClose} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition">
            Cancel
          </button>
          <button
            onClick={step === 1 ? handleUserKyc : handleCampaignKyc}
            disabled={loading || (step === 2 && campaigns.length === 0)}
            className={`flex items-center gap-1.5 px-6 py-2 rounded-xl text-sm font-semibold transition ${
              loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#D2252B] hover:bg-red-700 text-white"
            }`}
          >
            {loading ? "Uploading..." : step === 1 ? "Continue →" : "Submit KYC"}
            {step === 1 && !loading && <FiArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}