

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Building2, FileText, Users, Landmark, CheckCircle2,
//   Loader2, AlertCircle, X, CheckCircle, Upload, ChevronRight,
//   Globe, Instagram, Facebook, Linkedin, MapPin, Phone, Mail,
//   Hash, CreditCard, Banknote, User, Briefcase
// } from "lucide-react";
// import {
//   createNgo,
//   uploadNgoDocument,
//   addNgoRepresentative,
//   addNgoBank,
//   submitNgoVerification,
// } from "@/features/auth/api/ngo.api";
// // ─── Toast Types ───────────────────────────────────────────────────────────

// type ToastType = "success" | "error" | "info";

// interface ToastItem {
//   id: number;
//   message: string;
//   type: ToastType;
// }

// interface ToastProps {
//   toasts: ToastItem[];
//   removeToast: (id: number) => void;
// }

// // ─── Toast System ───────────────────────────────────────────────────────────

// function Toast({
//   toasts,
//   removeToast,
// }: ToastProps) {
//   return (
//     <div className="fixed top-4 right-4 z-50 flex min-w-[320px] max-w-sm flex-col gap-2">
//       {toasts.map((t) => (
//         <div
//           key={t.id}
//           className={`animate-in slide-in-from-right-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg duration-300
          
//           ${t.type === "error"
//               ? "border-red-200 bg-red-50 text-red-800"
//               : t.type === "success"
//                 ? "border-green-200 bg-green-50 text-green-800"
//                 : "border-blue-200 bg-blue-50 text-blue-800"
//             }`}
//         >
//           {t.type === "error" ? (
//             <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
//           ) : t.type === "success" ? (
//             <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
//           ) : (
//             <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
//           )}

//           <span className="flex-1">
//             {t.message}
//           </span>

//           <button
//             onClick={() => removeToast(t.id)}
//             className="text-gray-400 transition-colors hover:text-gray-600"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// function useToast() {
//   const [toasts, setToasts] = useState([]);
//   const add = (message, type = "info") => {
//     const id = Date.now();
//     setToasts(p => [...p, { id, message, type }]);
//     setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
//   };
//   const remove = (id) => setToasts(p => p.filter(t => t.id !== id));
//   return { toasts, toast: { error: m => add(m, "error"), success: m => add(m, "success"), info: m => add(m, "info") }, removeToast: remove };
// }

// // ─── Field Components ────────────────────────────────────────────────────────
// function Field({ label, required, children, error }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-sm font-semibold text-gray-700">
//         {label}{required && <span className="text-[#D2252B] ml-1">*</span>}
//       </label>
//       {children}
//       {error && (
//         <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
//           <AlertCircle className="h-3 w-3" />{error}
//         </p>
//       )}
//     </div>
//   );
// }

// function Input({ icon: Icon, error, ...props }) {
//   return (
//     <div className="relative">
//       {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />}
//       <input
//         {...props}
//         className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition
//           focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10
//           ${error ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}
//           ${Icon ? "pl-10" : ""}`}
//       />
//     </div>
//   );
// }

// function Textarea({ error, ...props }) {
//   return (
//     <textarea
//       {...props}
//       className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition resize-none
//         focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10
//         ${error ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
//     />
//   );
// }

// function Select({ error, children, ...props }) {
//   return (
//     <select
//       {...props}
//       className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition appearance-none cursor-pointer
//         focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10
//         ${error ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
//     >
//       {children}
//     </select>
//   );
// }

// // ─── Progress Stepper ────────────────────────────────────────────────────────
// const STEPS = [
//   { id: 1, title: "NGO Details", icon: Building2 },
//   { id: 2, title: "Documents", icon: FileText },
//   { id: 3, title: "Representatives", icon: Users },
//   { id: 4, title: "Bank Details", icon: Landmark },
//   { id: 5, title: "Review & Submit", icon: CheckCircle2 },
// ];

// const NGO_DOCS = [
//   { label: "NGO PAN", type: "NGO_PAN", required: true },
//   { label: "Trust Certificate", type: "TRUST_CERTIFICATE" },
//   { label: "Society Certificate", type: "SOCIETY_CERTIFICATE" },
//   { label: "Section 8 Certificate", type: "SECTION8_CERTIFICATE" },
//   { label: "12A Certificate", type: "CERTIFICATE_12A" },
//   { label: "80G Certificate", type: "CERTIFICATE_80G" },
//   { label: "Darpan Certificate", type: "DARPAN_CERTIFICATE" },
//   { label: "Event Photos", type: "EVENT_PHOTOS" },
//   { label: "Project Report", type: "PROJECT_REPORT" },
//   { label: "Annual Report", type: "ANNUAL_REPORT" },
//   { label: "Press Coverage", type: "PRESS_COVERAGE" },
// ];

// // ─── Main Component ──────────────────────────────────────────────────────────
// export default function NgoRegisterPage() {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const { toasts, toast, removeToast } = useToast();
//   const [ngoId, setNgoId] = useState<number | null>(null);
//   const [ngoData, setNgoData] = useState({
//     ngoName: "", registrationType: "TRUST", registrationNumber: "",
//     panNumber: "", darpanId: "", email: "", mobile: "",
//     website: "", instagram: "", facebook: "", linkedin: "",
//     address: "", district: "", state: "", pincode: "",
//     about: "", mission: "", vision: "",
//   });

//   const [representative, setRepresentative] = useState({
//     fullName: "", designation: "", mobile: "", email: "",
//   });

//   const [bankData, setBankData] = useState({
//     accountHolderName: "", accountNumber: "", ifscCode: "", bankName: "", branchName: "",
//   });

//   const [documents, setDocuments] = useState({});
//   const [cancelledCheque, setCancelledCheque] = useState(null);
//   const [declarationAccepted, setDeclarationAccepted] = useState(false);

//   const setField = (setter) => (key) => (e) => setter(p => ({ ...p, [key]: e.target.value }));
//   const setNgo = setField(setNgoData);
//   const setRep = setField(setRepresentative);
//   const setBank = setField(setBankData);

//   const clearError = (key) => setErrors(p => { const n = { ...p }; delete n[key]; return n; });

//   // ── Validators ──
//   const validateStep1 = () => {
//     const e = {};
//     if (!ngoData.ngoName.trim()) e.ngoName = "NGO name is required";
//     if (!ngoData.registrationNumber.trim()) e.registrationNumber = "Registration number is required";
//     if (!ngoData.panNumber.trim()) e.panNumber = "PAN number is required";
//     else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(ngoData.panNumber.toUpperCase())) e.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
//     if (!ngoData.email.trim()) e.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(ngoData.email)) e.email = "Enter a valid email address";
//     if (!ngoData.mobile.trim()) e.mobile = "Mobile number is required";
//     else if (!/^[6-9]\d{9}$/.test(ngoData.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
//     if (!ngoData.address.trim()) e.address = "Address is required";
//     if (!ngoData.district.trim()) e.district = "District is required";
//     if (!ngoData.state.trim()) e.state = "State is required";
//     if (!ngoData.pincode.trim()) e.pincode = "Pincode is required";
//     else if (!/^\d{6}$/.test(ngoData.pincode)) e.pincode = "Enter a valid 6-digit pincode";
//     if (!ngoData.about.trim()) e.about = "Please write about your NGO";
//     return e;
//   };

//   const validateStep3 = () => {
//     const e = {};
//     if (!representative.fullName.trim()) e.repFullName = "Full name is required";
//     if (!representative.designation.trim()) e.repDesignation = "Designation is required";
//     if (!representative.mobile.trim()) e.repMobile = "Mobile is required";
//     else if (!/^[6-9]\d{9}$/.test(representative.mobile)) e.repMobile = "Enter a valid mobile number";
//     if (!representative.email.trim()) e.repEmail = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(representative.email)) e.repEmail = "Enter a valid email";
//     return e;
//   };

