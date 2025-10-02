import React, { useState, useEffect } from "react";
import Aurora from "@/components/Aurora";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircleIcon, LoaderCircle } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";

const BASE_URL = "http://localhost:5050/auth/login";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // validations...
    if (!email || !password) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      setError(null);

      localStorage.setItem("token", data.token);

      // Keep spinner visible for 2 seconds, then show success, then redirect
      setTimeout(() => {
        setIsLoading(false); // hide spinner
        setSuccess(data.message);
        setTimeout(() => {
          router.navigate({ to: "/dashboard" });
        }, 3000);
      }, 2000);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen font-raleway bg-gradient-to-tr from-[#04520e] via-[#e5ded2] to-[#04520e] dark:from-black dark:via-[#0f2f2f] dark:to-black relative overflow-hidden transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="absolute top-4 left-4 z-20 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
        Powered by{" "}
        <span className="font-semibold text-white dark:text-emerald-300">
          TheFifthLab
        </span>
      </div>
      {/* Frosted glass overlay */}
      <div className="absolute inset-0 z-0 backdrop-blur-xl bg-white/30 dark:bg-black/40" />

      <Aurora
        colorStops={["#1b5e20", "#bbf7d0", "#34d399", "#0d9488", "#134e4a"]}
        blend={1.5}
        amplitude={1.0}
        speed={1.93}
      />

      <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-lg gap-8 sm:gap-12 md:gap-20 z-10">
        <div className="text-center space-y-4">
          <h1>
            <span
              className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent drop-shadow-lg"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #134e4a 0%, #0d9488 80%, #34d399 60%, #bbf7d0 85%, #ffffff 100%)",
              }}
            >
              LightSave
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 max-w-md mx-auto leading-relaxed">
            Helping you make smarter financial decisions with ease and clarity.
          </p>
        </div>

        {/* Login form */}
        <form
          className="bg-white dark:bg-[#0d1b1b]/90 backdrop-blur-md p-10 rounded-lg shadow-xl border-gray-100/90 dark:border-gray-700 shadow-emerald-600/40 w-full max-w-md mb-50"
          onSubmit={handleLogin}
        >
          <h2 className="text-2xl font-medium mb-6 text-center">
            Welcome Back!{" "}
            <span className="text-gray-400 dark:text-gray-300 text-sm block font-normal">
              Let's get you signed in securely
            </span>
          </h2>

          {/* Error Alert */}
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 dark:bg-muted-foreground dark:border-red-100"
            >
              <AlertCircleIcon />
              <AlertTitle>Validation Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-teal-900/30 dark:border-green-600 dark:text-green-100">
              <CheckCircleIcon className="text-green-600" />
              <AlertTitle>Login Successful</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </label>
              <input
                className="w-full p-2 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-[#0d9488] dark:focus:border-emerald-400 focus:ring-0 bg-transparent outline-none transition"
                placeholder="Enter your email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>

              <input
                className="w-full p-2 border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-[#0d9488] dark:focus:border-emerald-400 focus:ring-0 bg-transparent outline-none transition"
                placeholder="Enter your password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
              />
            </div>
          </div>

          <button
            className="bg-[#3fa688] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white mt-7 w-full p-2 rounded-lg hover:bg-[#134e4a] transition-colors"
            type="submit"
            disabled={isLoading}
          >
            Login
          </button>

          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#0d9488] dark:text-emerald-400 hover:text-[#134e4a] dark:hover:text-emerald-300"
            >
              Get Started
            </Link>
          </p>
        </form>

        <div className="absolute bottom-4 sm:bottom-6 text-center px-4 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs leading-relaxed">
          By clicking continue, you agree to our{" "}
          <a className="border-b border-gray-400 dark:border-gray-600 hover:text-[#3dc794] dark:hover:text-emerald-300 transition-colors cursor-pointer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="border-b border-gray-400 dark:border-gray-600 hover:text-[#3dc794] dark:hover:text-emerald-300 transition-colors cursor-pointer">
            Privacy Policy
          </a>
        </div>
      </div>

      {/* Full page loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <LoaderCircle className="w-12 h-12 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}

export default LoginPage;
