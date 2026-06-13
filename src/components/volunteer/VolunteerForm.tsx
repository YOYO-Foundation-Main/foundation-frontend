// "use client";

// import Image from "next/image";
// import { useState } from "react";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { toast } from "sonner";

// import { applyVolunteer } from "@/features/auth/api/volunteer.api";


// const volunteerSchema = z.object({
//   fullName: z.string().min(2, "Full name is required"),

//   email: z.string().email("Valid email required"),

//   mobile: z.string().min(10, "Valid mobile required"),

//   city: z.string().min(2),

//   state: z.string().min(2),

//   age: z.coerce.number().min(18),

//   gender: z.string().min(1),

//   availability: z.string().min(1),

//   weeklyHours: z.string().min(1),

//   linkedIn: z.string().optional(),

//   instagram: z.string().optional(),

//   facebook: z.string().optional(),

//   motivation: z.string().min(20),

//   skills: z.array(z.string()).min(1),

//   interests: z.array(z.string()).min(1),
// });

// type VolunteerFormData =
//   z.infer<typeof volunteerSchema>;

// const skillOptions = [
//   "Fundraising",
//   "Photography",
//   "Graphic Design",
//   "Social Media",
//   "Teaching",
//   "Event Management",
//   "Content Writing",
//   "Video Editing",
// ];

// const interestOptions = [
//   "Children Education",
//   "Animal Welfare",
//   "Clean Water",
//   "Women Empowerment",
//   "Disaster Relief",
//   "Environment",
//   "Elder Care",
// ];


// export default function VolunteerForm() {

//   const [submitted, setSubmitted] =
//     useState(false);

//   const [applicationId, setApplicationId] =
//     useState<number | null>(null);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: {
//       errors,
//       isSubmitting,
//     },
//   } = useForm<VolunteerFormData>({
//     resolver: zodResolver(
//       volunteerSchema
//     ),

//     defaultValues: {
//       skills: [],
//       interests: [],
//     },
//   });

//   const skills =
//     watch("skills") || [];

//   const interests =
//     watch("interests") || [];

//   const onSubmit = async (
//     data: VolunteerFormData
//   ) => {
//     try {

//       const response =
//         await applyVolunteer(data);

//       setApplicationId(
//         response.data.id
//       );

//       setSubmitted(true);

//       toast.success(
//         "Application submitted successfully"
//       );

//     } catch (error: any) {

//       toast.error(
//         error.message
//       );
//     }
//   };


//   // ✅ THIS MUST ALSO BE INSIDE COMPONENT
//   if (submitted) {
//     return (
//       <section className="py-20 bg-[#f8f8f8]">
//         <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-10 text-center">

//           <h2 className="text-3xl font-bold text-green-600 mb-4">
//             🎉 Application Submitted
//           </h2>

//           <p className="text-gray-600 mb-4">
//             Thank you for joining Foundation as a volunteer.
//           </p>

//           <p className="font-semibold text-lg">
//             Application ID:
//             #{applicationId}
//           </p>

//         </div>
//       </section>
//     );
//   }
//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-4"
//     >

//       <h3 className="text-xl font-bold">
//         Join As Volunteer
//       </h3>

//       <input
//         {...register("fullName")}
//         placeholder="Full Name"
//         className="w-full border rounded-lg px-4 py-3"
//       />

//       <input
//         {...register("email")}
//         placeholder="Email"
//         className="w-full border rounded-lg px-4 py-3"
//       />

//       <input
//         {...register("mobile")}
//         placeholder="Mobile Number"
//         className="w-full border rounded-lg px-4 py-3"
//       />

//       <div className="grid md:grid-cols-2 gap-4">

//         <input
//           {...register("city")}
//           placeholder="City"
//           className="w-full border rounded-lg px-4 py-3"
//         />

//         <input
//           {...register("state")}
//           placeholder="State"
//           className="w-full border rounded-lg px-4 py-3"
//         />

//       </div>

//       <div className="grid md:grid-cols-2 gap-4">

//         <input
//           type="number"
//           {...register("age")}
//           placeholder="Age"
//           className="w-full border rounded-lg px-4 py-3"
//         />

