"use client";

import { Card, CardHeader, CardBody, Tabs, Input, Button, Select, Toast } from "@/components/ui";
import { ToastContainer } from "@/components/ui/Toast";
import { User, Bell, Shield, CreditCard, Users, Zap, Save, Check } from "lucide-react";
import { mockUsers } from "@/lib/mockData";
import { useState, useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks";

export default function SettingsPage() {
  const currentUser = mockUsers[0];
  const [savedProfile, setSavedProfile] = useLocalStorage("blum-blast-profile", {
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
    phone: "",
    company: "",
    timezone: "UTC-08:00 (Pacific Time)",
  });

  const [profileData, setProfileData] = useState({
    firstName: savedProfile.name.split(" ")[0] || "",
    lastName: savedProfile.name.split(" ")[1] || "",
    email: savedProfile.email,
    phone: savedProfile.phone || "",
    company: savedProfile.company || "",
    timezone: savedProfile.timezone || "UTC-08:00 (Pacific Time)",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\d\s\-+()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const showToastMessage = useCallback(
    (type: "success" | "error" | "warning" | "info", message: string) => {
      setToastType(type);
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    []
  );

  const handleSaveProfile = useCallback(() => {
    const trimmedFirstName = profileData.firstName.trim();
    const trimmedLastName = profileData.lastName.trim();
    const trimmedEmail = profileData.email.trim();
    const trimmedPhone = profileData.phone.trim();
    const trimmedCompany = profileData.company.trim();

    if (!trimmedFirstName) {
      showToastMessage("error", "First name is required");
      return;
    }

    if (trimmedFirstName.length < 2) {
      showToastMessage("error", "First name must be at least 2 characters");
      return;
    }

    if (trimmedFirstName.length > 50) {
      showToastMessage("error", "First name must not exceed 50 characters");
      return;
    }

    if (!trimmedLastName) {
      showToastMessage("error", "Last name is required");
      return;
    }

    if (trimmedLastName.length < 2) {
      showToastMessage("error", "Last name must be at least 2 characters");
      return;
    }

    if (trimmedLastName.length > 50) {
      showToastMessage("error", "Last name must not exceed 50 characters");
      return;
    }

    if (!trimmedEmail) {
      showToastMessage("error", "Email is required");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      showToastMessage("error", "Please enter a valid email address");
      return;
    }

    if (trimmedPhone && !validatePhone(trimmedPhone)) {
      showToastMessage("error", "Please enter a valid phone number (at least 10 digits)");
      return;
    }

    if (trimmedCompany && trimmedCompany.length < 2) {
      showToastMessage("error", "Company name must be at least 2 characters");
      return;
    }

    if (trimmedCompany && trimmedCompany.length > 100) {
      showToastMessage("error", "Company name must not exceed 100 characters");
      return;
    }

    if (profileData.currentPassword || profileData.newPassword || profileData.confirmPassword) {
      if (!profileData.currentPassword) {
        showToastMessage("error", "Current password is required to change password");
        return;
      }

      if (!profileData.newPassword) {
        showToastMessage("error", "New password is required");
        return;
      }

      if (profileData.newPassword.length < 8) {
        showToastMessage("error", "New password must be at least 8 characters");
        return;
      }

      if (profileData.newPassword !== profileData.confirmPassword) {
        showToastMessage("error", "Passwords do not match");
        return;
      }
    }

    const updatedProfile = {
      name: `${trimmedFirstName} ${trimmedLastName}`,
      email: trimmedEmail,
      phone: trimmedPhone,
      company: trimmedCompany,
      timezone: profileData.timezone,
    };

    setSavedProfile(updatedProfile);

    setProfileData({
      ...profileData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    showToastMessage("success", "Profile updated successfully");
  }, [profileData, setSavedProfile, showToastMessage]);

  const handleCancel = useCallback(() => {
    setProfileData({
      firstName: savedProfile.name.split(" ")[0] || "",
      lastName: savedProfile.name.split(" ")[1] || "",
      email: savedProfile.email,
      phone: savedProfile.phone || "",
      company: savedProfile.company || "",
      timezone: savedProfile.timezone || "UTC-08:00 (Pacific Time)",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    showToastMessage("info", "Changes discarded");
  }, [savedProfile, showToastMessage]);

  const tabs = useMemo(
    () => [
      {
        id: "profile",
        label: "Profile",
        icon: <User className="h-4 w-4" />,
        content: (
          <Card className="animate-slideUp">
            <CardHeader title="Profile Settings" subtitle="Manage your account details" />
            <CardBody>
              <div className="max-w-2xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    required
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    required
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={profileData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^[\d\s\-+()]+$/.test(value)) {
                      setProfileData({ ...profileData, phone: value });
                    }
                  }}
                />
                <Input
                  label="Company"
                  placeholder="Acme Inc."
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                />
                <Select
                  label="Time Zone"
                  value={profileData.timezone}
                  onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                >
                  <option>UTC-08:00 (Pacific Time)</option>
                  <option>UTC-05:00 (Eastern Time)</option>
                  <option>UTC+00:00 (GMT)</option>
                  <option>UTC+01:00 (Central European)</option>
                </Select>

                <div className="border-t pt-4">
                  <h3 className="mb-4 font-semibold text-gray-900">Change Password</h3>
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                      value={profileData.currentPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, currentPassword: e.target.value })
                      }
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password (min 8 characters)"
                      value={profileData.newPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, newPassword: e.target.value })
                      }
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                      value={profileData.confirmPassword}
                      onChange={(e) =>
                        setProfileData({ ...profileData, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    leftIcon={<Save className="h-4 w-4" />}
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" size="md" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ),
      },
      {
        id: "team",
        label: "Team",
        icon: <Users className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <Card className="animate-slideUp">
              <CardHeader title="Team Members" subtitle="Manage your team and permissions" />
              <CardBody>
                <div className="space-y-4">
                  {mockUsers.slice(0, 5).map((user, index) => (
                    <div
                      key={user.id}
                      className="flex animate-slideUp items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                          <span className="text-sm font-semibold text-white">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm capitalize text-gray-600">{user.role}</span>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-4">
                  <Button variant="primary" size="md" leftIcon={<Users className="h-4 w-4" />}>
                    Invite Team Member
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        ),
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell className="h-4 w-4" />,
        content: (
          <Card className="animate-slideUp">
            <CardHeader
              title="Notification Preferences"
              subtitle="Choose what you want to be notified about"
            />
            <CardBody>
              <div className="space-y-4">
                {[
                  {
                    title: "Email Notifications",
                    description: "Receive email about your account activity",
                    checked: true,
                  },
                  {
                    title: "New Lead Alerts",
                    description: "Get notified when new leads arrive",
                    checked: true,
                  },
                  {
                    title: "Campaign Updates",
                    description: "Updates about your campaign performance",
                    checked: false,
                  },
                  {
                    title: "Weekly Reports",
                    description: "Receive weekly performance summaries",
                    checked: true,
                  },
                  {
                    title: "Team Activity",
                    description: "Notifications about team member actions",
                    checked: false,
                  },
                ].map((notification, index) => (
                  <div
                    key={notification.title}
                    className="flex animate-slideUp items-center justify-between border-b py-3 last:border-b-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        defaultChecked={notification.checked}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ),
      },
      {
        id: "integrations",
        label: "Integrations",
        icon: <Zap className="h-4 w-4" />,
        content: (
          <Card className="animate-slideUp">
            <CardHeader title="Integrations" subtitle="Connect with your favorite tools" />
            <CardBody>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    name: "Slack",
                    description: "Get notifications in Slack",
                    connected: true,
                    icon: "💬",
                  },
                  {
                    name: "Google Analytics",
                    description: "Track website analytics",
                    connected: true,
                    icon: "📊",
                  },
                  {
                    name: "Mailchimp",
                    description: "Sync email campaigns",
                    connected: false,
                    icon: "📧",
                  },
                  {
                    name: "Salesforce",
                    description: "CRM integration",
                    connected: false,
                    icon: "☁️",
                  },
                  {
                    name: "Zapier",
                    description: "Automate workflows",
                    connected: true,
                    icon: "⚡",
                  },
                  {
                    name: "HubSpot",
                    description: "Marketing automation",
                    connected: false,
                    icon: "🎯",
                  },
                ].map((integration, index) => (
                  <div
                    key={integration.name}
                    className="animate-slideUp rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{integration.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                    </div>
                    {integration.connected ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <Check className="h-4 w-4" />
                          Connected
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button variant="primary" size="sm" className="w-full">
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ),
      },
      {
        id: "security",
        label: "Security",
        icon: <Shield className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <Card className="animate-slideUp">
              <CardHeader title="Security Settings" subtitle="Manage your account security" />
              <CardBody>
                <div className="space-y-4">
                  <div
                    className="animate-slideUp rounded-lg border border-green-200 bg-green-50 p-4"
                    style={{ animationDelay: "50ms" }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-green-900">Two-Factor Authentication</p>
                        <p className="mt-1 text-sm text-green-700">
                          Your account is protected with 2FA
                        </p>
                      </div>
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      Manage 2FA
                    </Button>
                  </div>

                  <div
                    className="animate-slideUp rounded-lg border border-gray-200 bg-gray-50 p-4"
                    style={{ animationDelay: "100ms" }}
                  >
                    <p className="font-medium text-gray-900">Active Sessions</p>
                    <p className="mt-1 text-sm text-gray-600">
                      You are currently signed in on 1 device
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      View Sessions
                    </Button>
                  </div>

                  <div
                    className="animate-slideUp rounded-lg border border-gray-200 bg-gray-50 p-4"
                    style={{ animationDelay: "150ms" }}
                  >
                    <p className="font-medium text-gray-900">Login History</p>
                    <p className="mt-1 text-sm text-gray-600">View your recent login activity</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      View History
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        ),
      },
      {
        id: "billing",
        label: "Billing",
        icon: <CreditCard className="h-4 w-4" />,
        content: (
          <div className="space-y-4">
            <Card className="animate-slideUp">
              <CardHeader
                title="Billing & Subscription"
                subtitle="Manage your subscription and payment methods"
              />
              <CardBody>
                <div className="space-y-4">
                  <div
                    className="animate-slideUp rounded-lg border-2 border-blue-200 bg-blue-50 p-6"
                    style={{ animationDelay: "50ms" }}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Pro Plan</h3>
                        <p className="mt-1 text-sm text-gray-600">Billed monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">$49</p>
                        <p className="text-sm text-gray-600">/month</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="primary" size="sm">
                        Upgrade Plan
                      </Button>
                      <Button variant="outline" size="sm">
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>

                  <div
                    className="animate-slideUp rounded-lg border border-gray-200 bg-gray-50 p-4"
                    style={{ animationDelay: "100ms" }}
                  >
                    <p className="font-medium text-gray-900">Payment Method</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-blue-400">
                        <span className="text-xs font-bold text-white">VISA</span>
                      </div>
                      <span className="text-sm text-gray-600">•••• •••• •••• 4242</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      Update Payment
                    </Button>
                  </div>

                  <div
                    className="animate-slideUp rounded-lg border border-gray-200 bg-gray-50 p-4"
                    style={{ animationDelay: "150ms" }}
                  >
                    <p className="font-medium text-gray-900">Billing History</p>
                    <p className="mt-1 text-sm text-gray-600">View and download past invoices</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      View Invoices
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        ),
      },
    ],
    [profileData, handleSaveProfile, handleCancel]
  );

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs tabs={tabs} defaultTab="profile" />

      {/* Toast Notifications */}
      <ToastContainer>
        {showToast && (
          <Toast type={toastType} title={toastMessage} onClose={() => setShowToast(false)} />
        )}
      </ToastContainer>
    </div>
  );
}
