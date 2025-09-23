import React, { useState } from "react";
import logo from "../assets/logo.png";
import Aurora from "@/components/Aurora";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);

    // For now: just log and alert
    console.log("Registration data:", { fullName, email, password });
    alert("Registration successful!");

    // Reset form
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen font-raleway bg-gradient-to-tr from-[#000000] via-[#030207] to-[#18025b]">
      <Aurora
        colorStops={["#BBC5BA", "#3306C6", "#8170C2"]}
        blend={1.5}
        amplitude={1.0}
        speed={1.93}
      />

      <div className="flex flex-col items-center w-full max-w-md gap-20">
        <img
          src={logo}
          alt="LightSave Logo"
          className="mx-auto w-40 fixed top-0 left-2 mt-5 p-4"
        />

        <div className="text-white space-y-4 text-2xl tracking-wide text-center">
          <h1>
            Create your <span className="text-4xl font-bold">LightSave</span>{" "}
            account
          </h1>
          <p className="text-sm text-gray-400">
            Helping you make better financial decisions
          </p>
        </div>

        <form
          className="bg-white p-10 rounded-lg shadow-sm shadow-blue-700 w-full max-w-md mb-50"
          onSubmit={handleRegister}
        >
          <h2 className="text-2xl font-medium mb-6 text-center">
            Get Started
            <span className="text-gray-400 text-sm block font-normal mt-1">
              Create your account securely
            </span>
          </h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon />
              <AlertTitle>Validation Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block mb-1 text-sm font-medium"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded hover:border-[#3306C6] focus:ring-[#3306C6] focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded hover:border-[#3306C6] focus:ring-[#3306C6] focus:border-transparent transition"
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
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded hover:border-[#3306C6] focus:ring-[#3306C6] focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-sm font-medium"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded hover:border-[#3306C6] focus:ring-[#3306C6] focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-black text-white mt-7 w-full p-2 rounded-lg hover:bg-[#29186d] transition-colors"
          >
            Register
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#3306C6]">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
