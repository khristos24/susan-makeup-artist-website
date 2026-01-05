'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { Modal } from "@/components/Modal";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Recovery state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recovering, setRecovering] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecovering(true);
    setRecoveryError("");

    if (newPassword !== confirmNewPassword) {
      setRecoveryError("Passwords do not match");
      setRecovering(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryKey, newPassword }),
      });

      if (res.ok) {
        setRecoverySuccess(true);
        setTimeout(() => {
          setShowForgotModal(false);
          setRecoverySuccess(false);
          setRecoveryKey("");
          setNewPassword("");
          setConfirmNewPassword("");
        }, 2000);
      } else {
        const data = await res.json();
        setRecoveryError(data.error || "Recovery failed");
      }
    } catch (err) {
      setRecoveryError("An error occurred. Please try again.");
    } finally {
      setRecovering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf7ef] p-4">
      <Card className="w-full max-w-md shadow-xl border-[#d6c4a5]">
        <CardHeader className="text-center border-b-[#d6c4a5]/30">
          <div className="w-16 h-16 bg-[#C9A24D] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-[#1c1208] font-bold text-2xl">SM</span>
          </div>
          <h1 className="text-2xl font-display text-[#2c1a0a]">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to manage your website</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 text-center">
                {error}
              </div>
            )}
            
            <Input
              label="Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
            
            <Input
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A24D] hover:bg-[#b89342] text-[#1c1208] font-semibold"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-[#C9A24D] hover:underline hover:text-[#b89342]"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        size="md"
      >
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter your unique recovery key to reset your password. If you haven&apos;t generated a recovery key, please contact the developer.
          </p>

          {recoverySuccess ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
              Password reset successfully! Redirecting...
            </div>
          ) : (
            <form onSubmit={handleRecover} className="space-y-4">
              {recoveryError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                  {recoveryError}
                </div>
              )}

              <Input
                label="Recovery Key"
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                placeholder="Paste your recovery key here"
                required
                className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
              />

              <Input
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
              />

              <Input
                type="password"
                label="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
              />

              <Button
                type="submit"
                disabled={recovering}
                className="w-full bg-[#C9A24D] hover:bg-[#b89342] text-[#1c1208] font-semibold"
              >
                {recovering ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