//         <select
//           {...register("gender")}
//           className="w-full border rounded-lg px-4 py-3"
//         >
//           <option value="">
//             Select Gender
//           </option>

//           <option value="Male">
//             Male
//           </option>

//           <option value="Female">
//             Female
//           </option>

//           <option value="Other">
//             Other
//           </option>

//         </select>

//       </div>

//       <select
//         {...register("availability")}
//         className="w-full border rounded-lg px-4 py-3"
//       >
//         <option value="">
//           Availability
//         </option>

//         <option>
//           Weekdays
//         </option>

//         <option>
//           Weekends
//         </option>

//         <option>
//           Flexible
//         </option>

//       </select>

//       <select
//         {...register("weeklyHours")}
//         className="w-full border rounded-lg px-4 py-3"
//       >
//         <option value="">
//           Weekly Hours
//         </option>

//         <option>
//           1-5 Hours
//         </option>

//         <option>
//           5-10 Hours
//         </option>

//         <option>
//           10+ Hours
//         </option>

//       </select>

//       <div>

//         <p className="font-semibold mb-2">
//           Skills
//         </p>

//         <div className="grid grid-cols-2 gap-2">

//           {skillOptions.map(
//             (skill) => (
//               <label
//                 key={skill}
//                 className="flex gap-2"
//               >
//                 <input
//                   type="checkbox"
//                   checked={skills.includes(
//                     skill
//                   )}
//                   onChange={(e) => {

//                     if (
//                       e.target.checked
//                     ) {
//                       setValue(
//                         "skills",
//                         [
//                           ...skills,
//                           skill,
//                         ]
//                       );
//                     } else {
//                       setValue(
//                         "skills",
//                         skills.filter(
//                           (s) =>
//                             s !== skill
//                         )
//                       );
//                     }
//                   }}
//                 />
//                 {skill}
//               </label>
//             )
//           )}

//         </div>

//       </div>

//       <div>

//         <p className="font-semibold mb-2">
//           Interest Areas
//         </p>

//         <div className="grid grid-cols-2 gap-2">

//           {interestOptions.map(
//             (interest) => (
//               <label
//                 key={interest}
//                 className="flex gap-2"
//               >
//                 <input
//                   type="checkbox"
//                   checked={interests.includes(
//                     interest
//                   )}
//                   onChange={(e) => {

//                     if (
//                       e.target.checked
//                     ) {
//                       setValue(
//                         "interests",
//                         [
//                           ...interests,
//                           interest,
//                         ]
//                       );
//                     } else {
//                       setValue(
//                         "interests",
//                         interests.filter(
//                           (i) =>
//                             i !== interest
//                         )
//                       );
//                     }
//                   }}
//                 />
//                 {interest}
//               </label>
//             )
//           )}

//         </div>

//       </div>

//       <input
//         {...register("linkedIn")}
//         placeholder="LinkedIn"
//         className="w-full border rounded-lg px-4 py-3"
//       />

//       <input
//         {...register("instagram")}
//         placeholder="Instagram"
//         className="w-full border rounded-lg px-4 py-3"
//       />

//       <input
//         {...register("facebook")}
//         placeholder="Facebook"
//         className="w-full border rounded-lg px-4 py-3"
//       />

//       <textarea
//         {...register("motivation")}
//         placeholder="Why do you want to volunteer?"
//         className="w-full border rounded-lg px-4 py-3 h-32"
//       />

//       <button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full bg-[#D2252B] text-white py-3 rounded-lg"
//       >
//         {isSubmitting
//           ? "Submitting..."
//           : "Apply as Volunteer"}
//       </button>

//     </form>
//   );
// }


//new form of volunteer 

"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
  User, Mail, Phone, MapPin, Calendar, Users as UsersIcon,
  Clock, Linkedin, Instagram, Facebook, MessageSquare,
  CheckCircle2, AlertCircle, Loader2, Heart, Award,
} from "lucide-react";

