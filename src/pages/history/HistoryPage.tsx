import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getUserDocuments, deleteUserDocument } from '../../services/firebaseService';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers/formatters';
import { exportToTxt } from '../../utils/export/exportTxt';
import { exportToPdf } from '../../utils/export/exportPdf';
import {
  History as HistoryIcon,
  Search,
  Trash2,
  Eye,
  RotateCcw,
  Download,
  FileText,
  X,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [activeModalReport, setActiveModalReport] = useState<any | null>(null);

  const loadHistory = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [genReports, marketingPlans, socialPosts, reviewReplies, promotions, competitorInsights] =
        await Promise.all([
          getUserDocuments<any>('generatedReports', currentUser.uid),
          getUserDocuments<any>('marketingPlans', currentUser.uid),
          getUserDocuments<any>('socialPosts', currentUser.uid),
          getUserDocuments<any>('reviewReplies', currentUser.uid),
          getUserDocuments<any>('promotions', currentUser.uid),
          getUserDocuments<any>('competitorInsights', currentUser.uid),
        ]);

      const merged: any[] = [
        ...genReports.map((r) => ({ ...r, collectionName: 'generatedReports', categoryType: r.reportType === 'GBP_AUDIT' ? 'GBP SEO Audit' : 'Business Analysis' })),
        ...marketingPlans.map((p) => ({ ...p, collectionName: 'marketingPlans', categoryType: '30-Day Marketing Plan' })),
        ...socialPosts.map((s) => ({ ...s, collectionName: 'socialPosts', categoryType: 'Social Media Posts' })),
        ...reviewReplies.map((rv) => ({ ...rv, collectionName: 'reviewReplies', categoryType: 'Review Reply' })),
        ...promotions.map((pr) => ({ ...pr, collectionName: 'promotions', categoryType: 'Promotion Campaign' })),
        ...competitorInsights.map((ci) => ({ ...ci, collectionName: 'competitorInsights', categoryType: 'Competitive Positioning' })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setReports(merged);
    } catch (err) {
      console.warn('History load warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const handleDelete = async (collectionName: string, docId: string) => {
    if (!confirm('Are you sure you want to delete this saved report?')) return;

    try {
      await deleteUserDocument(collectionName, docId);
      setReports((prev) => prev.filter((item) => item.id !== docId));
      if (activeModalReport?.id === docId) setActiveModalReport(null);
      addToast('Report Deleted', 'Removed report from your history.', 'info');
    } catch (err) {
      addToast('Delete Error', 'Unable to delete report.', 'error');
    }
  };

  const handleReuse = (report: any) => {
    switch (report.categoryType) {
      case 'Business Analysis':
        navigate('/modules/business-analysis');
        break;
      case 'GBP SEO Audit':
        navigate('/modules/gbp-audit');
        break;
      case 'Social Media Posts':
        navigate('/modules/social-generator');
        break;
      case 'Review Reply':
        navigate('/modules/review-reply');
        break;
      case 'Promotion Campaign':
        navigate('/modules/promotion-generator');
        break;
      case '30-Day Marketing Plan':
        navigate('/modules/marketing-plan');
        break;
      case 'Competitive Positioning':
        navigate('/modules/competitive-positioning');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Filtering & Search
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      (r.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.categoryType || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'ALL' || r.categoryType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
            <HistoryIcon className="w-3.5 h-3.5" /> History & Archives
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Saved Reports & Growth Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access, view, export, or reuse any AI recommendations generated across your accounts.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by business name or report..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {[
            'ALL',
            'Business Analysis',
            'GBP SEO Audit',
            'Social Media Posts',
            'Review Reply',
            'Promotion Campaign',
            '30-Day Marketing Plan',
            'Competitive Positioning',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Feed */}
      {loading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          title="No Saved Reports Found"
          description="Generate your first AI local business growth strategy to see it archived here."
          actionLabel="Run Business Analysis"
          onAction={() => navigate('/modules/business-analysis')}
          icon={HistoryIcon}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {item.categoryType}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                  {item.businessName || 'Business'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.summary || item.optimizedDescription || item.campaignTitle || item.customerReview || 'AI Generated local marketing strategy output.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalReport(item)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReuse(item)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                    title="Reuse Module"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(item.collectionName, item.id)}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete Report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {activeModalReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setActiveModalReport(null)}
              className="absolute right-6 top-6 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 inline-block mb-3">
              {activeModalReport.categoryType}
            </span>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              {activeModalReport.businessName}
            </h2>
            <p className="text-xs text-slate-400 mb-6">{formatDate(activeModalReport.createdAt)}</p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed text-slate-800 dark:text-slate-200">
              {JSON.stringify(activeModalReport, null, 2)}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => exportToTxt(`${activeModalReport.businessName}_Report`, JSON.stringify(activeModalReport, null, 2))}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export TXT
              </button>
              <button
                onClick={() => exportToPdf(`${activeModalReport.businessName} Report`, activeModalReport)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
