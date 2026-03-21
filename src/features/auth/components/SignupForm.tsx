export default function SignupForm({ switchToLogin }: any) {
  return (
    <div className="w-full md:w-1/2 bg-white p-8 md:p-12">

      <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
        Sign up to continue
      </h2>

      {/* INPUTS */}
      {["Username", "Email", "Phone Number", "Password"].map((label, i) => (
        <div key={i} className="mb-4">
          <label className="text-sm text-gray-600">
            {label} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={`Enter your ${label.toLowerCase()}`}
            className="w-full mt-2 px-4 py-3 rounded-full border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      ))}

      {/* SWITCH */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <span
          onClick={switchToLogin}
          className="text-red-500 cursor-pointer"
        >
          Sign In
        </span>
      </p>

      {/* BUTTON */}
      <div className="mt-8">
        <button className="w-full py-3 rounded-full bg-gray-300 text-white">
          Sign Up
        </button>
      </div>
    </div>
  );
}