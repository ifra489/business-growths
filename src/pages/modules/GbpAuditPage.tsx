import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { generateAiContent } from '../../services/apiService';
import { saveDocument } from '../../services/firebaseService';
import { GbpAuditReport } from '../../types';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { exportToTxt } from '../../utils/export/exportTxt';
import { exportToPdf } from '../../utils/export/exportPdf';
import {
  MapPin,
  Sparkles,
  Download,
  FileText,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Copy,
} from 'lucide-react';

export const GbpAuditPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    location: '',
    currentServices: '',
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GbpAuditReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.category) {
      addToast('Missing Fields', 'Please enter Business Name and Category.', 'warning');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setReport(null);
    setSavedId(null);

    try {
      const result = await generateAiContent<any>('gbp-audit', formData);
      const auditReport: GbpAuditReport = {
        userId: currentUser?.uid || 'guest',
        businessName: formData.businessName,
        category: formData.category,
        optimizedDescription: result.optimizedDescription || 'Optimized profile bio.',
        recommendedCategories: result.recommendedCategories || [formData.category],
        seoKeywords: result.seoKeywords || ['Local Services', formData.category],
        recommendedServices: result.recommendedServices || ['Consultation', 'Custom Service'],
        faqSuggestions: result.faqSuggestions || [],
        photoSuggestions: result.photoSuggestions || ['Storefront photo', 'Team photo'],
        postingStrategy: result.postingStrategy || ['Post twice weekly'],
        reviewStrategy: result.reviewStrategy || ['Send SMS review link after service'],
        optimizationScore: result.optimizationScore || 85,
        createdAt: new Date().toISOString(),
      };

      setReport(auditReport);
      addToast('Audit Generated!', 'Google Business Profile SEO Audit complete.', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to generate recommendations. Please try again.');
      addToast('Audit Error', err.message || 'Unable to generate recommendations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!report || !currentUser) return;
    setSaving(true);
    try {
      const id = await saveDocument('generatedReports', { ...report, reportType: 'GBP_AUDIT' });
      setSavedId(id);
      addToast('Saved to Firestore', 'GBP Audit report saved.', 'success');
    } catch (err: any) {
      addToast('Save Failed', 'Unable to save report.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to Clipboard', `${label} copied.`, 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
          <MapPin className="w-3.5 h-3.5" /> Module 2
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Google Business Profile SEO Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Optimize your Google Profile bio, local keywords, categories, FAQs, and review strategies for top local search ranking.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Metro Plumbing Services"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Plumber / Home Improvement"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                City / Service Area
              </label>
              <input
                type="text"
                disabled={loading}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Chicago, IL"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Offered Services
            </label>
            <input
              type="text"
              disabled={loading}
              value={formData.currentServices}
              onChange={(e) => setFormData({ ...formData, currentServices: e.target.value })}
              placeholder="e.g. Emergency drain cleaning, pipe repair, water heater installation"
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Generating personalized recommendations...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Run Google Profile Audit
              </>
            )}
          </button>
        </form>
      </div>

      {loading && <LoadingSkeleton type="card" count={2} />}

      {errorMsg && (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Unable to generate recommendations. Please try again.</span>
          </div>
          <p className="text-xs">{errorMsg}</p>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Audit Request
          </button>
        </div>
      )}

      {report && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 font-black text-sm flex items-center justify-center">
                {report.optimizationScore}%
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  GBP Optimization Score
                </h3>
                <p className="text-xs text-slate-500">Target score for Google Maps 3-Pack rank</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !!savedId}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" /> {savedId ? 'Saved' : saving ? 'Saving...' : 'Save Report'}
              </button>
              <button
                onClick={() => exportToTxt(`${report.businessName}_GBP_Audit`, JSON.stringify(report, null, 2))}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export TXT
              </button>
              <button
                onClick={() => exportToPdf(`${report.businessName} GBP Audit`, report)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>

          {/* Business Description */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft relative">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Optimized Business Description (750 Max Characters)
              </h3>
              <button
                onClick={() => copyToClipboard(report.optimizedDescription, 'GBP Description')}
                className="p-2 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Copy Description"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 leading-relaxed font-mono">
              {report.optimizedDescription}
            </p>
          </div>

          {/* Keywords & Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                Target Local SEO Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.seoKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-semibold rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                Recommended GBP Categories
              </h3>
              <ul className="space-y-2">
                {report.recommendedCategories.map((cat, idx) => (
                  <li key={idx} className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {cat}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQs & Photo Ideas */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
              Google Q&A FAQ Suggestions
            </h3>
            <div className="space-y-3">
              {report.faqSuggestions.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Q: {faq.question}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
