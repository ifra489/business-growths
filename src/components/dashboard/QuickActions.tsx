import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  MapPin,
  Share2,
  MessageSquare,
  Tag,
  Calendar,
  Target,
  Sparkles,
} from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Business Analysis', path: '/modules/business-analysis', icon: BarChart3, color: 'bg-blue-500' },
    { label: 'GBP SEO Audit', path: '/modules/gbp-audit', icon: MapPin, color: 'bg-emerald-500' },
    { label: 'Social Generator', path: '/modules/social-generator', icon: Share2, color: 'bg-purple-500' },
    { label: 'Review Reply', path: '/modules/review-reply', icon: MessageSquare, color: 'bg-amber-500' },
    { label: 'Promotions', path: '/modules/promotion-generator', icon: Tag, color: 'bg-rose-500' },
    { label: '30-Day Planner', path: '/modules/marketing-plan', icon: Calendar, color: 'bg-indigo-500' },
    { label: 'Positioning Advisor', path: '/modules/competitive-positioning', icon: Target, color: 'bg-teal-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Quick Actions Launcher
        </h3>
        <span className="text-xs text-slate-500">Run AI Modules</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(act.path)}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-brand-950/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-200 dark:hover:border-brand-800 transition-all text-center group"
            >
              <div className={`w-9 h-9 rounded-xl ${act.color} text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-1">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
