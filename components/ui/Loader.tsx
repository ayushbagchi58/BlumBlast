import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'bar';
type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LoaderProps {
  variant?: LoaderVariant;
  size?: LoaderSize;
  label?: string;
  className?: string;
}

export interface PageLoaderProps {
  label?: string;
}

export interface InlineLoaderProps {
  label?: string;
  size?: LoaderSize;
  className?: string;
}

// ─── Size Maps ────────────────────────────────────────────────────────────────

const spinnerSizes: Record<LoaderSize, string> = {
  xs: 'w-3 h-3 border-[2px]',
  sm: 'w-4 h-4 border-[2px]',
  md: 'w-6 h-6 border-[2.5px]',
  lg: 'w-9 h-9 border-[3px]',
  xl: 'w-12 h-12 border-4',
};

const dotSizes: Record<LoaderSize, string> = {
  xs: 'w-1 h-1',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
  xl: 'w-3 h-3',
};

const dotGaps: Record<LoaderSize, string> = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
};

const labelSizes: Record<LoaderSize, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

// ─── Spinner Variant ──────────────────────────────────────────────────────────

function SpinnerLoader({ size = 'md', className }: { size?: LoaderSize; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full',
        'border-gray-200 border-t-blue-600',
        'animate-spin',
        spinnerSizes[size],
        className
      )}
    />
  );
}

// ─── Dots Variant ─────────────────────────────────────────────────────────────

function DotsLoader({ size = 'md', className }: { size?: LoaderSize; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-flex items-center', dotGaps[size], className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            'rounded-full bg-blue-600 animate-bounce',
            dotSizes[size]
          )}
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.8s' }}
        />
      ))}
    </span>
  );
}

// ─── Pulse Variant ────────────────────────────────────────────────────────────

function PulseLoader({ size = 'md', className }: { size?: LoaderSize; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('relative inline-flex', className)}
    >
      <span
        className={cn(
          'rounded-full bg-blue-600 opacity-75 animate-ping absolute inline-flex',
          spinnerSizes[size].split(' ').slice(0, 2).join(' ')
        )}
      />
      <span
        className={cn(
          'rounded-full bg-blue-600 inline-flex',
          spinnerSizes[size].split(' ').slice(0, 2).join(' ')
        )}
      />
    </span>
  );
}

// ─── Bar Variant ──────────────────────────────────────────────────────────────

function BarLoader({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('relative w-40 h-1 rounded-full bg-gray-200 overflow-hidden inline-block', className)}
    >
      <span
        className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
        style={{ animation: 'bar-slide 1.4s ease-in-out infinite' }}
      />
      <style jsx>{`
        @keyframes bar-slide {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(250%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </span>
  );
}

// ─── Loader (main export) ─────────────────────────────────────────────────────

export default function Loader({
  variant = 'spinner',
  size = 'md',
  label,
  className,
}: LoaderProps) {
  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader size={size} />;
      case 'pulse':
        return <PulseLoader size={size} />;
      case 'bar':
        return <BarLoader />;
      default:
        return <SpinnerLoader size={size} />;
    }
  };

  if (!label) {
    return <span className={cn('inline-flex', className)}>{renderVariant()}</span>;
  }

  return (
    <span className={cn('inline-flex flex-col items-center gap-2', className)}>
      {renderVariant()}
      <span className={cn('text-gray-500 font-medium', labelSizes[size])}>{label}</span>
    </span>
  );
}

// ─── Page Loader ──────────────────────────────────────────────────────────────
// Full-screen overlay with blurred backdrop — use for page-level transitions.

export function PageLoader({ label = 'Loading…' }: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-10 py-8 shadow-xl ring-1 ring-gray-100">
        <SpinnerLoader size="lg" />
        <p className="text-sm font-medium text-gray-600 tracking-wide">{label}</p>
      </div>
    </div>
  );
}

// ─── Inline Loader ────────────────────────────────────────────────────────────
// Horizontal layout — ideal inside buttons or inline text.

export function InlineLoader({ label, size = 'sm', className }: InlineLoaderProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <SpinnerLoader size={size} />
      {label && (
        <span className={cn('text-gray-500 font-medium', labelSizes[size])}>{label}</span>
      )}
    </span>
  );
}