import { applyVolunteer } from "@/features/auth/api/volunteer.api";

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA — aligned with backend Joi validation
// ─────────────────────────────────────────────────────────────────────────────
const volunteerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be at most 15 digits"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  age: z.preprocess(
    (value) => {
      if (
        value === "" ||
        value === undefined ||
        value === null
      ) {
        return undefined;
      }

      return Number(value);
    },

    z.number()
      .int("Age must be a whole number")
      .min(16, "You must be at least 16 years old")
      .optional()
  ),
  gender: z.string().optional(),
  availability: z.string().optional(),
  weeklyHours: z.string().optional(),
  linkedIn: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
  motivation: z.string().optional().or(z.literal("")),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interests: z.array(z.string()).min(1, "Select at least one interest area"),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

const skillOptions = [
  "Fundraising",
  "Photography",
  "Graphic Design",
  "Social Media",
  "Teaching",
  "Event Management",
  "Content Writing",
  "Video Editing",
];

const interestOptions = [
  "Children Education",
  "Animal Welfare",
  "Clean Water",
  "Women Empowerment",
  "Disaster Relief",
  "Environment",
  "Elder Care",
];

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE FIELD COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
      {text}
      {required ? (
        <span className="text-[#D2252B] text-xs font-bold" title="Required">*</span>
      ) : (
        <span className="text-gray-400 text-xs font-normal">(optional)</span>
      )}
    </label>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium mt-1.5">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10";

