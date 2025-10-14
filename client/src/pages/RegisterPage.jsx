import React, { useState, useEffect } from "react";
import Aurora from "@/components/Aurora";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircleIcon, LoaderCircle } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function RegisterPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const router = useRouter();

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
        router.navigate({ to: "/login" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    setError(null);

    // Send data to backend
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstname, lastname, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }
      console.log("Registered user:", data.user);

      // Reset form
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setIsLoading(false);
        setSuccess(data.message);
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setIsLoading(false);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full min-h-[100dvh] px-4 sm:px-6 py-8 sm:py-10 font-raleway bg-gradient-to-tr from-[#04520e] via-[#e5ded2] to-[#04520e] dark:from-black dark:via-[#0f2f2f] dark:to-black overflow-x-hidden transition-all duration-700 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute top-4 left-4 z-20 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
        Powered by{" "}
        <span className="font-semibold text-white dark:text-emerald-300">
          TheFifthLab
        </span>
      </div>
      {/* <div className="absolute inset-0 z-0 backdrop-blur-xl bg-white/30 dark:bg-black/40" /> */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <Aurora
          colorStops={["#ffffff", "#bbf7d0", "#34d399", "#0d9488", "#134e4a"]}
          blend={1.5}
          amplitude={0.8}
          speed={1.5}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-xl" />
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto gap-6 sm:gap-8 md:gap-10 px-4 sm:px-8 md:px-0 z-10">
        <div className="text-center space-y-4">
          <h1>
            <span
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent drop-shadow-lg break-words"
              style={{
                backgroundImage:
                  "linear-gradient(220deg, #a7f3d0 0%, #34d399 25%, #10b981 50%, #0d9488 75%, #064e3b 100%)",
                textShadow: "0 0 15px rgba(16, 185, 129, 0.5)",
              }}
            >
              LightSave
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200 max-w-md mx-auto leading-relaxed break-words">
            Helping you make smarter financial decisions with ease and clarity.
          </p>
        </div>

        <Card className="w-full bg-[#f8f5f0]/90 dark:bg-[#0d1b1b]/90 backdrop-blur-xl border border-gray-100/90 dark:border-gray-700 shadow-xl shadow-emerald-600/40 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-6 sm:py-8">
          <CardHeader className="text-center">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold">
              Get Started
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base block text-gray-400 dark:text-gray-300 font-normal ">
              Create your account securely
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="mb-2 dark:bg-muted-foreground dark:border-red-100"
                >
                  <AlertCircleIcon />
                  <AlertTitle>Validation Error!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert
                  variant="success"
                  className="mb-2 border-green-500 bg-green-50 dark:bg-teal-900/30 dark:border-green-600 dark:text-green-100"
                >
                  <CheckCircleIcon className="text-green-600" />
                  <AlertTitle>Registered Successfully</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="firstname"
                    className="block text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-transparent text-gray-900 dark:text-gray-100 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="lastname"
                    className="block text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-transparent text-gray-900 dark:text-gray-100 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="block text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-transparent text-gray-900 dark:text-gray-100 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="block text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-transparent text-gray-900 dark:text-gray-100 transition"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm sm:text-base font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-transparent text-gray-900 dark:text-gray-100 transition mb-5"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <button
                type="submit"
                className="bg-[#0d9488] dark:bg-emerald-600 text-white w-full p-2 rounded-lg hover:bg-[#134e4a] dark:hover:bg-emerald-700 transition-colors"
              >
                Register
              </button>
              <p className="text-xs sm:text-sm text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#0d9488] dark:text-emerald-400 hover:text-[#134e4a]"
                >
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        <div className="text-center px-4 text-gray-600 dark:text-gray-400 text-[10px] sm:text-sm md:text-base leading-relaxed">
          By clicking continue, you agree to our{" "}
          <a className="border-b border-gray-400 dark:border-gray-600 hover:text-[#5a7d70] dark:hover:text-emerald-300 transition-colors cursor-pointer">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="border-b border-gray-400 dark:border-gray-600 hover:text-[#5a7d70] dark:hover:text-emerald-300 transition-colors cursor-pointer">
            Privacy Policy
          </a>
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
          <LoaderCircle className="w-12 h-12 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