//   const validateStep4 = () => {
//     const e = {};
//     if (!bankData.accountHolderName.trim()) e.accountHolderName = "Account holder name is required";
//     if (!bankData.accountNumber.trim()) e.accountNumber = "Account number is required";
//     if (!bankData.ifscCode.trim()) e.ifscCode = "IFSC code is required";
//     else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankData.ifscCode.toUpperCase())) e.ifscCode = "Invalid IFSC format";
//     if (!bankData.bankName.trim()) e.bankName = "Bank name is required";
//     if (!bankData.branchName.trim()) e.branchName = "Branch name is required";
//     if (!cancelledCheque) e.cancelledCheque = "Cancelled cheque is required";
//     return e;
//   };

//   const handleCreateNgo = async () => {
//     const e = validateStep1();

//     if (Object.keys(e).length) {
//       setErrors(e);

//       toast.error(
//         "Please fix the errors before continuing"
//       );

//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await createNgo({
//         ngoName: ngoData.ngoName,
//         registrationType:
//           ngoData.registrationType,
//         registrationNumber:
//           ngoData.registrationNumber,
//         panNumber:
//           ngoData.panNumber.toUpperCase(),
//         darpanId: ngoData.darpanId,
//         email: ngoData.email,
//         mobile: ngoData.mobile,
//         website: ngoData.website,
//         instagram: ngoData.instagram,
//         facebook: ngoData.facebook,
//         linkedin: ngoData.linkedin,
//         address: ngoData.address,
//         district: ngoData.district,
//         state: ngoData.state,
//         pincode: ngoData.pincode,
//         about: ngoData.about,
//         mission: ngoData.mission,
//         vision: ngoData.vision,
//       });

//       console.log(response);
//       setNgoId(response.data.id);
//       toast.success(
//         "NGO details saved successfully!"
//       );

//       setStep(2);
//     } catch (error: any) {
//       console.error(error);

//       toast.error(
//         error?.message ||
//         "Failed to create NGO"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadDocument = async (
//     type: string,
//     file: File
//   ) => {
//     try {
//       const formData = new FormData();

//       formData.append("document", file);

//       formData.append("type", type);

//       formData.append("ngoId", String(ngoId));

//       await uploadNgoDocument(formData);

//       setDocuments((prev) => ({
//         ...prev,
//         [type]: file.name,
//       }));

//       toast.success(
//         `${file.name} uploaded successfully`
//       );
//     } catch (error: any) {
//       toast.error(
//         error?.message ||
//         "Failed to upload document"
//       );
//     }
//   };

//   const handleAddRepresentative =
//     async () => {
//       const e = validateStep3();

//       if (Object.keys(e).length) {
//         setErrors(e);

//         toast.error(
//           "Please fill all required fields"
//         );

//         return;
//       }

//       try {
//         setLoading(true);

//         await addNgoRepresentative({
//           ngoId,
//           fullName:
//             representative.fullName,
//           designation:
//             representative.designation,
//           mobile:
//             representative.mobile,
//           email:
//             representative.email,
//         });

//         toast.success(
//           "Representative added successfully!"
//         );

//         setStep(4);
//       } catch (error: any) {
//         toast.error(
//           error?.message ||
//           "Failed to add representative"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//   const handleAddBank = async () => {
//     try {
//       const e = validateStep4();

//       if (Object.keys(e).length) {
//         setErrors(e);
//         toast.error("Please complete all bank details");
//         return;
//       }

//       setLoading(true);

//       const formData = new FormData();

//       formData.append(
//         "ngoId",
//         String(ngoId)
//       );

//       formData.append(
//         "accountHolderName",
//         bankData.accountHolderName
//       );

//       formData.append(
//         "accountNumber",
//         bankData.accountNumber
//       );

//       formData.append(
//         "ifscCode",
//         bankData.ifscCode
//       );

//       formData.append(
//         "bankName",
//         bankData.bankName
//       );

//       formData.append(
//         "branchName",
//         bankData.branchName
//       );
//       if (cancelledCheque) {
//         formData.append(
//           "document",
//           cancelledCheque
//         );
//       }

//       console.log(
//         "FILE BEFORE API:",
//         cancelledCheque
//       );

//       const res = await addNgoBank(formData);

//       console.log(res);

//       toast.success(
//         "Bank details saved successfully!"
//       );

//       setStep(5);
//     } catch (error: any) {
//       console.error(error);

//       toast.error(
//         error.message ||
//         "Failed to save bank details"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitNgo = async () => {
//     if (!declarationAccepted) {
//       toast.error(
//         "Please accept declaration"
//       );

//       return;
//     }

//     try {
//       setLoading(true);
      
//       await submitNgoVerification({
//         ngoId,
//         declarationAccepted: true,
//       });

//       toast.success(
//         "NGO verification submitted successfully!"
//       );
//     } catch (error: any) {
//       toast.error(
//         error?.message ||
//         "Failed to submit NGO"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const progress = ((step - 1) / (STEPS.length - 1)) * 100;

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       <Toast toasts={toasts} removeToast={removeToast} />

//       {/* ── Header ── */}
//       <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
//         <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center gap-4">
//           <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#D2252B] text-white shrink-0">
//             <Building2 className="h-5 w-5" />
//           </div>
//           <div>
//             <h1 className="text-lg font-bold text-gray-900 leading-tight">NGO Registration</h1>
//             <p className="text-xs text-gray-500">Complete all steps to verify your NGO</p>
//           </div>
//           <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
//             <span className="font-semibold text-[#D2252B]">Step {step}</span>
//             <span>of {STEPS.length}</span>
//           </div>
//         </div>
//       </header>

//       {/* ── Stepper ── */}
//       <div className="bg-white border-b border-gray-100">
//         <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5">
//           {/* Progress bar */}
//           <div className="relative mb-5">
//             <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-gradient-to-r from-[#D2252B] to-[#e84d52] rounded-full transition-all duration-500"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>
//           {/* Steps */}
//           <div className="flex items-start overflow-x-auto gap-1 pb-1 scrollbar-hide">
//             {STEPS.map((s, i) => {
//               const Icon = s.icon;
//               const done = step > s.id;
//               const active = step === s.id;
//               return (
//                 <div key={s.id} className="flex items-center gap-1 shrink-0">
//                   <button
//                     onClick={() => done && setStep(s.id)}
//                     className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all
//                       ${active ? "bg-[#D2252B] text-white shadow-sm shadow-[#D2252B]/30" :
//                         done ? "bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer" :
//                           "bg-gray-50 text-gray-400 cursor-default"}`}
//                   >
//                     <span className={`flex items-center justify-center h-5 w-5 rounded-full text-xs
//                       ${active ? "bg-white/20" : done ? "bg-green-200 text-green-800" : "bg-gray-200"}`}>
//                       {done ? <CheckCircle2 className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
//                     </span>
//                     <span className="hidden sm:block">{s.title}</span>
//                     <span className="sm:hidden">{s.id}</span>
//                   </button>
//                   {i < STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ── Content ── */}
//       <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">

