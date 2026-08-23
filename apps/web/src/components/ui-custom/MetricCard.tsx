import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleIcon?: React.ReactNode;
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  className?: string;
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  subtitleIcon,
  icon: Icon,
  iconColorClass = 'text-primary',
  iconBgClass = 'bg-primary/10',
  className,
  children
}) => {
  return (
    <Card className={cn("premium-card hover:-translate-y-1 transition-transform border", className)}>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
          <div className="text-2xl font-black drop-shadow-sm mb-1">{value}</div>
          {subtitle && (
            <div className={cn("text-xs font-bold flex items-center", iconColorClass)}>
              {subtitleIcon && <span className="mr-1">{subtitleIcon}</span>}
              {subtitle}
            </div>
          )}
          {children}
        </div>
        <div className={cn("p-3 rounded-full relative", iconBgClass, iconColorClass)}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
};
