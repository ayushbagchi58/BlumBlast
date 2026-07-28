"use client";

import { useParams, useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { mockWorkflows } from "@/lib/mockData";
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  AlertCircle,
} from "lucide-react";

export default function WorkflowAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.id as string;

  const workflow = mockWorkflows.find((w) => w.id === workflowId);

  if (!workflow) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Workflow Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The workflow you're looking for doesn't exist
          </p>
          <Button onClick={() => router.push("/workflows")}>
            Back to Workflows
          </Button>
        </div>
      </div>
    );
  }

  const completionRate =
    workflow.enrolledCount > 0
      ? (workflow.completedCount / workflow.enrolledCount) * 100
      : 0;

  const dropoffRate = 100 - completionRate;

  // Mock node performance data
  const nodePerformance = [
    {
      nodeName: "Send Welcome Email",
      entered: workflow.enrolledCount,
      completed: Math.round(workflow.enrolledCount * 0.95),
      dropoff: Math.round(workflow.enrolledCount * 0.05),
    },
    {
      nodeName: "Wait 2 Days",
      entered: Math.round(workflow.enrolledCount * 0.95),
      completed: Math.round(workflow.enrolledCount * 0.95),
      dropoff: 0,
    },
    {
      nodeName: "Email Opened?",
      entered: Math.round(workflow.enrolledCount * 0.95),
      completed: Math.round(workflow.enrolledCount * 0.85),
      dropoff: Math.round(workflow.enrolledCount * 0.1),
    },
    {
      nodeName: "Send Follow-up Email",
      entered: Math.round(workflow.enrolledCount * 0.6),
      completed: Math.round(workflow.enrolledCount * 0.55),
      dropoff: Math.round(workflow.enrolledCount * 0.05),
    },
    {
      nodeName: "Send Re-engagement Email",
      entered: Math.round(workflow.enrolledCount * 0.25),
      completed: Math.round(workflow.enrolledCount * 0.2),
      dropoff: Math.round(workflow.enrolledCount * 0.05),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/workflows")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{workflow.name}</h1>
            <p className="text-gray-600 mt-1">{workflow.description}</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Enrolled</p>
              <p className="text-3xl font-bold text-gray-900">
                {workflow.enrolledCount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Currently Active</p>
              <p className="text-3xl font-bold text-blue-600">
                {workflow.activeCount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {workflow.completedCount.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 font-medium mt-1">
                {completionRate.toFixed(1)}% completion
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Completion Time</p>
              <p className="text-3xl font-bold text-gray-900">4.2 days</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Completion Funnel */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Completion Funnel
        </h2>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Enrolled</span>
              <span className="font-semibold text-gray-900">
                {workflow.enrolledCount.toLocaleString()} (100%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ width: "100%" }}
              >
                Started
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">In Progress</span>
              <span className="font-semibold text-blue-600">
                {workflow.activeCount.toLocaleString()} (
                {((workflow.activeCount / workflow.enrolledCount) * 100).toFixed(1)}
                %)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-blue-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{
                  width: `${(workflow.activeCount / workflow.enrolledCount) * 100}%`,
                }}
              >
                Active
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">
                {workflow.completedCount.toLocaleString()} ({completionRate.toFixed(1)}
                %)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-green-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ width: `${completionRate}%` }}
              >
                Finished
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Dropped Off</span>
              <span className="font-semibold text-red-600">
                {(workflow.enrolledCount - workflow.completedCount).toLocaleString()}{" "}
                ({dropoffRate.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-red-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ width: `${dropoffRate}%` }}
              >
                Exited
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Node-by-Node Performance */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Node Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                  Node
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                  Entered
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                  Completed
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                  Drop-off
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {nodePerformance.map((node, index) => {
                const nodeCompletionRate =
                  node.entered > 0 ? (node.completed / node.entered) * 100 : 0;
                const hasIssue = nodeCompletionRate < 80;

                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {node.nodeName}
                        </span>
                        {hasIssue && (
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-900">
                      {node.entered.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-900">
                      {node.completed.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`text-sm font-medium ${
                          node.dropoff > 0 ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        {node.dropoff.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              hasIssue ? "bg-orange-500" : "bg-green-600"
                            }`}
                            style={{ width: `${nodeCompletionRate}%` }}
                          />
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            hasIssue ? "text-orange-600" : "text-gray-900"
                          }`}
                        >
                          {nodeCompletionRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Performance Over Time */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Trends
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Weekly Enrollments</p>
            <div className="space-y-1">
              {[
                { week: "Week 1", count: 287 },
                { week: "Week 2", count: 342 },
                { week: "Week 3", count: 298 },
                { week: "Week 4", count: 320 },
              ].map((week) => (
                <div key={week.week} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">{week.week}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${(week.count / 350) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 w-10 text-right">
                    {week.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Completion Rate Trend</p>
            <div className="space-y-1">
              {[
                { week: "Week 1", rate: 65 },
                { week: "Week 2", rate: 68 },
                { week: "Week 3", rate: 72 },
                { week: "Week 4", rate: 69 },
              ].map((week) => (
                <div key={week.week} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">{week.week}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-600 h-4 rounded-full"
                      style={{ width: `${week.rate}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 w-10 text-right">
                    {week.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Avg. Time to Complete</p>
            <div className="space-y-1">
              {[
                { week: "Week 1", days: 5.2 },
                { week: "Week 2", days: 4.8 },
                { week: "Week 3", days: 4.1 },
                { week: "Week 4", days: 4.2 },
              ].map((week) => (
                <div key={week.week} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-16">{week.week}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-purple-600 h-4 rounded-full"
                      style={{ width: `${(week.days / 6) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-900 w-16 text-right">
                    {week.days} days
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Insights */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Insights</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Strong Performance
              </p>
              <p className="text-sm text-green-700 mt-1">
                Your workflow has a {completionRate.toFixed(1)}% completion rate,
                which is above the average of 65%
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">
                Optimization Opportunity
              </p>
              <p className="text-sm text-orange-700 mt-1">
                The "Email Opened?" condition has a 10% drop-off. Consider
                adjusting timing or content.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Positive Trend</p>
              <p className="text-sm text-blue-700 mt-1">
                Completion rate has improved by 7% over the past month
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
