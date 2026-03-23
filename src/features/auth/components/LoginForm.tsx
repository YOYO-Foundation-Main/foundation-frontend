import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

export default function LoginForm({ switchToSignup }: any) {
  return (
    <div className="w-full md:w-1/2 bg-white p-8 md:p-12">

      <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
        Sign in to continue
      </h2>

      {/* INPUT */}
      <div className="mb-6">
        <label className="text-sm text-gray-600">
          Login via Email <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter your username/email"
          className="w-full mt-2 px-4 py-3 rounded-full border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      {/* PHONE LOGIN */}
      <p className="text-sm text-gray-500 text-center mb-4">
        Login with Phone number?{" "}
        <span className="text-red-500 cursor-pointer">
          Click here
        </span>
      </p>

      <p className="text-center text-gray-500 mb-4">Or</p>

      {/* SOCIAL */}
      <div className="flex justify-center gap-4 mb-6">
        <button className="p-3 border rounded-full">
          <FcGoogle size={20} />
        </button>
        <button className="p-3 bg-blue-600 text-white rounded-full">
          <FaFacebookF size={16} />
        </button>
      </div>

      {/* REGISTER SWITCH */}
      <p className="text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <span
          onClick={switchToSignup}
          className="text-red-500 cursor-pointer"
        >
          Register
        </span>
      </p>

      {/* TERMS */}
      <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
        By continuing, you agree to the YOYO Foundation{" "}
        <span className="underline cursor-pointer">terms</span> and acknowledge
        receipt of our{" "}
        <span className="underline cursor-pointer">privacy notice</span>.
      </p>

      {/* BUTTON */}
      <div className="mt-8">
        <button className="w-full py-3 rounded-full bg-gray-300 text-white">
          Sign In
        </button>
      </div>
    </div>
  );
}