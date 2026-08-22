"use client";

import { useState, useMemo } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  Mail,
  MessageSquare,
  Play,
  Pause,
  Eye,
  Plus,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { defaultNurtureSequences } from "@/lib/data/nurtureSequences";
import type { NurtureSequence } from "@/lib/types";

export default function NurtureSequencesPage() {
  const [sequences] = useState<NurtureSequence[]>(defaultNurtureSequences);

  const stats = useMemo(() => {
    return {
      totalSequences: sequences.length,
      activeSequences: sequences.filter((s) => s.isActive).length,
      totalEnrolled: sequences.reduce((sum, s) => sum + s.enrolledCount, 0),
      avgConversionRate:
        sequences.reduce((sum, s) => sum + s.conversionRate, 0) / sequences.length || 0,
    };
  }, [sequences]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nurture Sequences</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Automated follow-up sequences to convert leads into BusinessBlum customers
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} disabled>
          Create Sequence
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sequences</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSequences}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Play className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSequences}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEnrolled}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Conversion</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.avgConversionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Automated Lead Nurturing</h3>
            <p className="text-sm text-blue-800">
              These pre-built sequences automatically follow up with your leads based on their funding
              intent. Each sequence includes personalized emails and SMS messages designed to educate
              and guide leads toward signing up at BusinessBlum.com.
            </p>
          </div>
        </div>
      </Card>

      {/* Sequences List */}
      <div className="grid gap-6 md:grid-cols-2">
        {sequences.map((sequence) => (
          <Card key={sequence.id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                    <Badge variant={sequence.isActive ? "success" : "default"}>
                      {sequence.isActive ? (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Paused
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{sequence.description}</p>
                </div>
              </div>

              {/* Trigger */}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-700">Auto-enrolls:</span>
                <Badge variant="default">
                  {sequence.triggerIntent?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Sequence Steps:</p>
                <div className="space-y-1">
                  {sequence.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-2 text-sm text-gray-600 pl-4 border-l-2 border-gray-200"
                    >
                      {step.type === "email" ? (
                        <Mail className="h-4 w-4 text-blue-600" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      )}
                      <span>
                        Step {index + 1}: {step.type === "email" ? "Email" : "SMS"}
                        {step.delayHours === 0 ? (
                          <span className="text-orange-600 font-medium"> (Immediate)</span>
                        ) : (
                          <span className="text-gray-500">
                            {" "}
                            ({step.delayHours}h delay)
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500">Enrolled</p>
                  <p className="text-lg font-semibold text-gray-900">{sequence.enrolledCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="text-lg font-semibold text-gray-900">{sequence.completedCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Conversion</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {sequence.conversionRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/nurture/${sequence.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" disabled>
                  {sequence.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">How Nurture Sequences Work</h3>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                <span className="text-lg font-bold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Auto-Enrollment</h4>
                <p className="text-sm text-gray-600">
                  When you capture a lead with a specific intent (e.g., "Business Loan"), they're
                  automatically enrolled in the matching nurture sequence.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                <span className="text-lg font-bold text-green-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Automated Messages</h4>
                <p className="text-sm text-gray-600">
                  The sequence sends personalized emails and SMS messages at optimal intervals,
                  educating the lead about their funding options.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 flex-shrink-0">
                <span className="text-lg font-bold text-purple-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Conversion</h4>
                <p className="text-sm text-gray-600">
                  Each message guides leads toward signing up at BusinessBlum.com, with tracking
                  to measure conversion rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
