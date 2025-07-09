import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Facebook,
  Twitter,
  Github,
} from "lucide-react";
import LSNavBar from "@/components/NavBar/NavBarLS";
import { useRouter } from "next/router";
import { register } from "@/lib/api";
import { useAuth } from "@/Context/AuthContext";
import Link from "next/link";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bankName: "",
    bankBranch: "",
    bankAccountNo: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.bankName) newErrors.bankName = "Bank name is required";
    if (!formData.bankBranch) newErrors.bankBranch = "Bank branch is required";
    if (!formData.bankAccountNo)
      newErrors.bankAccountNo = "Account number is required";

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.agreedToTerms) {
      setError("You must agree to the terms and conditions");
      setLoading(false);
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      setLoading(false);
      return;
    }

    try {
      const userData = await register(formData);
      login(userData);
      router.push("/profile");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <LSNavBar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-12">
        {/* Logo/Title */}
        <h1 className="text-3xl font-bold text-blue-600 mb-12">
          Rithu Business Lanka
        </h1>

        {/* Signup Form */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Create your account
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            <p className="text-gray-600 mb-8">
              Already have an account?{" "}
              <a
                href="/LoginPage/page"
                className="text-blue-600 hover:text-blue-700"
              >
                Log in here
              </a>
            </p>

            <div className="space-y-6">
              <form onSubmit={handleSubmit}>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+94 71 234 5678"
                    required
                  />
                </div>

                {/* Bank Details Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Bank Details (for SocialPay payments)
                  </h3>

                  {/* Bank Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Commercial Bank of Ceylon"
                      required
                    />
                  </div>

                  {/* Bank Branch */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank branch
                    </label>
                    <input
                      type="text"
                      name="bankBranch"
                      value={formData.bankBranch}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Colombo Main Branch"
                      required
                    />
                  </div>

                  {/* Bank Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank account number
                    </label>
                    <input
                      type="text"
                      name="bankAccountNo"
                      value={formData.bankAccountNo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your account number"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SocialPay Section */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-800">
                      Join SocialPay today
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li className="flex items-center">
                      <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                      Earn 80¢ for every like on your content
                    </li>
                    <li className="flex items-center">
                      <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                      Connect all your social media accounts
                    </li>
                    <li className="flex items-center">
                      <span className="w-1 h-1 bg-blue-600 rounded-full mr-2"></span>
                      Get paid weekly via your preferred method
                    </li>
                  </ul>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    required
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </button>

                {/* Social Login */}
                <div className="mt-6">
                  <div className="text-center text-sm text-gray-500 mb-4">
                    Or sign up with
                  </div>
                  <div className="flex justify-center space-x-6">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Facebook className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Twitter className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Github className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
