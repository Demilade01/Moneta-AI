"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, CreditCard, Users, Key, Loader2, Eye, EyeOff, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/client/trpc";
import { toast } from "sonner";

type SettingsTab = "profile" | "notifications" | "security" | "billing" | "team" | "api-keys";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Fetch user data
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();

  const tabs = [
    { id: "profile" as SettingsTab, icon: User, label: "Profile" },
    { id: "notifications" as SettingsTab, icon: Bell, label: "Notifications" },
    { id: "security" as SettingsTab, icon: Shield, label: "Security" },
    { id: "billing" as SettingsTab, icon: CreditCard, label: "Billing" },
    { id: "team" as SettingsTab, icon: Users, label: "Team" },
    { id: "api-keys" as SettingsTab, icon: Key, label: "API Keys" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                activeTab === tab.id
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {userLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <>
              {activeTab === "profile" && <ProfileSection user={user} />}
              {activeTab === "notifications" && <NotificationsSection />}
              {activeTab === "security" && <SecuritySection />}
              {activeTab === "billing" && <BillingSection />}
              {activeTab === "team" && <TeamSection />}
              {activeTab === "api-keys" && <ApiKeysSection />}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Profile Section Component
function ProfileSection({ user }: { user: any }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when user data loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setHasChanges(false);
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);

  const utils = trpc.useUtils();
  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      utils.auth.me.invalidate();
      setHasChanges(false);
    },
    onError: (error) => {
      const errorData = error as any;
      if (errorData?.data?.code === "CONFLICT") {
        setEmailError("This email is already in use");
      } else {
        setEmailError(error.message || "Failed to update profile");
      }
    },
  });

  const uploadAvatar = trpc.auth.uploadAvatar.useMutation({
    onSuccess: (data) => {
      toast.success("Avatar uploaded successfully!");
      setAvatarPreview(data.avatarUrl);
      setSelectedFile(null);
      setAvatarError(null);
      setIsUploadingAvatar(false);
      utils.auth.me.invalidate();
    },
    onError: (error) => {
      setAvatarError(error.message || "Failed to upload avatar");
      setIsUploadingAvatar(false);
      setSelectedFile(null);
      setAvatarPreview(user?.avatarUrl || null);
    },
  });

  // Track changes
  useEffect(() => {
    const originalName = user?.name || "";
    const originalEmail = user?.email || "";
    setHasChanges(name !== originalName || email !== originalEmail);
  }, [name, email, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setEmailError(null);

    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }

    updateProfile.mutate({
      name: name.trim(),
      email: email.trim(),
    });
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setNameError(null);
    setEmailError(null);
    setHasChanges(false);
    setAvatarPreview(user?.avatarUrl || null);
    setSelectedFile(null);
    setAvatarError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (file: File) => {
    setAvatarError(null);

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setAvatarError("Invalid file type. Please upload JPG, PNG, GIF, or WEBP images.");
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setAvatarError("File size exceeds 2MB limit");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;

    setIsUploadingAvatar(true);
    setAvatarError(null);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(",")[1]; // Remove data:*/*;base64, prefix

      uploadAvatar.mutate({
        fileData: base64Data,
        filename: selectedFile.name,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveAvatar = () => {
    setSelectedFile(null);
    setAvatarPreview(user?.avatarUrl || null);
    setAvatarError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Profile Information
      </h2>

      {/* Avatar */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-white" />
            )}
            {isUploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploadingAvatar}
              />
              <Button
                type="button"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="rounded-lg bg-white text-black hover:bg-white/90 disabled:opacity-50"
              >
                <Upload className="mr-2 h-4 w-4" />
                {selectedFile ? "Change" : "Upload"} Avatar
              </Button>
              {selectedFile && !isUploadingAvatar && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleRemoveAvatar}
                  className="rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              JPG, PNG, GIF or WEBP. Max size 2MB.
            </p>
            {selectedFile && !isUploadingAvatar && (
              <Button
                type="button"
                size="sm"
                onClick={handleAvatarUpload}
                className="mt-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                Save Avatar
              </Button>
            )}
            {avatarError && (
              <p className="mt-2 text-xs text-red-400">{avatarError}</p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm text-gray-300">
            Full Name
          </Label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
                setHasChanges(true);
              }}
              disabled={updateProfile.isPending}
              aria-invalid={!!nameError}
              className={`rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-50 ${
                nameError
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                  : ""
              }`}
            />
          </div>
          {nameError && (
            <p className="text-sm text-red-400">{nameError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-gray-300">
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
                setHasChanges(true);
              }}
              disabled={updateProfile.isPending}
              aria-invalid={!!emailError}
              className={`rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-50 ${
                emailError
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                  : ""
              }`}
            />
          </div>
          {emailError && (
            <p className="text-sm text-red-400">{emailError}</p>
          )}
        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={updateProfile.isPending || !hasChanges}
            className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateProfile.isPending || !hasChanges}
            className="rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Notifications Section Component
function NotificationsSection() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        {[
          {
            label: "Email Notifications",
            description: "Receive email updates about pricing changes",
            enabled: true,
          },
          {
            label: "Price Alerts",
            description: "Get notified when competitor prices change",
            enabled: true,
          },
          {
            label: "Weekly Reports",
            description: "Receive weekly pricing performance reports",
            enabled: false,
          },
          {
            label: "AI Recommendations",
            description: "Get notified about new AI recommendations",
            enabled: true,
          },
        ].map((notification) => (
          <div
            key={notification.label}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex-1">
              <div className="font-medium text-white">
                {notification.label}
              </div>
              <div className="text-sm text-gray-400">
                {notification.description}
              </div>
            </div>
            <Switch defaultChecked={notification.enabled} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Security Section Component
function SecuritySection() {
  return (
    <>
      {/* Password Change Form */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Security Settings
        </h2>

        <PasswordChangeForm />

        <Separator className="my-6 bg-white/10" />

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
          <div>
            <div className="font-medium text-white">
              Two-Factor Authentication
            </div>
            <div className="text-sm text-gray-400">
              Add an extra layer of security
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10"
            disabled
          >
            Enable
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xl">
        <h2 className="mb-4 text-xl font-semibold text-red-400">
          Danger Zone
        </h2>
        <p className="mb-4 text-sm text-gray-400">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <Button
          variant="destructive"
          className="rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
          disabled
        >
          Delete Account
        </Button>
      </div>
    </>
  );
}

// Password Change Form Component
function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const utils = trpc.useUtils();
  const changePassword = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPasswordError(null);
      setNewPasswordError(null);
      setConfirmPasswordError(null);
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        setCurrentPasswordError("Current password is incorrect");
      } else {
        setCurrentPasswordError(error.message || "Failed to update password");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    // Validation
    if (!currentPassword) {
      setCurrentPasswordError("Current password is required");
      return;
    }
    if (!newPassword) {
      setNewPasswordError("New password is required");
      return;
    }
    if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    changePassword.mutate({
      currentPassword,
      newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-password" className="text-sm text-gray-300">
          Current Password
        </Label>
        <div className="relative">
          <Input
            id="current-password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setCurrentPasswordError(null);
            }}
            disabled={changePassword.isPending}
            aria-invalid={!!currentPasswordError}
            className={`rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-50 pr-12 ${
              currentPasswordError
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                : ""
            }`}
          />
          {currentPassword && (
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded p-1"
              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              disabled={changePassword.isPending}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {currentPasswordError && (
          <p className="text-sm text-red-400">{currentPasswordError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password" className="text-sm text-gray-300">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setNewPasswordError(null);
            }}
            disabled={changePassword.isPending}
            aria-invalid={!!newPasswordError}
            className={`rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-50 pr-12 ${
              newPasswordError
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                : ""
            }`}
          />
          {newPassword && (
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded p-1"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
              disabled={changePassword.isPending}
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {newPasswordError && (
          <p className="text-sm text-red-400">{newPasswordError}</p>
        )}
        {!newPasswordError && newPassword && (
          <p className="text-xs text-gray-500">
            Must be at least 8 characters
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-sm text-gray-300">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError(null);
            }}
            disabled={changePassword.isPending}
            aria-invalid={!!confirmPasswordError}
            className={`rounded-xl border-white/10 bg-white/5 text-white disabled:opacity-50 pr-12 ${
              confirmPasswordError
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                : ""
            }`}
          />
          {confirmPassword && (
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded p-1"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              disabled={changePassword.isPending}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {confirmPasswordError && (
          <p className="text-sm text-red-400">{confirmPasswordError}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={changePassword.isPending}
        className="w-full rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
      >
        {changePassword.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}

// Placeholder sections
function BillingSection() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold text-white">Billing</h2>
      <p className="text-gray-400">Billing settings coming soon...</p>
    </div>
  );
}

function TeamSection() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold text-white">Team</h2>
      <p className="text-gray-400">Team management coming soon...</p>
    </div>
  );
}

function ApiKeysSection() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold text-white">API Keys</h2>
      <p className="text-gray-400">API key management coming soon...</p>
    </div>
  );
}