//         {/* ══ STEP 1 ══ */}
//         {step === 1 && (
//           <div className="space-y-6">
//             <SectionCard title="Basic Information" subtitle="Official NGO registration details" icon={Building2}>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <Field label="NGO Name" required error={errors.ngoName}>
//                   <Input icon={Building2} value={ngoData.ngoName} onChange={e => { setNgo("ngoName")(e); clearError("ngoName"); }} placeholder="Helping Hands Foundation" error={errors.ngoName} />
//                 </Field>
//                 <Field label="Registration Type" required>
//                   <Select value={ngoData.registrationType} onChange={setNgo("registrationType")}>
//                     <option value="TRUST">Trust</option>
//                     <option value="SOCIETY">Society</option>
//                     <option value="SECTION8">Section 8</option>
//                   </Select>
//                 </Field>
//                 <Field label="Registration Number" required error={errors.registrationNumber}>
//                   <Input icon={Hash} value={ngoData.registrationNumber} onChange={e => { setNgo("registrationNumber")(e); clearError("registrationNumber"); }} placeholder="TRUST12345" error={errors.registrationNumber} />
//                 </Field>
//                 <Field label="PAN Number" required error={errors.panNumber}>
//                   <Input icon={CreditCard} value={ngoData.panNumber} onChange={e => { setNgo("panNumber")(e); clearError("panNumber"); }} placeholder="ABCDE1234F" error={errors.panNumber} />
//                 </Field>
//                 <Field label="Darpan ID">
//                   <Input icon={Hash} value={ngoData.darpanId} onChange={setNgo("darpanId")} placeholder="DARPAN12345" />
//                 </Field>
//               </div>
//             </SectionCard>

//             <SectionCard title="Contact Information" subtitle="Official communication details" icon={Phone}>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <Field label="Official Email" required error={errors.email}>
//                   <Input icon={Mail} type="email" value={ngoData.email} onChange={e => { setNgo("email")(e); clearError("email"); }} placeholder="ngo@foundation.org" error={errors.email} />
//                 </Field>
//                 <Field label="Mobile Number" required error={errors.mobile}>
//                   <Input icon={Phone} value={ngoData.mobile} onChange={e => { setNgo("mobile")(e); clearError("mobile"); }} placeholder="9876543210" error={errors.mobile} />
//                 </Field>
//                 <Field label="Website">
//                   <Input icon={Globe} value={ngoData.website} onChange={setNgo("website")} placeholder="https://foundation.org" />
//                 </Field>
//                 <Field label="Instagram">
//                   <Input icon={Instagram} value={ngoData.instagram} onChange={setNgo("instagram")} placeholder="Instagram profile link" />
//                 </Field>
//                 <Field label="Facebook">
//                   <Input icon={Facebook} value={ngoData.facebook} onChange={setNgo("facebook")} placeholder="Facebook page link" />
//                 </Field>
//                 <Field label="LinkedIn">
//                   <Input icon={Linkedin} value={ngoData.linkedin} onChange={setNgo("linkedin")} placeholder="LinkedIn profile link" />
//                 </Field>
//               </div>
//             </SectionCard>

//             <SectionCard title="Address Details" subtitle="Registered office location" icon={MapPin}>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <Field label="Address" required error={errors.address} >
//                   <div className="sm:col-span-2">
//                     <Textarea rows={3} value={ngoData.address} onChange={e => { setNgo("address")(e); clearError("address"); }} placeholder="Full registered office address" error={errors.address} />
//                     {errors.address && <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1"><AlertCircle className="h-3 w-3" />{errors.address}</p>}
//                   </div>
//                 </Field>
//                 <Field label="District" required error={errors.district}>
//                   <Input icon={MapPin} value={ngoData.district} onChange={e => { setNgo("district")(e); clearError("district"); }} placeholder="Ahmedabad" error={errors.district} />
//                 </Field>
//                 <Field label="State" required error={errors.state}>
//                   <Input value={ngoData.state} onChange={e => { setNgo("state")(e); clearError("state"); }} placeholder="Gujarat" error={errors.state} />
//                 </Field>
//                 <Field label="Pincode" required error={errors.pincode}>
//                   <Input value={ngoData.pincode} onChange={e => { setNgo("pincode")(e); clearError("pincode"); }} placeholder="380001" error={errors.pincode} />
//                 </Field>
//               </div>
//             </SectionCard>

//             <SectionCard title="About Your NGO" subtitle="Mission, vision and background" icon={FileText}>
//               <div className="grid gap-4">
//                 <Field label="About NGO" required error={errors.about}>
//                   <Textarea rows={4} value={ngoData.about} onChange={e => { setNgo("about")(e); clearError("about"); }} placeholder="Tell us about your NGO, its history and impact..." error={errors.about} />
//                   {errors.about && <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1"><AlertCircle className="h-3 w-3" />{errors.about}</p>}
//                 </Field>
//                 <Field label="Mission Statement">
//                   <Textarea rows={3} value={ngoData.mission} onChange={setNgo("mission")} placeholder="What is your NGO's core mission?" />
//                 </Field>
//                 <Field label="Vision Statement">
//                   <Textarea rows={3} value={ngoData.vision} onChange={setNgo("vision")} placeholder="What future are you working towards?" />
//                 </Field>
//               </div>
//             </SectionCard>

//             <StepFooter onNext={handleCreateNgo} loading={loading} nextLabel="Save & Continue" />
//           </div>
//         )}

//         {/* ══ STEP 2 ══ */}
//         {step === 2 && (
//           <div className="space-y-6">
//             <SectionCard title="Upload Documents" subtitle="Upload all relevant legal certificates" icon={FileText}>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 {NGO_DOCS.map((doc) => (
//                   <DocUploadCard
//                     key={doc.type}
//                     label={doc.label}
//                     required={doc.required}
//                     uploaded={documents[doc.type]}
//                     onUpload={(file) => handleUploadDocument(doc.type, file)}
//                   />
//                 ))}
//               </div>
//             </SectionCard>
//             <StepFooter onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Continue" />
//           </div>
//         )}

//         {/* ══ STEP 3 ══ */}
//         {step === 3 && (
//           <div className="space-y-6">
//             <SectionCard title="Authorized Representative" subtitle="Add the primary point of contact for your NGO" icon={Users}>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <Field label="Full Name" required error={errors.repFullName}>
//                   <Input icon={User} value={representative.fullName} onChange={e => { setRep("fullName")(e); clearError("repFullName"); }} placeholder="Rajesh Sharma" error={errors.repFullName} />
//                 </Field>
//                 <Field label="Designation" required error={errors.repDesignation}>
//                   <Input icon={Briefcase} value={representative.designation} onChange={e => { setRep("designation")(e); clearError("repDesignation"); }} placeholder="President / Secretary" error={errors.repDesignation} />
//                 </Field>
//                 <Field label="Mobile Number" required error={errors.repMobile}>
//                   <Input icon={Phone} value={representative.mobile} onChange={e => { setRep("mobile")(e); clearError("repMobile"); }} placeholder="9876543210" error={errors.repMobile} />
//                 </Field>
//                 <Field label="Email Address" required error={errors.repEmail}>
//                   <Input icon={Mail} type="email" value={representative.email} onChange={e => { setRep("email")(e); clearError("repEmail"); }} placeholder="representative@ngo.org" error={errors.repEmail} />
//                 </Field>
//               </div>
//             </SectionCard>
//             <StepFooter onBack={() => setStep(2)} onNext={handleAddRepresentative} loading={loading} nextLabel="Save & Continue" />
//           </div>
//         )}

//         {/* ══ STEP 4 ══ */}
//         {step === 4 && (
//           <div className="space-y-6">
//             <SectionCard title="Bank Account Details" subtitle="NGO account to receive donations" icon={Landmark}>
//               <div className="grid gap-4 sm:grid-cols-2">
//                 <Field label="Account Holder Name" required error={errors.accountHolderName}>
//                   <Input icon={User} value={bankData.accountHolderName} onChange={e => { setBank("accountHolderName")(e); clearError("accountHolderName"); }} placeholder="Helping Hands Foundation" error={errors.accountHolderName} />
//                 </Field>
//                 <Field label="Account Number" required error={errors.accountNumber}>
//                   <Input icon={Banknote} value={bankData.accountNumber} onChange={e => { setBank("accountNumber")(e); clearError("accountNumber"); }} placeholder="1234567890123456" error={errors.accountNumber} />
//                 </Field>
//                 <Field label="IFSC Code" required error={errors.ifscCode}>
//                   <Input icon={Hash} value={bankData.ifscCode} onChange={e => { setBank("ifscCode")(e); clearError("ifscCode"); }} placeholder="SBIN0001234" error={errors.ifscCode} />
//                 </Field>
//                 <Field label="Bank Name" required error={errors.bankName}>
//                   <Input value={bankData.bankName} onChange={e => { setBank("bankName")(e); clearError("bankName"); }} placeholder="State Bank of India" error={errors.bankName} />
//                 </Field>
//                 <Field label="Branch Name" required error={errors.branchName}>
//                   <Input value={bankData.branchName} onChange={e => { setBank("branchName")(e); clearError("branchName"); }} placeholder="Navrangpura Branch" error={errors.branchName} />
//                 </Field>
//                 <Field label="Cancelled Cheque" required error={errors.cancelledCheque}>
//                   <div className={`relative border-2 border-dashed rounded-xl p-4 transition-colors
//                     ${errors.cancelledCheque ? "border-red-300 bg-red-50" : cancelledCheque ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-[#D2252B]/40 bg-gray-50"}`}>
//                     <input type="file" accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer"
//                       onChange={e => { const f = e.target.files?.[0]; if (f) { setCancelledCheque(f); clearError("cancelledCheque"); } }} />
//                     <div className="flex flex-col items-center gap-2 text-center">
//                       {cancelledCheque ? (
//                         <>
//                           <CheckCircle className="h-8 w-8 text-green-500" />
//                           <p className="text-xs font-medium text-green-700">{cancelledCheque.name}</p>
//                         </>
//                       ) : (
//                         <>
//                           <Upload className="h-8 w-8 text-gray-400" />
//                           <p className="text-xs text-gray-500">Click to upload cancelled cheque</p>
//                           <p className="text-xs text-gray-400">PDF, JPG, PNG</p>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   {errors.cancelledCheque && <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1"><AlertCircle className="h-3 w-3" />{errors.cancelledCheque}</p>}
//                 </Field>
//               </div>
//             </SectionCard>
//             <StepFooter onBack={() => setStep(3)} onNext={handleAddBank} loading={loading} nextLabel="Save & Continue" />
//           </div>
//         )}

//         {/* ══ STEP 5 ══ */}
//         {step === 5 && (
//           <div className="space-y-6">
//             {/* Summary Cards */}
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               {[
//                 { label: "NGO Name", value: ngoData.ngoName || "—", icon: Building2 },
//                 { label: "Registration", value: ngoData.registrationType, icon: Hash },
//                 { label: "Documents", value: `${Object.keys(documents).length} Uploaded`, icon: FileText },
//                 { label: "Representative", value: representative.fullName || "—", icon: Users },
//               ].map((c) => (
//                 <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
//                   <div className="h-9 w-9 rounded-xl bg-[#D2252B]/10 flex items-center justify-center shrink-0">
//                     <c.icon className="h-4 w-4 text-[#D2252B]" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 font-medium">{c.label}</p>
//                     <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate max-w-[120px]">{c.value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <SectionCard title="Review Details" subtitle="Confirm your NGO information" icon={CheckCircle2}>
//               <ReviewRow label="NGO Name" value={ngoData.ngoName} />
//               <ReviewRow label="Registration Type" value={ngoData.registrationType} />
//               <ReviewRow label="Registration Number" value={ngoData.registrationNumber} />
//               <ReviewRow label="PAN Number" value={ngoData.panNumber} />
//               <ReviewRow label="Email" value={ngoData.email} />
//               <ReviewRow label="Mobile" value={ngoData.mobile} />
//               <ReviewRow label="District" value={`${ngoData.district}, ${ngoData.state} - ${ngoData.pincode}`} />
//               <ReviewRow label="Bank" value={bankData.bankName ? `${bankData.bankName} — ${bankData.branchName}` : "—"} />
//               <ReviewRow label="Account" value={bankData.accountNumber ? `****${bankData.accountNumber.slice(-4)}` : "—"} last />
//             </SectionCard>

//             {/* Declaration */}
//             <div className="bg-white border border-gray-100 rounded-2xl p-6">
//               <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
//                 <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
//                 <p className="text-sm text-amber-800 leading-relaxed">
//                   By submitting, you confirm that all information and documents provided are genuine, accurate, and legally valid. Providing false information may result in rejection or legal action.
//                 </p>
//               </div>
//               <label className="flex items-start gap-3 cursor-pointer group">
//                 <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition
//                   ${declarationAccepted ? "bg-[#D2252B] border-[#D2252B]" : "border-gray-300 group-hover:border-[#D2252B]"}`}>
//                   {declarationAccepted && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
//                 </div>
//                 <input type="checkbox" className="sr-only" checked={declarationAccepted} onChange={e => setDeclarationAccepted(e.target.checked)} />
//                 <span className="text-sm font-medium text-gray-700 leading-snug">
//                   I agree to the verification declaration and confirm all details are accurate and truthful.
//                 </span>
//               </label>
//             </div>

//             <StepFooter
//               onBack={() => setStep(4)}
//               onNext={handleSubmitNgo}
//               loading={loading}
//               nextLabel="Submit for Verification"
//               nextClassName="bg-[#D2252B] hover:bg-[#b81e23]"
//               isSubmit
//             />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// // ─── Helper Components ───────────────────────────────────────────────────────
// function SectionCard({ title, subtitle, icon: Icon, children }) {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//       <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
//         <div className="h-8 w-8 rounded-lg bg-[#D2252B]/10 flex items-center justify-center">
//           <Icon className="h-4 w-4 text-[#D2252B]" />
//         </div>
//         <div>
//           <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
//           <p className="text-xs text-gray-400">{subtitle}</p>
//         </div>
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   );
// }

// function DocUploadCard({ label, required, uploaded, onUpload }) {
//   return (
//     <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all
//       ${uploaded ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-[#D2252B]/40 hover:bg-[#D2252B]/5"}`}>
//       <input
//         type="file"
//         accept=".pdf,.jpg,.jpeg,.png"
//         className="absolute inset-0 opacity-0 cursor-pointer z-10"
//         onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
//       />
//       <div className="flex items-center gap-3">
//         <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0
//           ${uploaded ? "bg-green-100" : "bg-gray-100"}`}>
//           {uploaded ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Upload className="h-4 w-4 text-gray-400" />}
//         </div>
//         <div className="min-w-0">
//           <p className="text-sm font-semibold text-gray-800">
//             {label}
//             {required && <span className="text-[#D2252B] ml-1 text-xs">*</span>}
//           </p>
//           <p className="text-xs truncate mt-0.5">
//             {uploaded
//               ? <span className="text-green-600 font-medium">{uploaded}</span>
//               : <span className="text-gray-400">Click to upload</span>}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ReviewRow({ label, value, last }) {
//   return (
//     <div className={`flex justify-between items-center py-3 ${!last ? "border-b border-gray-50" : ""}`}>
//       <span className="text-sm text-gray-500">{label}</span>
//       <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">{value || "—"}</span>
//     </div>
//   );
// }

// function StepFooter({ onBack, onNext, loading, nextLabel = "Continue", nextClassName = "", isSubmit }) {
//   return (
//     <div className="flex items-center justify-between pt-2">
//       {onBack ? (
//         <button onClick={onBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
//           Back
//         </button>
//       ) : <div />}
//       <button
//         onClick={onNext}
//         disabled={loading}
//         className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm
//           disabled:opacity-60 disabled:cursor-not-allowed
//           ${nextClassName || "bg-[#D2252B] hover:bg-[#b81e23] shadow-[#D2252B]/30"}`}
//       >
//         {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//         {nextLabel}
//         {!loading && <ChevronRight className="h-4 w-4" />}
//       </button>
//     </div>
//   );
// }


//new register page 

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2, FileText, Users, Landmark, CheckCircle2,
  Loader2, AlertCircle, X, CheckCircle, Upload, ChevronRight,
  Globe, Instagram, Facebook, Linkedin, MapPin, Phone, Mail,
  Hash, CreditCard, Banknote, User, Briefcase, Shield, Info
} from "lucide-react";
import {
  startNgoDraft,
  updateNgoBasicDetails,
  uploadNgoDraftDocument,
  addNgoDraftRepresentative,
  addNgoDraftBank,
  submitNgoDraft,
} from "@/features/auth/api/ngo.api";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info";
interface ToastItem { id: number; title: string; message?: string; type: ToastType; }

