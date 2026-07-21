import { cn } from "@/lib/utils";
import Button from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center px-4 py-12 text-center", className)}
    >
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mb-6 max-w-md text-gray-600">{description}</p>}
      {action && (
        <>
          {typeof action === "object" && "label" in action && "onClick" in action ? (
            <Button onClick={action.onClick} variant="primary">
              {action.label}
            </Button>
          ) : (
            action
          )}
        </>
      )}
    </div>
  );
}
