import React, { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Settings, User, Shield, LogOut } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SettingsPage() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const router = useRouter();
  console.log("BASE_URL =", BASE_URL);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Separate alerts for profile (account) and password sections
  const [profileAlert, setProfileAlert] = useState(null); // { type: 'success' | 'error', title: string, description: string }
  const [passwordAlert, setPasswordAlert] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setProfileAlert({
            type: "error",
            title: "Authentication Error",
            description: "No token found. Please log in again.",
          });
          return;
        }

        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch user info");
        }

        const data = await res.json();
        setUserInfo({
          firstName: data.firstname || "",
          lastName: data.lastname || "",
          email: data.email || "",
        });
      } catch (error) {
        setProfileAlert({
          type: "error",
          title: "Error",
          description: error.message || "Failed to fetch user info",
        });
      }
    };
    fetchUserInfo();
  }, []);

  // Dismiss alerts after 3 seconds
  useEffect(() => {
    if (profileAlert) {
      const timer = setTimeout(() => setProfileAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [profileAlert]);
  useEffect(() => {
    if (passwordAlert) {
      const timer = setTimeout(() => setPasswordAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [passwordAlert]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setProfileAlert({
          type: "error",
          title: "Authentication Error",
          description: "No token found. Please log in again.",
        });
        return;
      }
      const res = await fetch(`${BASE_URL}/auth/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname: userInfo.firstName,
          lastname: userInfo.lastName,
          email: userInfo.email,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      setProfileAlert({
        type: "success",
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      setProfileAlert({
        type: "error",
        title: "Error",
        description: error.message || "Failed to update profile",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordAlert({
        type: "error",
        title: "Validation Error",
        description: "New passwords do not match!",
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordAlert({
        type: "error",
        title: "Validation Error",
        description: "New password must be at least 6 characters long!",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPasswordAlert({
          type: "error",
          title: "Authentication Error",
          description: "No token found. Please log in again.",
        });
        return;
      }
      const res = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to change password");
      }
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      setPasswordAlert({
        type: "success",
        title: "Success",
        description: "Password updated successfully!",
      });
    } catch (error) {
      setPasswordAlert({
        type: "error",
        title: "Error",
        description: error.message || "Failed to change password",
      });
    }
  };

  const handleCancelPassword = () => {
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowPasswordForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.navigate({ to: "/login" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-background p-6"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Management */}
          <Card className={"bg-[#f0f0f0] dark:bg-white/10"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Management
              </CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Animated Profile Updated Alert */}
              {profileAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.4,
                  }}
                  key={profileAlert.type + profileAlert.title}
                  className="mb-4"
                >
                  <Alert
                    variant={
                      profileAlert.type === "error" ? "destructive" : "default"
                    }
                    className={
                      "rounded-md border px-4 py-2 shadow-sm" +
                      (profileAlert.type === "success"
                        ? " bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-700"
                        : "")
                    }
                  >
                    <AlertTitle
                      className={
                        "font-semibold" +
                        (profileAlert.type === "success"
                          ? " text-green-800 dark:text-green-200"
                          : "")
                      }
                    >
                      {profileAlert.title}
                    </AlertTitle>
                    <AlertDescription
                      className={
                        "text-sm" +
                        (profileAlert.type === "success"
                          ? " text-green-700 dark:text-green-100"
                          : "")
                      }
                    >
                      {profileAlert.description}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={userInfo.firstName}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, firstName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={userInfo.lastName}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, lastName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About LightSave */}
          <Card>
            <CardHeader>
              <CardTitle>About LightSave</CardTitle>
              <CardDescription>
                Information about your personal finance app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Version</Label>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>

              <div className="space-y-2">
                <Label>Last Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">
                  LightSave is a lightweight personal finance tracking
                  application that helps you manage income, expenses, and
                  savings goals with clear visual insights.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Track income and expenses</li>
                  <li>• Set and monitor savings goals</li>
                  <li>• Visual dashboards and charts</li>
                  <li>• Secure user authentication</li>
                  <li>• Responsive design</li>
                </ul>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Export Data
                </Button>
                <Button variant="outline" className="w-full">
                  Privacy Policy
                </Button>
                <Button variant="outline" className="w-full">
                  Terms of Service
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Password section alert */}
              {passwordAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    duration: 0.4,
                  }}
                  key={passwordAlert.type + passwordAlert.title}
                  className="mb-4"
                >
                  <Alert
                    variant={
                      passwordAlert.type === "error" ? "destructive" : "default"
                    }
                    className={
                      "rounded-md border px-4 py-2 shadow-sm" +
                      (passwordAlert.type === "success"
                        ? " bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-700"
                        : "")
                    }
                  >
                    <AlertTitle
                      className={
                        "font-semibold" +
                        (passwordAlert.type === "success"
                          ? " text-green-800 dark:text-green-200"
                          : "")
                      }
                    >
                      {passwordAlert.title}
                    </AlertTitle>
                    <AlertDescription
                      className={
                        "text-sm" +
                        (passwordAlert.type === "success"
                          ? " text-green-700 dark:text-green-100"
                          : "")
                      }
                    >
                      {passwordAlert.description}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
              <div className="space-y-2">
                <Label>Change Password</Label>
                {!showPasswordForm ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Update Password
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">Old Password</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            oldPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handlePasswordChange} className="flex-1">
                        Update Password
                      </Button>
                      <Button variant="outline" onClick={handleCancelPassword}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security (coming soon)
                </p>
                <Button variant="outline" disabled className="w-full">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default SettingsPage;
