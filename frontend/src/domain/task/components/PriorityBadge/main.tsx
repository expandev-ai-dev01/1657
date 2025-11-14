import { clsx } from 'clsx';
import { PRIORITY_MAP } from '../../constants';
import type { PriorityBadgeProps } from './types';

/**
 * @component PriorityBadge
 * @summary Visual badge component for displaying task priority levels.
 * @domain task
 * @type domain-component
 * @category display
 */
export const PriorityBadge = ({ priority, size = 'md', showIcon = true }: PriorityBadgeProps) => {
  const config = PRIORITY_MAP[priority];

  if (!config) {
    return null;
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizeClasses[size]
      )}
      style={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}
      title={config.label}
    >
      {showIcon && (
        <span className="text-lg" role="img" aria-label={config.label}>
          {config.icon === 'priority_high' && '🔴'}
          {config.icon === 'priority_medium' && '🟠'}
          {config.icon === 'priority_low' && '🔵'}
        </span>
      )}
      <span>{config.label}</span>
    </div>
  );
};
