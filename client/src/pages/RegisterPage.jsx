import React, { useState, useEffect } from "react";
import Aurora from "@/components/Aurora";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircleIcon, LoaderCircle } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";

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

      // Show spinner for 2 seconds, then show success message
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
      className={`flex flex-col items-center justify-center h-screen font-raleway bg-gradient-to-tr from-[#04520e] via-[#e5ded2] to-[#04520e] dark:from-black dark:via-[#0f2f2f] dark:to-black transition-all duration-700 ease-in-out ${isVisible ? "opacity-100" : "opacity-50"}`}
    >
      <div className="absolute top-4 left-4 z-20 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
        Powered by{" "}
        <span className="font-semibold text-white dark:text-emerald-300">
          TheFifthLab
        </span>
      </div>
      <div className="absolute inset-0 z-0 backdrop-blur-xl bg-white/30 dark:bg-black/40" />
      <div className="absolute inset-0 z-0 opacity-40 sm:opacity-60 h-full w-full overflow-hidden">
        <Aurora
          colorStops={["#ffffff", "#bbf7d0", "#34d399", "#0d9488", "#134e4a"]}
          blend={1.5}
          amplitude={0.8}
          speed={1.5}
        />
      </div>

      <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-lg gap-8 sm:gap-12 z-10 px-4 sm:px-6 md:px-0">
        <div className="text-center space-y-4">
          <h1>
            <span
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent drop-shadow-lg break-words"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #134e4a 0%, #0d9488 80%, #34d399 60%, #bbf7d0 85%, #ffffff 100%)",
              }}
            >
              LightSave
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-200 max-w-md mx-auto leading-relaxed break-words">
            Helping you make smarter financial decisions with ease and clarity.
          </p>
        </div>

        <form
          className="bg-[#f8f5f0] dark:bg-[#0d1b1b]/90 backdrop-blur-xl p-4 sm:p-6 md:p-10 rounded-xl dark:border-none border border-gray-100/90 dark:border-gray-700 shadow-xl shadow-emerald-600/40 w-full max-w-full sm:max-w-md"
          onSubmit={handleRegister}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium mb-4 sm:mb-6 text-center break-words">
            Get Started
            <span className="text-gray-400 text-xs sm:text-sm block font-normal mt-1 break-words">
              Create your account securely
            </span>
          </h2>

          {error && (
            <Alert
              variant="destructive"
              className="mb-4 dark:bg-muted-foreground dark:border-red-100 break-words"
            >
              <AlertCircleIcon />
              <AlertTitle>Validation Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert
              variant="success"
              className="mb-4 border-green-500 bg-green-50 dark:bg-teal-900/30 dark:border-green-600 dark:text-green-100 break-words"
            >
              <CheckCircleIcon className="text-green-600" />
              <AlertTitle>You've been registered Successfully</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="firstname"
                className="block mb-1 text-sm sm:text-md font-medium dark:text-gray-200 break-words"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                placeholder="Enter your first name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full p-2 sm:p-2.5 border-b border-gray-300 dark:border-gray-600 focus:border-[#0d9488] dark:focus:border-emerald-400 bg-transparent text-gray-900 dark:text-gray-100 outline-none transition break-words"
              />
            </div>

            <div>
              <label
                htmlFor="lastname"
                className="block mb-1 text-sm sm:text-md font-medium dark:text-gray-200 break-words"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                placeholder="Enter your last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full p-2 sm:p-2.5 border-b border-gray-300 dark:border-gray-600 focus:border-[#0d9488] dark:focus:border-emerald-400 bg-transparent text-gray-900 dark:text-gray-100 outline-none transition break-words"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm sm:text-md font-medium dark:text-gray-200 break-words"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 sm:p-2.5 border-b border-gray-300 dark:border-gray-600 focus:border-[#0d9488] dark:focus:border-emerald-400 bg-transparent text-gray-900 dark:text-gray-100 outline-none transition break-words"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm sm:text-md font-medium dark:text-gray-200 break-words"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 sm:p-2.5 border-b border-gray-300 dark:border-gray-600 focus:border-[#0d9488] dark:focus:border-emerald-400 bg-transparent text-gray-900 dark:text-gray-100 outline-none transition break-words"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-sm sm:text-md font-medium dark:text-gray-200 break-words"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 sm:p-2.5 border-b border-gray-300 dark:border-gray-600 focus:border-[#0d9488] dark:focus:border-emerald-400 bg-transparent text-gray-900 dark:text-gray-100 outline-none transition break-words"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#0d9488] dark:bg-emerald-600 text-white dark:hover:bg-emerald-700 mt-7 w-full p-2 rounded-lg hover:bg-[#134e4a] transition-colors"
          >
            Register
          </button>

          <p className="text-xs sm:text-sm text-center mt-4 break-words">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#0d9488] dark:text-emerald-400 hover:text-[#34d399] dark:hover:text-emerald-300"
            >
              Log in
            </Link>
          </p>
        </form>
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