// ─────────────────────────────────────────────────────────────────────────────
// TOAST SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ toasts, removeToast }: { toasts: ToastItem[]; removeToast: (id: number) => void }) {
  const config: Record<ToastType, { bar: string; icon: React.ReactNode; border: string; text: string }> = {
    success: {
      bar: "bg-green-500",
      icon: <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />,
      border: "border-green-200",
      text: "text-green-800",
    },
    error: {
      bar: "bg-[#D2252B]",
      icon: <AlertCircle className="w-4 h-4 text-[#D2252B] shrink-0 mt-0.5" />,
      border: "border-red-200",
      text: "text-red-800",
    },
    info: {
      bar: "bg-blue-500",
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
      border: "border-blue-200",
      text: "text-blue-800",
    },
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => {
        const c = config[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto relative flex items-start gap-3 rounded-xl border ${c.border} bg-white shadow-lg px-4 py-3 overflow-hidden`}
            style={{ animation: "slideInRight 0.3s ease" }}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.bar} rounded-l-xl`} />
            <div className="ml-2">{c.icon}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${c.text}`}>{t.title}</p>
              {t.message && <p className="text-xs text-gray-500 mt-0.5">{t.message}</p>}
            </div>
            <button onClick={() => removeToast(t.id)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const add = (type: ToastType, title: string, message?: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, title, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  };
  const remove = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));
  return {
    toasts,
    removeToast: remove,
    toast: {
      success: (title: string, msg?: string) => add("success", title, msg),
      error: (title: string, msg?: string) => add("error", title, msg),
      info: (title: string, msg?: string) => add("info", title, msg),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD / INPUT / SELECT / TEXTAREA COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Field({ label, required, children, error }: {
  label: string; required?: boolean; children: React.ReactNode; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        {label}
        {required && (
          <span className="text-[#D2252B] text-xs font-bold" title="Required">*</span>
        )}
        {!required && (
          <span className="text-gray-400 text-xs font-normal">(optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertCircle className="h-3 w-3 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

function Input({ icon: Icon, error, className = "", ...props }: any) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      )}
      <input
        {...props}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition
          focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10
          ${error ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-gray-300"}
          ${Icon ? "pl-10" : ""}
          ${className}`}
      />
    </div>
  );
}

function Textarea({ error, ...props }: any) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition resize-none
        focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10
        ${error ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-gray-300"}`}
    />
  );
}

