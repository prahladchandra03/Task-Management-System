"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, User } from "lucide-react"; // User icon import kiya
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // State user ke naam ke liye
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("accessToken");
      const savedName = localStorage.getItem("userName"); // Name retrieve karein
      
      if (token) {
        // Agar naam nahi mila to default 'User' dikhayega
        setUserName(savedName || "User");
      } else {
        setUserName(null);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName"); // Logout par naam bhi hatayein
    setUserName(null);
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            TaskManager
          </Link>

          {/* Right Side Section */}
          <div className="flex items-center gap-4">
            {userName ? (
              // --- LOGIN HONE PAR: NAME + LOGOUT ---
              <div className="flex items-center gap-4">
                
                {/* User Name Display */}
                <div className="hidden md:flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border">
                  <User size={18} className="text-blue-600" />
                  <span className="font-medium text-sm capitalize">{userName}</span>
                </div>

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                >
                  <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              // --- LOGIN NAHI HONE PAR ---
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}