function fieldClass(hasError?: boolean, withIcon?: boolean) {
  return `${inputBase} ${hasError ? "border-red-400 bg-red-50/50" : "border-gray-200 hover:border-gray-300"} ${withIcon ? "pl-10" : ""}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function VolunteerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);

  const form = useForm<VolunteerFormData>({
    resolver:
      zodResolver(volunteerSchema) as any,

    defaultValues: {
      skills: [],
      interests: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = form;

  const skills = watch("skills") || [];
  const interests = watch("interests") || [];

  const onSubmit = async (data: VolunteerFormData) => {
    try {
      // Normalize empty-string age to undefined before sending
      const payload = {
        ...data,
        age: data.age === ("" as any) ? undefined : data.age,
      };

      const response = await applyVolunteer(payload);

      setApplicationId(response.data.id);
      setSubmitted(true);

      toast.success("Application submitted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit application");
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section className="py-20 bg-[#f8f8f8]">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold text-green-600 mb-3">
            Application Submitted
          </h2>

          <p className="text-gray-600 mb-5">
            Thank you for joining Foundation as a volunteer. Our team will review your application shortly.
          </p>

          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3">
            <span className="text-sm text-gray-500">Application ID</span>
            <span className="font-bold text-lg text-gray-900">#{applicationId}</span>
          </div>
        </div>
      </section>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Join As Volunteer</h3>
        <p className="text-sm text-gray-500 mt-1">
          Fields marked with <span className="text-[#D2252B] font-bold">*</span> are required.
        </p>
      </div>

      {/* ── Personal Details ── */}
      <div className="space-y-4">
        <div>
          <Label text="Full Name" required />
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              {...register("fullName")}
              placeholder="John Doe"
              className={fieldClass(!!errors.fullName, true)}
            />
          </div>
          <ErrorText message={errors.fullName?.message} />
        </div>

        <div>
          <Label text="Email" required />
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className={fieldClass(!!errors.email, true)}
            />
          </div>
          <ErrorText message={errors.email?.message} />
        </div>

        <div>
          <Label text="Mobile Number" required />
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              {...register("mobile")}
              placeholder="9876543210"
              className={fieldClass(!!errors.mobile, true)}
            />
          </div>
          <ErrorText message={errors.mobile?.message} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label text="City" required />
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                {...register("city")}
                placeholder="Ahmedabad"
                className={fieldClass(!!errors.city, true)}
              />
            </div>
            <ErrorText message={errors.city?.message} />
          </div>

          <div>
            <Label text="State" required />
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                {...register("state")}
                placeholder="Gujarat"
                className={fieldClass(!!errors.state, true)}
              />
            </div>
            <ErrorText message={errors.state?.message} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label text="Age" />
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="number"
                {...register("age")}
                placeholder="25"
                className={fieldClass(!!errors.age, true)}
              />
            </div>
            <ErrorText message={errors.age?.message} />
          </div>

          <div>
            <Label text="Gender" />
            <div className="relative">
              <UsersIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
              <select
                {...register("gender")}
                className={`${fieldClass(!!errors.gender, true)} appearance-none cursor-pointer`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <ErrorText message={errors.gender?.message} />
          </div>
        </div>
      </div>

      {/* ── Availability ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label text="Availability" />
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
            <select
              {...register("availability")}
              className={`${fieldClass(!!errors.availability, true)} appearance-none cursor-pointer`}
            >
              <option value="">Select Availability</option>
              <option>Weekdays</option>
              <option>Weekends</option>
              <option>Flexible</option>
            </select>
          </div>
          <ErrorText message={errors.availability?.message} />
        </div>

        <div>
          <Label text="Weekly Hours" />
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
            <select
              {...register("weeklyHours")}
              className={`${fieldClass(!!errors.weeklyHours, true)} appearance-none cursor-pointer`}
            >
              <option value="">Select Weekly Hours</option>
              <option>1-5 Hours</option>
              <option>5-10 Hours</option>
              <option>10+ Hours</option>
            </select>
          </div>
          <ErrorText message={errors.weeklyHours?.message} />
        </div>
      </div>

      {/* ── Skills ── */}
      <div>
        <Label text="Skills" required />
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {skillOptions.map((skill) => {
            const checked = skills.includes(skill);
            return (
              <label
                key={skill}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm cursor-pointer transition
                  ${checked ? "border-[#D2252B] bg-[#D2252B]/5 text-gray-900 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue("skills", [...skills, skill], { shouldValidate: true });
                    } else {
                      setValue("skills", skills.filter((s) => s !== skill), { shouldValidate: true });
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#D2252B] focus:ring-[#D2252B]/20 shrink-0"
                />
                <span className="truncate">{skill}</span>
              </label>
            );
          })}
        </div>
        <ErrorText message={errors.skills?.message as string | undefined} />
      </div>

      {/* ── Interest Areas ── */}
      <div>
        <Label text="Interest Areas" required />
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {interestOptions.map((interest) => {
            const checked = interests.includes(interest);
            return (
              <label
                key={interest}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm cursor-pointer transition
                  ${checked ? "border-[#D2252B] bg-[#D2252B]/5 text-gray-900 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue("interests", [...interests, interest], { shouldValidate: true });
                    } else {
                      setValue("interests", interests.filter((i) => i !== interest), { shouldValidate: true });
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#D2252B] focus:ring-[#D2252B]/20 shrink-0"
                />
                <span className="truncate">{interest}</span>
              </label>
            );
          })}
        </div>
        <ErrorText message={errors.interests?.message as string | undefined} />
      </div>

      {/* ── Social Links ── */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Award className="h-4 w-4 text-[#D2252B]" />
          Social Profiles
          <span className="text-gray-400 text-xs font-normal">(optional)</span>
        </p>

        <div>
          <Label text="LinkedIn" />
          <div className="relative">
            <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              {...register("linkedIn")}
              placeholder="https://linkedin.com/in/yourprofile"
              className={fieldClass(!!errors.linkedIn, true)}
            />
          </div>
          <ErrorText message={errors.linkedIn?.message} />
        </div>

        <div>
          <Label text="Instagram" />
          <div className="relative">
            <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              {...register("instagram")}
              placeholder="https://instagram.com/yourprofile"
              className={fieldClass(!!errors.instagram, true)}
            />
          </div>
          <ErrorText message={errors.instagram?.message} />
        </div>

        <div>
          <Label text="Facebook" />
          <div className="relative">
            <Facebook className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              {...register("facebook")}
              placeholder="https://facebook.com/yourprofile"
              className={fieldClass(!!errors.facebook, true)}
            />
          </div>
          <ErrorText message={errors.facebook?.message} />
        </div>
      </div>

      {/* ── Motivation ── */}
      <div>
        <Label text="Why do you want to volunteer?" />
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <textarea
            {...register("motivation")}
            placeholder="Tell us what motivates you to volunteer with us..."
            className={`${fieldClass(!!errors.motivation, true)} h-32 resize-none pt-3`}
          />
        </div>
        <ErrorText message={errors.motivation?.message} />
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-[#D2252B] hover:bg-[#b81e23] text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-[#D2252B]/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Heart className="h-4 w-4" />
            Apply as Volunteer
          </>
        )}
      </button>
    </form>
  );
}
