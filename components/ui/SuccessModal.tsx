"use client";

import { CheckCircle, X } from "lucide-react";
import Button from "./Button";
import Link from "next/link";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  nextAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  nextAction,
  secondaryAction,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mb-6 text-gray-600">{message}</p>

          {/* Actions */}
          <div className="space-y-3">
            {nextAction && (
              <Link href={nextAction.href} className="block">
                <Button variant="primary" className="w-full">
                  {nextAction.label}
                </Button>
              </Link>
            )}
            {secondaryAction && (
              <Link href={secondaryAction.href} className="block">
                <Button variant="outline" className="w-full">
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
            {!nextAction && !secondaryAction && (
              <Button variant="primary" className="w-full" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
