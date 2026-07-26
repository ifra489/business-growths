import React from 'react';
import { BusinessHealthScore } from '../../types';
import { getScoreColor } from '../../utils/helpers/formatters';
import { Award, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

interface BusinessHealthScoreChartProps {
  scoreData: BusinessHealthScore;
  businessName?: string;
}

export const BusinessHealthScoreChart: React.FC<BusinessHealthScoreChartProps> = ({
  scoreData,
  businessName = 'Business',
}) => {
  const { totalScore, categories, keyImprovements } = scoreData;
  const colorStyle = getScoreColor(totalScore);

  const categoryList = [
    { label: 'Search Engine Optimization (SEO)', value: categories.seo },
    { label: 'Google Business Profile', value: categories.googleBusinessProfile },
    { label: 'Social Media Presence', value: categories.socialMedia },
    { label: 'Customer Engagement', value: categories.customerEngagement },
    { label: 'Growth Potential', value: categories.growthPotential },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
            <Award className="w-3.5 h-3.5" /> Business Health Audit
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {businessName} Health Score
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive AI-evaluated performance metric across 5 core growth pillars.
          </p>
        </div>

        {/* Score Ring / Badge */}
        <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${colorStyle.bg} ${colorStyle.border}`}>
          <div className="text-center">
            <span className={`text-4xl sm:text-5xl font-black ${colorStyle.text}`}>
              {totalScore}
            </span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
              / 100
            </span>
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-700/60"></div>
          <div>
            <span className={`text-sm font-bold block ${colorStyle.text}`}>
              {totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Moderate' : 'Needs Action'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Overall Rating</span>
          </div>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="py-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Pillar Performance Breakdown
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {categoryList.map((cat, idx) => {
            const catColor = getScoreColor(cat.value);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{cat.label}</span>
                  <span className={`font-bold ${catColor.text}`}>{cat.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${
                      cat.value >= 80 ? 'bg-emerald-500' : cat.value >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${cat.value}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvement Suggestions */}
      {keyImprovements && keyImprovements.length > 0 && (
        <div className="pt-6">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Recommended Improvements for Highest Score Boost
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {keyImprovements.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
