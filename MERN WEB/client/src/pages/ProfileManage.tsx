import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, User, Mail, Lock, Check, X } from "lucide-react";
import { getCurrentUser, updateProfile, changePassword } from "../services/authService";

// Modern TextInput component with validation
const TextInput: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  error,
  success,
  icon: Icon,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-purple-300 tracking-wide">{label}</label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border-2 transition-all duration-300 text-white placeholder-purple-400/70 focus:outline-none focus:scale-[1.02] shadow-lg ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/20'
            : success
            ? 'border-green-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/20'
            : 'border-purple-600/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 hover:border-purple-500/70'
        }`}
      />
      {error && <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />}
      {success && <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />}
    </div>
    {error && <p className="text-red-400 text-sm font-medium flex items-center gap-2"><X className="w-4 h-4" />{error}</p>}
  </div>
);

// Password input with show/hide toggle
const PasswordInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  success?: boolean;
}> = ({
  label,
  value,
  onChange,
  placeholder,
  required = true,
  error,
  success,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-purple-300 tracking-wide">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 backdrop-blur-sm border-2 transition-all duration-300 text-white placeholder-purple-400/70 focus:outline-none focus:scale-[1.02] shadow-lg ${
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/20'
              : success
              ? 'border-green-400 focus:border-green-400 focus:ring-4 focus:ring-green-400/20'
              : 'border-purple-600/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 hover:border-purple-500/70'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
        {error && <X className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />}
        {success && <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />}
      </div>
      {error && <p className="text-red-400 text-sm font-medium flex items-center gap-2"><X className="w-4 h-4" />{error}</p>}
    </div>
  );
};

const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  loading?: boolean; 
}> = ({
  children,
  loading,
  disabled,
  ...props
}) => (
  <button
    {...props}
    className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
      disabled || loading
        ? "bg-purple-500/50 cursor-not-allowed"
        : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 shadow-purple-500/25"
    }`}
    disabled={disabled || loading}
  >
    {loading ? (
      <div className="flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        Processing...
      </div>
    ) : children}
  </button>
);

const ProfileManage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validation states
  const [profileErrors, setProfileErrors] = useState({ name: "", email: "" });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCurrentUser();
        setFormData({ name: profile.name, email: profile.email });
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Validation functions
  const validateProfile = (): boolean => {
    const errors = { name: "", email: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    setProfileErrors(errors);
    return isValid;
  };

  const validatePasswords = (): boolean => {
    const errors = { currentPassword: "", newPassword: "", confirmPassword: "" };
    let isValid = true;

    if (!passwords.currentPassword) {
      errors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!passwords.newPassword) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (passwords.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!passwords.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    setActionLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;

    setActionLoading(true);
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Failed to change password:", error);
      // Check if it's a current password validation error
      if (error instanceof Error && error.message.toLowerCase().includes("current password")) {
        setPasswordErrors(prev => ({
          ...prev,
          currentPassword: "Current password is incorrect"
        }));
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-white text-xl font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent mb-4">
            Profile Management
          </h1>
          <p className="text-purple-300/80 text-lg">Update your personal information and security settings</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Profile Info Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Profile Details</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <TextInput
                label="Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (profileErrors.name) setProfileErrors({ ...profileErrors, name: "" });
                }}
                placeholder="Your name"
                icon={User}
                error={profileErrors.name}
                success={!profileErrors.name && formData.name.length > 0}
              />
              
              <TextInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (profileErrors.email) setProfileErrors({ ...profileErrors, email: "" });
                }}
                placeholder="Your email"
                icon={Mail}
                error={profileErrors.email}
                success={!profileErrors.email && formData.email.length > 0}
              />
              
              <PrimaryButton type="submit" loading={actionLoading}>
                Update Profile
              </PrimaryButton>
            </form>
          </div>

          {/* Password Change Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <PasswordInput
                label="Current Password"
                value={passwords.currentPassword}
                onChange={(e) => {
                  setPasswords({ ...passwords, currentPassword: e.target.value });
                  if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: "" });
                }}
                placeholder="Current password"
                error={passwordErrors.currentPassword}
              />
              
              <PasswordInput
                label="New Password"
                value={passwords.newPassword}
                onChange={(e) => {
                  setPasswords({ ...passwords, newPassword: e.target.value });
                  if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: "" });
                  // Clear confirm password error if they now match
                  if (passwordErrors.confirmPassword && passwords.confirmPassword && e.target.value === passwords.confirmPassword) {
                    setPasswordErrors(prev => ({ ...prev, confirmPassword: "" }));
                  }
                }}
                placeholder="New password"
                error={passwordErrors.newPassword}
                success={!passwordErrors.newPassword && passwords.newPassword.length >= 6}
              />
              
              <PasswordInput
                label="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={(e) => {
                  setPasswords({ ...passwords, confirmPassword: e.target.value });
                  if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
                }}
                placeholder="Confirm new password"
                error={passwordErrors.confirmPassword}
                success={!passwordErrors.confirmPassword && passwords.confirmPassword.length > 0 && passwords.newPassword === passwords.confirmPassword}
              />
              
              <PrimaryButton type="submit" loading={actionLoading}>
                Change Password
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManage;