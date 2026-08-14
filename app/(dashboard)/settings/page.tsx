"use client";

import { Card, CardHeader, CardBody, Tabs, Button, Toast } from "@/components/ui";
import { ToastContainer } from "@/components/ui/Toast";
import { Bell, Shield, Users, Zap, Check } from "lucide-react";
import { mockUsers } from "@/lib/mockData";
import { useState, useCallback, useMemo } from "react";

export default function SettingsPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");

  const showToastMessage = useCallback(
    (type: "success" | "error" | "warning" | "info", message: string) => {
      setToastType(type);
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    []
  );

  const tabs = useMemo(
    () => [
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
                        onChange={(e) => console.log(`${notification.title}: ${e.target.checked}`)}
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
    ],
    [showToastMessage]
  );

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs tabs={tabs} defaultTab="team" />

      {/* Toast Notifications */}
      <ToastContainer>
        {showToast && (
          <Toast type={toastType} title={toastMessage} onClose={() => setShowToast(false)} />
        )}
      </ToastContainer>
    </div>
  );
}
