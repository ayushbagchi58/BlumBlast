"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select, Textarea } from "@/components/ui";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import type { LeadSource, LeadStatus } from "@/lib/types";

export default function NewLeadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    source: "manual" as LeadSource,
    status: "new" as LeadStatus,
    tags: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newLead = {
        ...formData,
        id: `lead-${Date.now()}`,
        score: 0,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        customFields: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("New lead created:", newLead);

      // Redirect to leads list
      router.push("/leads");
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to create lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Lead</h1>
          <p className="mt-1 text-gray-600">Manually enter lead information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                  <p className="text-sm text-gray-600">Basic details about the lead</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Company</label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Inc"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Marketing Manager"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">Lead Details</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Source</label>
                      <Select name="source" value={formData.source} onChange={handleChange}>
                        <option value="manual">Manual Entry</option>
                        <option value="email_inbound">Email Inbound</option>
                        <option value="sms_inbound">SMS Inbound</option>
                        <option value="form">Web Form</option>
                        <option value="referral">Referral</option>
                        <option value="api">API</option>
                      </Select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                      <Select name="status" value={formData.status} onChange={handleChange}>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="engaged">Engaged</option>
                        <option value="qualified">Qualified</option>
                        <option value="unqualified">Unqualified</option>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Tags
                      <span className="ml-1 text-sm font-normal text-gray-500">
                        (comma-separated)
                      </span>
                    </label>
                    <Input
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="vip, enterprise, tech"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                    <Textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any additional information about this lead..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Tips</h3>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li>• Required fields are marked with *</li>
                    <li>• Email must be unique</li>
                    <li>• Lead score starts at 0</li>
                    <li>• Tags help with segmentation</li>
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900">Next Steps</h3>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li>1. Lead will appear in list</li>
                    <li>2. Score increases with activity</li>
                    <li>3. Can add to campaigns</li>
                    <li>4. Track in pipeline</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Form Actions */}
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <Link href="/leads">
              <Button variant="ghost" type="button">
                Cancel
              </Button>
            </Link>
            <div className="flex gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      "This will save the lead as draft. You can complete it later. Continue?"
                    )
                  ) {
                    console.log("Save as draft:", formData);
                    router.push("/leads");
                  }
                }}
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<UserPlus className="h-4 w-4" />}
              >
                Create Lead
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
