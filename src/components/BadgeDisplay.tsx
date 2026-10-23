/**
 * MathLover CCC - Badge Display Component
 * Renders 'Study Master', 'Top Contributor', and other achievement badges
 * with tier gradients, icons, and status indicators.
 */

import React from 'react';
import { BadgeTier } from '../types';
import { Award, Star, Users, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface BadgeDisplayProps {
  title: string;
  tier?: BadgeTier;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showTierLabel?: boolean;
  className?: string;
  isUnlocked?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  title,
  tier = 'bronze',
  size = 'sm',
  showTierLabel = false,
  className = '',
  isUnlocked = true,
}) => {
  // Select Icon
  let Icon = Award;
  if (title.toLowerCase().includes('top contributor')) {
    Icon = Star;
  } else if (title.toLowerCase().includes('host') || title.toLowerCase().includes('circle')) {
    Icon = Users;
  } else if (title.toLowerCase().includes('proof') || title.toLowerCase().includes('pioneer')) {
    Icon = Sparkles;
  } else if (title.toLowerCase().includes('connector') || title.toLowerCase().includes('chicago')) {
    Icon = Compass;
  }

  // Tier styles
  let tierStyle = 'bg-orange-50 text-orange-800 border-orange-300';
  let iconColor = 'text-orange-600';
  let tierName = 'Bronze';

  if (tier === 'silver') {
    tierStyle = 'bg-slate-100 text-slate-800 border-slate-300 shadow-2xs';
    iconColor = 'text-slate-600';
    tierName = 'Silver';
  } else if (tier === 'gold') {
    tierStyle = 'bg-amber-50 text-amber-900 border-amber-400 shadow-2xs ring-1 ring-amber-400/20';
    iconColor = 'text-amber-600';
    tierName = 'Gold';
  } else if (tier === 'diamond') {
    tierStyle = 'bg-purple-50 text-purple-900 border-purple-400 shadow-xs ring-1 ring-purple-400/30';
    iconColor = 'text-purple-600';
    tierName = 'Diamond';
  }

  // Size styles
  let sizeClasses = 'text-xs px-2.5 py-0.5 gap-1.5';
  let iconSize = 'w-3.5 h-3.5';

  if (size === 'xs') {
    sizeClasses = 'text-[10px] px-1.5 py-0.2 gap-1 font-semibold';
    iconSize = 'w-2.5 h-2.5';
  } else if (size === 'md') {
    sizeClasses = 'text-xs px-3 py-1 gap-1.5 font-bold';
    iconSize = 'w-4 h-4';
  } else if (size === 'lg') {
    sizeClasses = 'text-sm px-3.5 py-1.5 gap-2 font-bold';
    iconSize = 'w-5 h-5';
  }

  if (!isUnlocked) {
    return (
      <span
        className={`inline-flex items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400 ${sizeClasses} ${className}`}
        title={`${title} (Locked - Keep participating to unlock!)`}
      >
        <Icon className={`${iconSize} opacity-40`} />
        <span>{title}</span>
        <span className="text-[10px] font-normal text-slate-400">(Locked)</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-semibold tracking-tight transition-transform ${tierStyle} ${sizeClasses} ${className}`}
      title={`${title} (${tierName} Tier)`}
    >
      <Icon className={`${iconSize} ${iconColor} shrink-0 fill-current/10`} />
      <span className="truncate">{title}</span>
      {showTierLabel && (
        <span className="text-[10px] uppercase font-bold opacity-75 ml-0.5">
          {tierName}
        </span>
      )}
    </span>
  );
};
