import { cn } from '@/lib/utils';

// ─── Base Skeleton ────────────────────────────────────────────────────────────

export interface SkeletonProps {
  className?: string;
  /** Disables the shimmer animation (static gray block) */
  animate?: boolean;
}

export default function Skeleton({ className, animate = true }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block rounded-md bg-gray-200',
        animate && 'relative overflow-hidden',
        animate &&
          'before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.6s_infinite]',
        className
      )}
      style={
        animate
          ? undefined
          : undefined
      }
    >
      {/* Shimmer keyframe injected once via a shared CSS class */}
      {animate && (
        <style jsx global>{`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
      )}
    </span>
  );
}

// ─── Skeleton Text ────────────────────────────────────────────────────────────
// Mimics a block of body text lines.

export interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

export function SkeletonText({ lines = 3, lastLineWidth = 'w-2/3', className }: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? lastLineWidth : 'w-full')}
        />
      ))}
    </div>
  );
}

// ─── Skeleton Avatar ──────────────────────────────────────────────────────────

export interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const avatarSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

export function SkeletonAvatar({ size = 'md', className }: SkeletonAvatarProps) {
  return (
    <Skeleton className={cn('rounded-full flex-shrink-0', avatarSizes[size], className)} />
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
// Generic card placeholder with avatar + text lines.

export interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
  lines?: number;
}

export function SkeletonCard({ className, showAvatar = true, lines = 3 }: SkeletonCardProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded-xl border border-gray-100 bg-white p-5 shadow-sm', className)}
    >
      <div className="flex items-start gap-3">
        {showAvatar && <SkeletonAvatar size="md" />}
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4">
        <SkeletonText lines={lines} />
      </div>
    </div>
  );
}

// ─── Skeleton Table ───────────────────────────────────────────────────────────
// Mimics a data table with configurable rows and columns.

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
  return (
    <div aria-hidden="true" className={cn('w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm', className)}>
      {/* Header row */}
      <div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 flex-1 rounded" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={cn(
            'flex items-center gap-4 px-5 py-3.5',
            rowIdx !== rows - 1 && 'border-b border-gray-50'
          )}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className={cn(
                'h-3.5 flex-1 rounded',
                colIdx === 0 && 'max-w-[40%]'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Stat Card ───────────────────────────────────────────────────────
// Placeholder for dashboard metric/stat tiles.

export interface SkeletonStatCardProps {
  className?: string;
}

export function SkeletonStatCard({ className }: SkeletonStatCardProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded-xl border border-gray-100 bg-white p-5 shadow-sm', className)}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-8 w-20" />
      <Skeleton className="mt-2 h-3 w-28" />
    </div>
  );
}

// ─── Skeleton List ────────────────────────────────────────────────────────────
// Stack of avatar + text rows — useful for lead/contact lists.

export interface SkeletonListProps {
  rows?: number;
  className?: string;
}

export function SkeletonList({ rows = 5, className }: SkeletonListProps) {
  return (
    <div aria-hidden="true" className={cn('flex flex-col divide-y divide-gray-50', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 px-1">
          <SkeletonAvatar size="sm" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
