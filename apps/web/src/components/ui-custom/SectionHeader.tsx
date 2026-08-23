import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColorClass?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  icon: Icon,
  iconColorClass = 'text-primary',
  className,
  children
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6", className)}>
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {Icon && <Icon className={cn("w-6 h-6", iconColorClass)} />} 
          {title}
        </h2>
        {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
};
