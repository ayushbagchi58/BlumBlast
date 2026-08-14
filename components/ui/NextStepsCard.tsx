"use client";

import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import Card from "./Card";

interface NextStep {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  variant?: "primary" | "outline";
}

interface NextStepsCardProps {
  title?: string;
  steps: NextStep[];
}

export function NextStepsCard({ title = "What's Next?", steps }: NextStepsCardProps) {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <div>
        <h3 className="text-lg font-semibold text-blue-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Link key={index} href={step.href}>
                <div className="group flex items-center gap-4 rounded-lg border border-blue-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
