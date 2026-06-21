import type { ReactNode } from 'react';

type FeedbackVariant = 'success' | 'warning' | 'error' | 'info';

const variantStyles: Record<
  FeedbackVariant,
  { banner: string; icon: string; title: string }
> = {
  success: {
    banner: 'border-green-200/80 bg-gradient-to-br from-green-50 to-emerald-50/80',
    icon: 'status-icon status-icon--success',
    title: 'text-green-900',
  },
  warning: {
    banner: 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/60',
    icon: 'status-icon status-icon--warning',
    title: 'text-amber-900',
  },
  error: {
    banner: 'border-red-200/80 bg-gradient-to-br from-red-50 to-rose-50/60',
    icon: 'status-icon status-icon--error',
    title: 'text-red-900',
  },
  info: {
    banner: 'border-sky-200/80 bg-gradient-to-br from-sky-50 to-blue-50/60',
    icon: 'status-icon status-icon--info',
    title: 'text-plutonic-blue-dark',
  },
};

function StatusIconSvg({ variant }: { variant: FeedbackVariant }) {
  if (variant === 'success') {
    return (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (variant === 'warning') {
    return (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
    );
  }
  if (variant === 'error') {
    return (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function StatusIcon({ variant, size = 'lg' }: { variant: FeedbackVariant; size?: 'md' | 'lg' }) {
  const styles = variantStyles[variant];
  return (
    <div
      className={`${styles.icon} ${size === 'lg' ? 'status-icon--lg' : 'status-icon--md'}`}
      aria-hidden
    >
      <StatusIconSvg variant={variant} />
    </div>
  );
}

export function NoticeBanner({
  variant,
  title,
  children,
  className = '',
}: {
  variant: FeedbackVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const styles = variantStyles[variant];
  return (
    <div
      className={`notice-banner rounded-xl border px-4 py-3.5 flex gap-3 text-left ${styles.banner} ${className}`}
      role="status"
    >
      <div className={`shrink-0 mt-0.5 ${styles.title}`}>
        <StatusIconSvg variant={variant} />
      </div>
      <div className="min-w-0 flex-1">
        {title && <p className={`font-semibold text-sm ${styles.title}`}>{title}</p>}
        <div className={`text-sm leading-relaxed ${title ? 'mt-1 text-gray-700' : 'text-gray-700'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="confirmation-detail-row">
      <dt className="confirmation-detail-row__label">{label}</dt>
      <dd
        className={`confirmation-detail-row__value ${highlight ? 'confirmation-detail-row__value--highlight' : ''}`}
      >
        {value}
      </dd>
    </div>
  );
}

export function ConfirmationPanel({
  variant = 'success',
  eyebrow,
  title,
  description,
  details,
  children,
  actions,
  compact = false,
  className = '',
}: {
  variant?: FeedbackVariant;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  details?: { label: string; value: ReactNode; highlight?: boolean }[];
  children?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`confirmation-panel premium-card-glow mesh-sky-bg border border-sky-100/80 ${compact ? 'confirmation-panel--compact' : ''} ${className}`}
    >
      <div className="confirmation-panel__hero">
        <StatusIcon variant={variant} size={compact ? 'md' : 'lg'} />
        {eyebrow && <p className="confirmation-panel__eyebrow">{eyebrow}</p>}
        <h1 className="confirmation-panel__title">{title}</h1>
        {description && <p className="confirmation-panel__description">{description}</p>}
      </div>

      {details && details.length > 0 && (
        <dl className="confirmation-panel__details">
          {details.map((row) => (
            <DetailRow key={row.label} {...row} />
          ))}
        </dl>
      )}

      {children && <div className="confirmation-panel__body">{children}</div>}

      {actions && <div className="confirmation-panel__actions">{actions}</div>}
    </div>
  );
}

export function InfoBlock({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`info-block ${className}`}>
      <h3 className="info-block__title">{title}</h3>
      <div className="info-block__content">{children}</div>
    </div>
  );
}

export function NextStepsList({ steps }: { steps: string[] }) {
  return (
    <ol className="next-steps-list">
      {steps.map((step, i) => (
        <li key={i} className="next-steps-list__item">
          <span className="next-steps-list__num">{i + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

export const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Pay on arrival (cash)',
  bank_transfer: 'Bank transfer',
  stripe: 'Paid online (card)',
};
