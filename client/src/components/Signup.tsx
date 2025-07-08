import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "sonner";

const Signup: React.FC = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!showOtp) {
        // Request OTP
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
          {
            name: formData.name,
            dob: formData.dob,
            email: formData.email,
          }
        );
        // console.log("res.data request otp  : ", res.data);
        // console.log("res request otp  : ", res);

        if (res.data.success) {
          setShowOtp(true);
          toast.success(res.data.message);
        }
      } else {
        // Verify OTP and complete signup
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/signup-verify`,
          {
            email: formData.email,
            otp: formData.otp,
          }
        );

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Signup successful!");
          navigate("/home");
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center">
        {/* Logo */}
        <div className="absolute sm:left-10 sm:top-10 top-21  flex items-center">
          <img src="/top.svg" alt="HD Logo" className="h-9 w-9" />  <span className="text-2xl font-semibold">HD</span>
        </div>

        {/* Heading */}
        <div className="w-full flex flex-col justify-center max-w-sm space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center sm:text-start mt-6">
            Sign up
          </h2>
          <p className="text-sm sm:text-start text-center text-gray-500">
            Sign up to enjoy the feature of HD
          </p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleOtp}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jonas Khanwald"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jonas_khanwald@gmail.com"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
                required
              />
            </div>

            {showOtp && (
              <div className="flex items-center px-4 border rounded-md border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  type={isEyeOpen ? "text" : "password"}
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="OTP"
                  className="w-full py-2 outline-none"
                  autoComplete="off"
                />
                <div
                  className="cursor-pointer"
                  onClick={() => setIsEyeOpen((prev) => !prev)}
                >
                  {isEyeOpen ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition cursor-pointer ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading
                ? showOtp
                  ? "Signing up..."
                  : "Sending OTP..."
                : showOtp
                ? "Sign up"
                : "Get OTP"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right section (image) */}
      <div className="hidden lg:block lg:w-3/5">
        <img
          src="/image.jpg"
          alt="Signup visual"
          className="w-full h-full object-cover rounded-l-xl"
        />
      </div>
    </div>
  );
};

export default Signup;
