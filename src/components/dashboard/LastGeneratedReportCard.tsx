import React from 'react';
import { BusinessAnalysisReport } from '../../types';
import { formatDate, getScoreColor } from '../../utils/helpers/formatters';
import { Award, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LastGeneratedReportCardProps {
  report: BusinessAnalysisReport | null;
}

export const LastGeneratedReportCard: React.FC<LastGeneratedReportCardProps> = ({ report }) => {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md inline-block mb-3">
            Get Started
          </span>
          <h3 className="text-xl font-extrabold">Generate Your First Growth Analysis</h3>
          <p className="text-xs text-brand-100 mt-2 max-w-md leading-relaxed">
            Run Module 1: Business Analysis to calculate your Business Health Score (0-100) and unlock actionable growth recommendations.
          </p>
        </div>
        <button
          onClick={() => navigate('/modules/business-analysis')}
          className="mt-6 px-5 py-2.5 bg-white text-brand-700 font-bold text-xs rounded-xl hover:bg-brand-50 transition-all self-start flex items-center gap-2 shadow-md"
        >
          Run Analysis Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const scoreStyle = getScoreColor(report.healthScore?.totalScore || 75);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-brand-600 dark:text-brand-400 tracking-wider block">
                Last Audit Report
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {report.businessName}
              </h3>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border ${scoreStyle.bg} ${scoreStyle.border} text-center`}>
            <span className={`text-lg font-black ${scoreStyle.text}`}>
              {report.healthScore?.totalScore || 0}
            </span>
            <span className="text-[9px] font-bold text-slate-400 block uppercase">Score</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {report.summary}
        </p>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
          <span>Category: {report.category}</span>
          <span>{formatDate(report.createdAt)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/history')}
        className="mt-4 w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        View Full Report Details <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