function Select({ error, children, ...props }: any) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition appearance-none cursor-pointer
        focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10
        ${error ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-gray-300"}`}
    >
      {children}
    </select>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────────────────────────────────────
function SectionCard({ title, subtitle, icon: Icon, children }: {
  title: string; subtitle: string; icon: any; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="h-9 w-9 rounded-xl bg-[#D2252B]/10 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-[#D2252B]" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOC UPLOAD CARD
// ─────────────────────────────────────────────────────────────────────────────
function DocUploadCard({ label, required, uploaded, onUpload, uploading }: {
  label: string; required?: boolean; uploaded?: string;
  onUpload: (file: File) => void; uploading?: boolean;
}) {
  return (
    <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all
      ${uploaded ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-[#D2252B]/40 hover:bg-[#D2252B]/5"}`}>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
      />
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0
          ${uploaded ? "bg-green-100" : "bg-gray-100"}`}>
          {uploading ? (
            <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
          ) : uploaded ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <Upload className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
            {label}
            {required ? (
              <span className="text-[#D2252B] text-xs font-bold ml-0.5" title="Required">*</span>
            ) : (
              <span className="text-gray-400 text-xs font-normal">(optional)</span>
            )}
          </p>
          <p className="text-xs truncate mt-0.5">
            {uploaded
              ? <span className="text-green-600 font-medium">{uploaded}</span>
              : <span className="text-gray-400">Click to upload · PDF, JPG, PNG</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW ROW
// ─────────────────────────────────────────────────────────────────────────────
function ReviewRow({ label, value, last }: { label: string; value?: string; last?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-3 ${!last ? "border-b border-gray-50" : ""}`}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%] truncate">{value || "—"}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function StepFooter({ onBack, onNext, loading, nextLabel = "Continue", isSubmit = false }: {
  onBack?: () => void; onNext: () => void; loading?: boolean;
  nextLabel?: string; isSubmit?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      ) : <div />}
      <button
        onClick={onNext}
        disabled={loading}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm
          disabled:opacity-60 disabled:cursor-not-allowed
          ${isSubmit ? "bg-green-600 hover:bg-green-700 shadow-green-200" : "bg-[#D2252B] hover:bg-[#b81e23] shadow-[#D2252B]/20"}`}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {nextLabel}
        {!loading && !isSubmit && <ChevronRight className="h-4 w-4" />}
        {!loading && isSubmit && <Shield className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "NGO Details",    icon: Building2   },
  { id: 2, title: "Documents",      icon: FileText    },
  { id: 3, title: "Representative", icon: Users       },
  { id: 4, title: "Bank Details",   icon: Landmark    },
  { id: 5, title: "Review & Submit",icon: CheckCircle2 },
];

const NGO_DOCS = [
  { label: "NGO PAN",              type: "NGO_PAN",              required: true  },
  { label: "Trust Certificate",    type: "TRUST_CERTIFICATE",    required: false },
  { label: "Society Certificate",  type: "SOCIETY_CERTIFICATE",  required: false },
  { label: "Section 8 Certificate",type: "SECTION8_CERTIFICATE", required: false },
  { label: "12A Certificate",      type: "CERTIFICATE_12A",      required: false },
  { label: "80G Certificate",      type: "CERTIFICATE_80G",      required: false },
  { label: "Darpan Certificate",   type: "DARPAN_CERTIFICATE",   required: false },
  { label: "Event Photos",         type: "EVENT_PHOTOS",         required: false },
  { label: "Project Report",       type: "PROJECT_REPORT",       required: false },
  { label: "Annual Report",        type: "ANNUAL_REPORT",        required: false },
  { label: "Press Coverage",       type: "PRESS_COVERAGE",       required: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function NgoRegisterPage() {
  const [step, setStep]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const { toasts, toast, removeToast } = useToast();

  // Draft ID — obtained from startNgoDraft() on first save
  const [draftId, setDraftId]   = useState<number | null>(null);
  const draftStarted            = useRef(false);

  // ── Form state ────────────────────────────────────────────────────────────
  const [ngoData, setNgoData] = useState({
    ngoName: "", registrationType: "TRUST", registrationNumber: "",
    panNumber: "", darpanId: "", email: "", mobile: "",
    website: "", instagram: "", facebook: "", linkedin: "",
    address: "", district: "", state: "", pincode: "",
    about: "", mission: "", vision: "",
  });

  const [representative, setRepresentative] = useState({
    fullName: "", designation: "", mobile: "", email: "",
  });

  const [bankData, setBankData] = useState({
    accountHolderName: "", accountNumber: "",
    ifscCode: "", bankName: "", branchName: "",
  });

  const [documents, setDocuments]           = useState<Record<string, string>>({});
  const [uploadingDoc, setUploadingDoc]     = useState<string | null>(null);
  const [cancelledCheque, setCancelledCheque] = useState<File | null>(null);
  // const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setNgo  = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setNgoData((p) => ({ ...p, [key]: e.target.value }));
  const setRep  = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setRepresentative((p) => ({ ...p, [key]: e.target.value }));
  const setBank = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setBankData((p) => ({ ...p, [key]: e.target.value }));
  const clearError = (key: string) =>
    setErrors((p) => { const n = { ...p }; delete n[key]; return n; });

  // Progress bar percentage
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  // ── Validators ────────────────────────────────────────────────────────────
  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!ngoData.ngoName.trim())            e.ngoName           = "NGO name is required";
    if (!ngoData.registrationNumber.trim()) e.registrationNumber = "Registration number is required";
    if (!ngoData.panNumber.trim())          e.panNumber         = "PAN number is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(ngoData.panNumber.toUpperCase()))
                                            e.panNumber         = "Invalid PAN format (e.g. ABCDE1234F)";
    if (!ngoData.email.trim())              e.email             = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(ngoData.email))
                                            e.email             = "Enter a valid email address";
    if (!ngoData.mobile.trim())             e.mobile            = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(ngoData.mobile))
                                            e.mobile            = "Enter a valid 10-digit mobile number";
    if (!ngoData.address.trim())            e.address           = "Address is required";
    if (!ngoData.district.trim())           e.district          = "District is required";
    if (!ngoData.state.trim())              e.state             = "State is required";
    if (!ngoData.pincode.trim())            e.pincode           = "Pincode is required";
    else if (!/^\d{6}$/.test(ngoData.pincode))
                                            e.pincode           = "Enter a valid 6-digit pincode";
    if (!ngoData.about.trim())              e.about             = "Please write about your NGO";
    return e;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!representative.fullName.trim())    e.repFullName    = "Full name is required";
    if (!representative.designation.trim()) e.repDesignation = "Designation is required";
    if (!representative.mobile.trim())      e.repMobile      = "Mobile is required";
    else if (!/^[6-9]\d{9}$/.test(representative.mobile))
                                            e.repMobile      = "Enter a valid mobile number";
    if (!representative.email.trim())       e.repEmail       = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(representative.email))
                                            e.repEmail       = "Enter a valid email";
    return e;
  };

  const validateStep4 = () => {
    const e: Record<string, string> = {};
    if (!bankData.accountHolderName.trim()) e.accountHolderName = "Account holder name is required";
    if (!bankData.accountNumber.trim())     e.accountNumber     = "Account number is required";
    if (!bankData.ifscCode.trim())          e.ifscCode          = "IFSC code is required";
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankData.ifscCode.toUpperCase()))
                                            e.ifscCode          = "Invalid IFSC format (e.g. SBIN0001234)";
    if (!bankData.bankName.trim())          e.bankName          = "Bank name is required";
    if (!bankData.branchName.trim())        e.branchName        = "Branch name is required";
    if (!cancelledCheque)                   e.cancelledCheque   = "Cancelled cheque is required";
    return e;
  };

  // ── STEP 1 — Start draft + save basic details ────────────────────────────
  const handleCreateNgo = async () => {
    const e = validateStep1();
    if (Object.keys(e).length) {
      setErrors(e);
      toast.error("Please fix the errors before continuing");
      return;
    }
    setErrors({});
    try {
      setLoading(true);

      // Start draft once — reuse draftId on re-saves
      let currentDraftId = draftId;
      if (!currentDraftId) {
        const draftRes = await startNgoDraft();
        currentDraftId = draftRes.data.id as number;
        setDraftId(currentDraftId);
      }

      await updateNgoBasicDetails(currentDraftId, {
        ngoName:            ngoData.ngoName,
        registrationType:   ngoData.registrationType,
        registrationNumber: ngoData.registrationNumber,
        panNumber:          ngoData.panNumber.toUpperCase(),
        darpanId:           ngoData.darpanId,
        email:              ngoData.email,
        mobile:             ngoData.mobile,
        website:            ngoData.website,
        instagram:          ngoData.instagram,
        facebook:           ngoData.facebook,
        linkedin:           ngoData.linkedin,
        address:            ngoData.address,
        district:           ngoData.district,
        state:              ngoData.state,
        pincode:            ngoData.pincode,
        about:              ngoData.about,
        mission:            ngoData.mission,
        vision:             ngoData.vision,
      });

      toast.success("NGO details saved successfully!");
      setStep(2);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to save NGO details");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2 — Upload document ─────────────────────────────────────────────
  const handleUploadDocument = async (type: string, file: File) => {
    if (!draftId) {
      toast.error("Draft not started", "Please complete Step 1 first.");
      return;
    }
    try {
      setUploadingDoc(type);

      const formData = new FormData();
      formData.append("document", file);
      formData.append("type", type);

      await uploadNgoDraftDocument(draftId, formData);

      setDocuments((prev) => ({ ...prev, [type]: file.name }));
      toast.success(`${file.name} uploaded successfully`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload document");
    } finally {
      setUploadingDoc(null);
    }
  };

  // ── STEP 3 — Add representative ──────────────────────────────────────────
  const handleAddRepresentative = async () => {
    const e = validateStep3();
    if (Object.keys(e).length) {
      setErrors(e);
      toast.error("Please fill all required fields");
      return;
    }
    setErrors({});
    if (!draftId) { toast.error("Draft ID missing"); return; }
    try {
      setLoading(true);
      await addNgoDraftRepresentative(draftId, {
        fullName:    representative.fullName,
        designation: representative.designation,
        mobile:      representative.mobile,
        email:       representative.email,
      });
      toast.success("Representative added successfully!");
      setStep(4);
    } catch (error: any) {
      toast.error(error?.message || "Failed to add representative");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 4 — Add bank details ─────────────────────────────────────────────
  const handleAddBank = async () => {
    const e = validateStep4();
    if (Object.keys(e).length) {
      setErrors(e);
      toast.error("Please complete all bank details");
      return;
    }
    setErrors({});
    if (!draftId) { toast.error("Draft ID missing"); return; }
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("accountHolderName", bankData.accountHolderName);
      formData.append("accountNumber",     bankData.accountNumber);
      formData.append("ifscCode",          bankData.ifscCode.toUpperCase());
      formData.append("bankName",          bankData.bankName);
      formData.append("branchName",        bankData.branchName);
      if (cancelledCheque) {
        formData.append("document", cancelledCheque);
      }

      const res = await addNgoDraftBank(draftId, formData);
      console.log("BANK API RESPONSE:", res);

      toast.success("Bank details saved successfully!");
      setStep(5);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to save bank details");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 5 — Final submit ─────────────────────────────────────────────────
  const handleSubmitNgo = async () => {
    // if (!declarationAccepted) {
    //   toast.error("Please accept the verification declaration");
    //   return;
    // }
    if (!draftId) { toast.error("Draft ID missing"); return; }
    try {
      setLoading(true);
      await submitNgoDraft(draftId);
      toast.success("NGO verification submitted!", "Our team will review within 3–5 business days.");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit NGO");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fade-up { animation: fadeUp 0.35s ease; }
      `}</style>

      <Toast toasts={toasts} removeToast={removeToast} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center gap-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#D2252B] text-white shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">NGO Registration</h1>
            <p className="text-xs text-gray-500">Complete all steps to verify your NGO</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 shrink-0">
            <span className="font-semibold text-[#D2252B]">Step {step}</span>
            <span className="hidden sm:inline">of {STEPS.length}</span>
          </div>
        </div>
      </header>

      {/* ── Stepper ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-5">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
            <div
              className="h-full bg-[#D2252B] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step pills */}
          <div className="flex items-center overflow-x-auto gap-1 pb-1">
            {STEPS.map((s, i) => {
              const Icon  = s.icon;
              const done  = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => done && setStep(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                      ${active  ? "bg-[#D2252B] text-white shadow-sm shadow-[#D2252B]/30" :
                        done    ? "bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer" :
                                  "bg-gray-50 text-gray-400 cursor-default"}`}
                  >
                    <span className={`flex items-center justify-center h-5 w-5 rounded-full text-[10px] shrink-0
                      ${active ? "bg-white/20" : done ? "bg-green-200" : "bg-gray-200"}`}>
                      {done ? <CheckCircle2 className="h-3 w-3 text-green-700" /> : <Icon className="h-3 w-3" />}
                    </span>
                    <span className="hidden sm:block">{s.title}</span>
                    <span className="sm:hidden">{s.id}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Required fields legend ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-fit shadow-sm">
          <span className="text-[#D2252B] font-bold text-sm">*</span>
          <span>Required fields must be filled to proceed</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-gray-400">(optional)</span>
          <span>Fields can be filled later</span>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6">

        {/* ══════════════════════ STEP 1 ══════════════════════ */}
        {step === 1 && (
          <div className="space-y-6 fade-up">
            <SectionCard title="Basic Information" subtitle="Official NGO registration details" icon={Building2}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="NGO Name" required error={errors.ngoName}>
                  <Input
                    icon={Building2}
                    value={ngoData.ngoName}
                    onChange={(e: any) => { setNgo("ngoName")(e); clearError("ngoName"); }}
                    placeholder="Helping Hands Foundation"
                    error={errors.ngoName}
                  />
                </Field>
                <Field label="Registration Type" required>
                  <Select value={ngoData.registrationType} onChange={setNgo("registrationType")}>
                    <option value="TRUST">Trust</option>
                    <option value="SOCIETY">Society</option>
                    <option value="SECTION8">Section 8 Company</option>
                  </Select>
                </Field>
                <Field label="Registration Number" required error={errors.registrationNumber}>
                  <Input
                    icon={Hash}
                    value={ngoData.registrationNumber}
                    onChange={(e: any) => { setNgo("registrationNumber")(e); clearError("registrationNumber"); }}
                    placeholder="TRUST12345"
                    error={errors.registrationNumber}
                  />
                </Field>
                <Field label="PAN Number" required error={errors.panNumber}>
                  <Input
                    icon={CreditCard}
                    value={ngoData.panNumber}
                    onChange={(e: any) => { setNgo("panNumber")(e); clearError("panNumber"); }}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    error={errors.panNumber}
                  />
                </Field>
                <Field label="Darpan ID">
                  <Input
                    icon={Hash}
                    value={ngoData.darpanId}
                    onChange={setNgo("darpanId")}
                    placeholder="DARPAN12345"
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Contact Information" subtitle="Official communication details" icon={Phone}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Official Email" required error={errors.email}>
                  <Input
                    icon={Mail}
                    type="email"
                    value={ngoData.email}
                    onChange={(e: any) => { setNgo("email")(e); clearError("email"); }}
                    placeholder="ngo@foundation.org"
                    error={errors.email}
                  />
                </Field>
                <Field label="Mobile Number" required error={errors.mobile}>
                  <Input
                    icon={Phone}
                    value={ngoData.mobile}
                    onChange={(e: any) => { setNgo("mobile")(e); clearError("mobile"); }}
                    placeholder="9876543210"
                    maxLength={10}
                    error={errors.mobile}
                  />
                </Field>
                <Field label="Website">
                  <Input icon={Globe} value={ngoData.website} onChange={setNgo("website")} placeholder="https://foundation.org" />
                </Field>
                <Field label="Instagram">
                  <Input icon={Instagram} value={ngoData.instagram} onChange={setNgo("instagram")} placeholder="Instagram profile link" />
                </Field>
                <Field label="Facebook">
                  <Input icon={Facebook} value={ngoData.facebook} onChange={setNgo("facebook")} placeholder="Facebook page link" />
                </Field>
                <Field label="LinkedIn">
                  <Input icon={Linkedin} value={ngoData.linkedin} onChange={setNgo("linkedin")} placeholder="LinkedIn profile link" />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Address Details" subtitle="Registered office location" icon={MapPin}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Full Address" required error={errors.address}>
                    <Textarea
                      rows={3}
                      value={ngoData.address}
                      onChange={(e: any) => { setNgo("address")(e); clearError("address"); }}
                      placeholder="Street, Area, Locality, City"
                      error={errors.address}
                    />
                  </Field>
                </div>
                <Field label="District" required error={errors.district}>
                  <Input
                    icon={MapPin}
                    value={ngoData.district}
                    onChange={(e: any) => { setNgo("district")(e); clearError("district"); }}
                    placeholder="Ahmedabad"
                    error={errors.district}
                  />
                </Field>
                <Field label="State" required error={errors.state}>
                  <Input
                    value={ngoData.state}
                    onChange={(e: any) => { setNgo("state")(e); clearError("state"); }}
                    placeholder="Gujarat"
                    error={errors.state}
                  />
                </Field>
                <Field label="Pincode" required error={errors.pincode}>
                  <Input
                    value={ngoData.pincode}
                    onChange={(e: any) => { setNgo("pincode")(e); clearError("pincode"); }}
                    placeholder="380001"
                    maxLength={6}
                    error={errors.pincode}
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="About Your NGO" subtitle="Mission, vision and background" icon={FileText}>
              <div className="grid gap-5">
                <Field label="About NGO" required error={errors.about}>
                  <Textarea
                    rows={4}
                    value={ngoData.about}
                    onChange={(e: any) => { setNgo("about")(e); clearError("about"); }}
                    placeholder="Tell us about your NGO, its history and impact..."
                    error={errors.about}
                  />
                </Field>
                <Field label="Mission Statement">
                  <Textarea
                    rows={3}
                    value={ngoData.mission}
                    onChange={setNgo("mission")}
                    placeholder="What is your NGO's core mission?"
                  />
                </Field>
                <Field label="Vision Statement">
                  <Textarea
                    rows={3}
                    value={ngoData.vision}
                    onChange={setNgo("vision")}
                    placeholder="What future are you working towards?"
                  />
                </Field>
              </div>
            </SectionCard>

            <StepFooter onNext={handleCreateNgo} loading={loading} nextLabel="Save & Continue" />
          </div>
        )}

        {/* ══════════════════════ STEP 2 ══════════════════════ */}
        {step === 2 && (
          <div className="space-y-6 fade-up">
            {/* Info banner */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                <span className="font-semibold">NGO PAN</span> is mandatory. All other documents are optional but improve your verification chances.
              </p>
            </div>

            <SectionCard title="Upload Documents" subtitle="Upload legal certificates and verification documents" icon={FileText}>
              <div className="grid gap-4 sm:grid-cols-2">
                {NGO_DOCS.map((doc) => (
                  <DocUploadCard
                    key={doc.type}
                    label={doc.label}
                    required={doc.required}
                    uploaded={documents[doc.type]}
                    uploading={uploadingDoc === doc.type}
                    onUpload={(file) => handleUploadDocument(doc.type, file)}
                  />
                ))}
              </div>
            </SectionCard>

            <StepFooter
              onBack={() => setStep(1)}
              onNext={() => {
                if (!documents["NGO_PAN"]) {
                  toast.error("NGO PAN is mandatory", "Please upload your NGO PAN document to continue.");
                  return;
                }
                toast.info("Documents saved", "You can add more documents later.");
                setStep(3);
              }}
              nextLabel="Continue"
            />
          </div>
        )}

        {/* ══════════════════════ STEP 3 ══════════════════════ */}
        {step === 3 && (
          <div className="space-y-6 fade-up">
            <SectionCard title="Authorized Representative" subtitle="Primary point of contact for your NGO" icon={Users}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" required error={errors.repFullName}>
                  <Input
                    icon={User}
                    value={representative.fullName}
                    onChange={(e: any) => { setRep("fullName")(e); clearError("repFullName"); }}
                    placeholder="Rajesh Sharma"
                    error={errors.repFullName}
                  />
                </Field>
                <Field label="Designation" required error={errors.repDesignation}>
                  <Input
                    icon={Briefcase}
                    value={representative.designation}
                    onChange={(e: any) => { setRep("designation")(e); clearError("repDesignation"); }}
                    placeholder="President / Secretary"
                    error={errors.repDesignation}
                  />
                </Field>
                <Field label="Mobile Number" required error={errors.repMobile}>
                  <Input
                    icon={Phone}
                    value={representative.mobile}
                    onChange={(e: any) => { setRep("mobile")(e); clearError("repMobile"); }}
                    placeholder="9876543210"
                    maxLength={10}
                    error={errors.repMobile}
                  />
                </Field>
                <Field label="Email Address" required error={errors.repEmail}>
                  <Input
                    icon={Mail}
                    type="email"
                    value={representative.email}
                    onChange={(e: any) => { setRep("email")(e); clearError("repEmail"); }}
                    placeholder="representative@ngo.org"
                    error={errors.repEmail}
                  />
                </Field>
              </div>
            </SectionCard>

            <StepFooter
              onBack={() => setStep(2)}
              onNext={handleAddRepresentative}
              loading={loading}
              nextLabel="Save & Continue"
            />
          </div>
        )}

        {/* ══════════════════════ STEP 4 ══════════════════════ */}
        {step === 4 && (
          <div className="space-y-6 fade-up">
            {/* Security notice */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Bank details are used <span className="font-semibold">solely for receiving donations</span>. All transactions are secured and audited. The account must be in the NGO's name.
              </p>
            </div>

            <SectionCard title="Bank Account Details" subtitle="NGO account to receive donations" icon={Landmark}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Account Holder Name" required error={errors.accountHolderName}>
                  <Input
                    icon={User}
                    value={bankData.accountHolderName}
                    onChange={(e: any) => { setBank("accountHolderName")(e); clearError("accountHolderName"); }}
                    placeholder="Helping Hands Foundation"
                    error={errors.accountHolderName}
                  />
                </Field>
                <Field label="Account Number" required error={errors.accountNumber}>
                  <Input
                    icon={Banknote}
                    value={bankData.accountNumber}
                    onChange={(e: any) => { setBank("accountNumber")(e); clearError("accountNumber"); }}
                    placeholder="1234567890123456"
                    error={errors.accountNumber}
                  />
                </Field>
                <Field label="IFSC Code" required error={errors.ifscCode}>
                  <Input
                    icon={Hash}
                    value={bankData.ifscCode}
                    onChange={(e: any) => { setBank("ifscCode")(e); clearError("ifscCode"); }}
                    placeholder="SBIN0001234"
                    maxLength={11}
                    error={errors.ifscCode}
                    className="uppercase"
                  />
                </Field>
                <Field label="Bank Name" required error={errors.bankName}>
                  <Input
                    value={bankData.bankName}
                    onChange={(e: any) => { setBank("bankName")(e); clearError("bankName"); }}
                    placeholder="State Bank of India"
                    error={errors.bankName}
                  />
                </Field>
                <Field label="Branch Name" required error={errors.branchName}>
                  <Input
                    value={bankData.branchName}
                    onChange={(e: any) => { setBank("branchName")(e); clearError("branchName"); }}
                    placeholder="Navrangpura Branch"
                    error={errors.branchName}
                  />
                </Field>

                {/* Cancelled cheque upload */}
                <Field label="Cancelled Cheque" required error={errors.cancelledCheque}>
                  <div className={`relative border-2 border-dashed rounded-xl p-4 transition-colors
                    ${errors.cancelledCheque ? "border-red-300 bg-red-50/50" :
                      cancelledCheque ? "border-green-300 bg-green-50" :
                      "border-gray-200 hover:border-[#D2252B]/40 hover:bg-[#D2252B]/5 bg-gray-50"}`}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setCancelledCheque(f); clearError("cancelledCheque"); }
                      }}
                    />
                    <div className="flex flex-col items-center gap-2 text-center">
                      {cancelledCheque ? (
                        <>
                          <CheckCircle className="h-8 w-8 text-green-500" />
                          <p className="text-xs font-semibold text-green-700">{cancelledCheque.name}</p>
                          <p className="text-xs text-green-500">Tap to replace</p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400" />
                          <p className="text-xs font-medium text-gray-600">Click to upload cancelled cheque</p>
                          <p className="text-xs text-gray-400">PDF, JPG, PNG supported</p>
                        </>
                      )}
                    </div>
                  </div>
                </Field>
              </div>
            </SectionCard>

            <StepFooter
              onBack={() => setStep(3)}
              onNext={handleAddBank}
              loading={loading}
              nextLabel="Save & Continue"
            />
          </div>
        )}

        {/* ══════════════════════ STEP 5 ══════════════════════ */}
        {step === 5 && (
          <div className="space-y-6 fade-up">
            {/* Summary stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "NGO Name",       value: ngoData.ngoName || "—",                        icon: Building2  },
                { label: "Reg. Type",      value: ngoData.registrationType,                      icon: Hash       },
                { label: "Documents",      value: `${Object.keys(documents).length} Uploaded`,   icon: FileText   },
                { label: "Representative", value: representative.fullName || "—",                icon: Users      },
              ].map((c) => (
                <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                  <div className="h-9 w-9 rounded-xl bg-[#D2252B]/10 flex items-center justify-center shrink-0">
                    <c.icon className="h-4 w-4 text-[#D2252B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">{c.label}</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Full review */}
            <SectionCard title="Review Details" subtitle="Confirm your NGO information before submitting" icon={CheckCircle2}>
              <ReviewRow label="NGO Name"            value={ngoData.ngoName} />
              <ReviewRow label="Registration Type"   value={ngoData.registrationType} />
              <ReviewRow label="Registration Number" value={ngoData.registrationNumber} />
              <ReviewRow label="PAN Number"          value={ngoData.panNumber} />
              <ReviewRow label="Darpan ID"           value={ngoData.darpanId || "Not provided"} />
              <ReviewRow label="Email"               value={ngoData.email} />
              <ReviewRow label="Mobile"              value={ngoData.mobile} />
              <ReviewRow label="Address"             value={`${ngoData.district}, ${ngoData.state} - ${ngoData.pincode}`} />
              <ReviewRow label="Representative"      value={representative.fullName ? `${representative.fullName} (${representative.designation})` : "—"} />
              <ReviewRow label="Bank"                value={bankData.bankName ? `${bankData.bankName} — ${bankData.branchName}` : "—"} />
              <ReviewRow label="Account"             value={bankData.accountNumber ? `****${bankData.accountNumber.slice(-4)}` : "—"} last />
            </SectionCard>

            {/* Declaration */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  By submitting, you confirm that all information and documents provided are
                  <span className="font-semibold"> genuine, accurate, and legally valid</span>.
                  Providing false information may result in rejection or legal action.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group select-none">
                {/* <div
                  onClick={() => setDeclarationAccepted((p) => !p)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition
                    ${declarationAccepted
                      ? "bg-[#D2252B] border-[#D2252B]"
                      : "border-gray-300 bg-white group-hover:border-[#D2252B]"}`}
                >
                  {declarationAccepted && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                </div> */}
                {/* <input
                  type="checkbox"
                  className="sr-only"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700 leading-snug">
                  I agree to the verification declaration and confirm all details submitted are accurate and truthful.
                </span> */}
              </label>
            </div>

            <StepFooter
              onBack={() => setStep(4)}
              onNext={handleSubmitNgo}
              loading={loading}
              nextLabel="Submit for Verification"
              isSubmit
            />
          </div>
        )}
      </main>
    </div>
  );
}
