import React, { useState } from "react";
import logo from "../assets/logo.png";
import Aurora from "@/components/Aurora";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react"; // ✅ import success icon
import { Link, useRouter } from "@tanstack/react-router";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError(null);

    try {
      const response = await fetch("http://localhost:5050/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Store JWT
      localStorage.setItem("token", data.user.token);

      setSuccess(data.message);

      // Delay redirect so success alert is visible
      setTimeout(() => {
        router.navigate({ to: "/dashboard" });
      }, 3000);
      console.log("Login success state:", data.message);
      // Reset form
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen font-raleway 
      bg-gradient-to-tr from-[#000000] via-[#030207] to-[#18025b]"
    >
      <Aurora
        colorStops={["#BBC5BA", "#3306C6", "#8170C2"]}
        blend={1.5}
        amplitude={1.0}
        speed={1.93}
      />
      <div className="flex flex-col items-center w-full max-w-md gap-20">
        <div className="text-center space-y-6">
          <img
            src={logo}
            alt="LightSave Logo"
            className="mx-auto w-40 fixed top-0 left-2 mt-5 p-4"
          />
          <div className="text-white space-y-4 text-2xl tracking-wide">
            <h1>
              Introducing you to{" "}
              <span className="text-4xl font-bold">LightSave</span>
            </h1>
            <p className="text-sm text-gray-400">
              Helping you make better financial decisions
            </p>
          </div>
        </div>

        {/* Login form */}
        <form
          className="bg-white p-10 rounded-lg shadow-sm shadow-blue-700 w-full max-w-md mb-50"
          onSubmit={handleLogin}
        >
          <h2 className="text-2xl font-medium mb-6 text-center">
            Welcome Back!{" "}
            <span className="text-gray-400 text-sm block font-normal">
              Let's get you signed in securely
            </span>
          </h2>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon />
              <AlertTitle>Validation Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircleIcon className="text-green-600" />
              <AlertTitle>Login Successful</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded hover:border-[#3306C6]  
                  focus:ring-[#3306C6] focus:border-transparent transition"
                placeholder="Enter your email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium"
              >
                Password
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded hover:border-[#3306C6]  
                  focus:ring-[#3306C6] focus:border-transparent transition"
                placeholder="Enter your password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="bg-black text-white mt-7 w-full p-2 rounded-lg hover:bg-[#29186d] transition-colors"
            type="submit"
          >
            Login
          </button>

          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#3306C6]  hover:text-amber-500"
            >
              Get Started
            </Link>
          </p>
        </form>
        <div className="text-gray-100 fixed bottom-30 text-xs max-w-[15rem] text-center leading-relaxed cursor-pointer">
          By clicking continue,you agree to our{" "}
          <a className=" border-b pb-[0.5px] hover:text-amber-100">
            Terms of service
          </a>{" "}
          and{" "}
          <a className=" border-b pb-[0.5px]  hover:text-amber-100">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
