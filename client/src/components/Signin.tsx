import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const Signin: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const [showOtp, setShowOtp] = useState(false);
  const [isEyeOpen, setIsEyeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!showOtp) {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
          {
            email: formData.email,
          }
        );

        if (res.data.success) {
          setShowOtp(true);
          toast.success("OTP sent to email.");
        }
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/login-verify`,
          {
            email: formData.email,
            otp: formData.otp,
          }
        );

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          toast.success("Login successful!");
          navigate("/");
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section (form) */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center">
        {/* Logo */}
        <div className="absolute sm:left-10 sm:top-10 top-10 flex items-center ">
          <img src="/top.svg" alt="HD Logo" className="h-9 w-9" /> <span className="text-2xl font-semibold">HD</span>
        </div>

        <div className="w-full flex flex-col justify-center max-w-sm space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center sm:text-start mt-6">
            Sign in
          </h2>
          <p className="text-sm text-gray-500 text-center sm:text-start">
            Please login to continue to your account.
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jonas_khanwald@gmail.com"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  autoComplete="off"
                  className="w-full py-2 outline-none"
                />
                <div
                  className="cursor-pointer"
                  onClick={() => setIsEyeOpen((prev) => !prev)}
                >
                  {isEyeOpen ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
            )}

            {showOtp && (
              <p
                className="text-blue-500 underline cursor-pointer text-sm"
                onClick={() => {
                  if (formData.email) {
                    axios
                      .post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                        email: formData.email,
                      })
                      .then(() => toast.success("OTP resent!"))
                      .catch(() => toast.error("Failed to resend OTP"));
                  }
                }}
              >
                Resend OTP
              </p>
            )}

            <div className="flex items-center gap-3">
              <input type="checkbox" id="keepLoggedIn" className="size-4" />
              <label htmlFor="keepLoggedIn">Keep me logged in</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading
                ? showOtp
                  ? "Signing in..."
                  : "Sending OTP..."
                : showOtp
                ? "Sign in"
                : "Get OTP"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Need an account?{" "}
            <Link to="/signup" className="text-blue-600 underline">
              Create One
            </Link>
          </p>
        </div>
      </div>

      {/* Right section (image) */}
      <div className="hidden lg:block lg:w-3/5">
        <img
          src="/image.jpg"
          alt="Signin visual"
          className="w-full h-full object-cover rounded-l-xl"
        />
      </div>
    </div>
  );
};

export default Signin;
