"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Loading Icon

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 1. Loading State added

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const { data } = await api.post("/auth/login", { email, password });
      
      // Tokens Save
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // 2. IMPORTANT: User Name Save for Navbar
      const displayName = data.user.firstName 
        ? `${data.user.firstName} ${data.user.lastName || ''}` 
        : data.user.email;
      localStorage.setItem("userName", displayName);

      toast.success("Logged in successfully");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="grid md:grid-cols-2 items-center gap-8 max-w-6xl w-full p-4 rounded-md shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] bg-white">
        
        {/* Left Form */}
        <div className="w-full px-6 py-6">
          <form onSubmit={handleLogin}>
            <div className="mb-12">
              <h1 className="text-slate-900 text-3xl font-bold">
                Sign in
              </h1>
              <p className="text-[15px] mt-6 text-slate-600">
                Don't have an account?
                <a
                  href="/auth/register"
                  className="text-blue-600 font-medium hover:underline ml-1"
                >
                  Register here
                </a>
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="text-slate-900 text-[13px] font-medium block mb-2">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
              />
            </div>

            {/* Password */}
            <div className="mt-8">
              <label className="text-slate-900 text-[13px] font-medium block mb-2">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between mt-8">
              <label className="flex items-center text-sm text-slate-900">
                <input type="checkbox" className="h-4 w-4 mr-2" />
                Remember me
              </label>
            </div>

            {/* Submit Button with Loading State */}
            <div className="mt-12">
              <button
                type="submit"
                disabled={loading} // Disable button while loading
                className="w-full py-2.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-xl flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign in"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Image */}
        <div className="w-full h-full flex items-center bg-[#000842] rounded-xl p-8 hidden md:flex">
          <img
            src="https://readymadeui.com/signin-image.webp"
            alt="login"
            className="w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}