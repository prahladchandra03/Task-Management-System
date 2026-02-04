"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      toast.success("Registered successfully! Please login.");
      router.push("/auth/login");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="grid md:grid-cols-2 items-center gap-8 max-w-6xl w-full p-4 rounded-md shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] bg-white">
        
        {/* Left Form */}
        <div className="w-full px-6 py-6">
          <form onSubmit={handleRegister}>
            <div className="mb-12">
              <h1 className="text-slate-900 text-3xl font-bold">
                Create account
              </h1>
              <p className="text-[15px] mt-6 text-slate-600">
                Already have an account?
                <a
                  href="/auth/login"
                  className="text-blue-600 font-medium hover:underline ml-1"
                >
                  Sign in
                </a>
              </p>
            </div>

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                placeholder="First name"
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              <input
                required
                placeholder="Last name"
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="mt-8">
              <label className="text-slate-900 text-[13px] font-medium block mb-2">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="Enter email"
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
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
                placeholder="Create password"
                className="w-full text-slate-900 text-sm border-b border-slate-300 focus:border-blue-600 px-2 py-3 outline-none"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {/* Button */}
            <div className="mt-12">
              <button
                type="submit"
                className="w-full py-2.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-xl"
              >
                Register
              </button>
            </div>
          </form>
        </div>

        {/* Right Image */}
        <div className="w-full h-full flex items-center bg-[#000842] rounded-xl p-8">
          <img
            src="https://readymadeui.com/signin-image.webp"
            alt="register"
            className="w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
