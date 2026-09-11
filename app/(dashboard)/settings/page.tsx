"use client";

import { Card, CardHeader, CardBody, Tabs, Button, Toast } from "@/components/ui";
import Badge from "@/components/ui/Badge";
import { ToastContainer } from "@/components/ui/Toast";
import Modal, { ModalFooter } from "@/components/ui/Modal";
import { UserCog, Mail, Phone, Building2, CalendarDays, CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useAdmins } from "@/hooks/useAdmins";
import { useDeleteAdmin } from "@/hooks/useDeleteAdmin";
import { ApiError } from "@/lib/axiosInstance";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-700",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-fuchsia-600",
];

export default function SettingsPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("success");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: adminsResponse, isLoading: adminsLoading, isError: adminsError } = useAdmins();
  const admins = adminsResponse?.data ?? [];
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

  const showToastMessage = useCallback(
    (type: "success" | "error" | "warning" | "info", message: string) => {
      setToastType(type);
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    []
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTargetId) return;
    deleteAdmin(deleteTargetId, {
      onSuccess: (response) => {
        setDeleteTargetId(null);
        showToastMessage("success", response.message);
      },
      onError: (error: ApiError) => {
        setDeleteTargetId(null);
        showToastMessage("error", error.message || "Failed to delete admin. Please try again.");
      },
    });
  }, [deleteAdmin, deleteTargetId, showToastMessage]);

  const tabs = useMemo(
    () => [
      {
        id: "admins",
        label: "Admins",
        icon: <UserCog className="h-4 w-4" />,
        content: (
          <div className="space-y-6">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">System Administrators</h2>
                {!adminsLoading && !adminsError && (
                  <p className="text-sm text-gray-500">{admins.length} admins registered</p>
                )}
              </div>
            </div>

            {/* Loading skeleton */}
            {adminsLoading && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="h-1 w-full animate-pulse bg-gray-200" />
                    <div className="space-y-3 p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                        </div>
                      </div>
                      <div className="h-px bg-gray-100" />
                      <div className="space-y-2">
                        <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {adminsError && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
                <AlertCircle className="mb-3 h-10 w-10 text-red-400" />
                <p className="font-semibold text-red-700">Failed to load admins</p>
                <p className="mt-1 text-sm text-red-500">Please try refreshing the page.</p>
              </div>
            )}

            {/* Admin cards grid */}
            {!adminsLoading && !adminsError && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {admins.map((admin, index) => (
                  <div
                    key={admin.id}
                    className="animate-slideUp group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {/* Top accent bar */}
                    <div className={`h-1 w-full bg-gradient-to-r ${avatarColors[index % avatarColors.length]}`} />

                    <div className="p-5">
                      {/* Avatar + name + status */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]} text-sm font-bold text-white shadow-sm`}
                          >
                            {getInitials(admin.full_name)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{admin.full_name}</p>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                              <Building2 className="h-3 w-3" />
                              {admin.company_name}
                            </div>
                          </div>
                        </div>
                        <Badge variant={admin.is_active ? "success" : "default"} size="sm">
                          {admin.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <button
                          type="button"
                          aria-label={`Delete ${admin.full_name}`}
                          onClick={() => setDeleteTargetId(admin.user_id)}
                          className="ml-1 rounded-md p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="my-4 h-px bg-gray-100" />

                      {/* Contact info */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <span className="truncate">{admin.work_email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <span>{admin.work_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <span>Joined {formatDate(admin.createdAt)}</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="my-4 h-px bg-gray-100" />

                      {/* Verification badges */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs">
                          {admin.is_email_verify ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-gray-300" />
                          )}
                          <span className={admin.is_email_verify ? "text-emerald-700 font-medium" : "text-gray-400"}>
                            Email verified
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          {admin.is_phone_verify ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-gray-300" />
                          )}
                          <span className={admin.is_phone_verify ? "text-emerald-700 font-medium" : "text-gray-400"}>
                            Phone verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      },
    ],
    [admins, adminsLoading, adminsError]
  );

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs tabs={tabs} defaultTab="admins" />

      <ToastContainer>
        {showToast && (
          <Toast type={toastType} title={toastMessage} onClose={() => setShowToast(false)} />
        )}
      </ToastContainer>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Admin"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this admin? This will mark their account as deleted and they will lose access immediately.
          </p>
          <ModalFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="!bg-red-600 hover:!bg-red-700"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Admin"}
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
