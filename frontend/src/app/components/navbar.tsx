"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

interface RegisterFormData {
  email: string;
  accountName: string;
  password: string;
  confirmPassword: string;
}

const Navbar = () => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // ✅ Check login state on page load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const savedRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      if (savedRole) setRole(savedRole);
    }
  }, []);

  const handleLoginModalClose = () => setIsLoginModalOpen(false);
  const handleRegisterModalClose = () => setIsRegisterModalOpen(false);

  // ✅ Login API call
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();

      // Save tokens & role
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role);

      setIsLoggedIn(true);
      setRole(data.role);
      setIsLoginModalOpen(false);

      // ✅ Redirect to chat page after login
      router.push("/chat");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  // ✅ Registration (demo)
  const handleRegister = async (formData: RegisterFormData) => {
    console.log("Register:", formData);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Registration successful!");
  };

  // ✅ Navigate to correct profile
  const handleProfileClick = () => {
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/profile");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    router.push("/");
  };

  return (
    <nav className="bg-blue-600 text-white pl-4 md:pl-6 pr-2 md:pr-4 py-3.5 shadow-lg fixed w-full top-0 z-50">
      <div className="flex items-center justify-between px-2 mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="bg-orange-500 p-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            </svg>
          </Link>
          <Link
            href="/"
            className="text-xs md:text-base lg:text-xl font-semibold hover:text-blue-200 transition-colors"
          >
            AI Smart University Helpdesk
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex items-center space-x-4 text-sm md:text-base">
          <Link href="#about" className="hover:text-yellow-200">
            About Us
          </Link>
          <Link href="#services" className="hover:text-yellow-200">
            Services
          </Link>
          <Link href="#contact" className="hover:text-yellow-200">
            Contact
          </Link>

          {/* ✅ Login or Profile */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleProfileClick}
                className="p-2 bg-yellow-300 rounded-full hover:bg-yellow-400 transition"
                title="Go to profile"
              >
                {/* <FaUserCircle className="text-blue-900 w-6 h-6" /> */}
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-red-200 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-yellow-300 text-blue-900 px-3 py-2 rounded-md font-medium hover:bg-yellow-400 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        onLogin={handleLogin}
        onRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onForgotPassword={() => {}}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleRegisterModalClose}
        onRegister={handleRegister}
        onLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </nav>
  );
};

export default Navbar;
