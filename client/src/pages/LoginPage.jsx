import React, { useState } from "react";
import logo from "../assets/logo.png";
import Aurora from "@/components/Aurora";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();

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
    console.log("Form submitted:", { email, password });
    alert("Form submitted successfully!");
    setEmail("");
    setPassword("");
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

        {/* form */}
        <form
          className="bg-white p-10 rounded-lg shadow-sm shadow-blue-700 w-full max-w-md mb-50"
          onSubmit={handleLogin}
        >
          <h2 className="text-2xl font-medium mb-6 text-center">
            Welcome Back!{" "}
            <span className="text-gray-400 text-sm block font-normal">
              Let&apos;s get you signed in securely
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
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded hover:border-[#3306C6]  
                  focus:ring-[#3306C6] focus:border-transparent transition"
                placeholder="Enter your email"
                type="text"
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
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-[#3306C6]">
              Get Started
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
