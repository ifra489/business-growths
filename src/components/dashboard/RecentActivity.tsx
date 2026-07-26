import React from 'react';
import { formatDate } from '../../utils/helpers/formatters';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActivityItem {
  id: string;
  type: string;
  businessName: string;
  title: string;
  createdAt: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Activity Feed</h3>
        <button
          onClick={() => navigate('/history')}
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
        >
          View All <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400">
          <Sparkles className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-xs">No activity logged yet. Run your first AI module!</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto">
          {activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              onClick={() => navigate('/history')}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-brand-100 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300">
                  {act.type}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">{act.businessName}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">{act.title}</p>
              </div>
              <span className="text-[10px] font-medium text-slate-400 shrink-0 ml-2">
                {formatDate(act.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
