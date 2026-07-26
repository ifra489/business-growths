import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { generateAiContent } from '../../services/apiService';
import { saveDocument } from '../../services/firebaseService';
import { BusinessAnalysisReport } from '../../types';
import { BusinessHealthScoreChart } from '../../components/charts/BusinessHealthScoreChart';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { exportToTxt } from '../../utils/export/exportTxt';
import { exportToPdf } from '../../utils/export/exportPdf';
import {
  BarChart3,
  Sparkles,
  Download,
  FileText,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const BusinessAnalysisPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    yearsInBusiness: '2',
    targetAudience: '',
    challenges: '',
    goals: '',
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<BusinessAnalysisReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      addToast('Missing Required Fields', 'Please provide Business Name and Category.', 'warning');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setReport(null);
    setSavedId(null);

    try {
      const result = await generateAiContent<any>('business-analysis', formData);
      
      const fullReport: BusinessAnalysisReport = {
        userId: currentUser?.uid || 'guest',
        businessName: formData.name,
        category: formData.category,
        summary: result.summary || 'Detailed local business growth analysis.',
        swotAnalysis: result.swotAnalysis || {
          strengths: ['Strong local community presence'],
          weaknesses: ['Limited digital SEO visibility'],
          opportunities: ['Expand Google Business Profile posts'],
          threats: ['Increasing local competition'],
        },
        growthOpportunities: result.growthOpportunities || [],
        recommendedImprovements: result.recommendedImprovements || [],
        priorityActionPlan: result.priorityActionPlan || [],
        healthScore: result.healthScore || {
          totalScore: 78,
          categories: {
            seo: 75,
            googleBusinessProfile: 80,
            socialMedia: 70,
            customerEngagement: 82,
            growthPotential: 85,
          },
          keyImprovements: [
            'Optimize local Google Profile description with keywords',
            'Publish weekly social proof testimonials',
            'Respond to all customer reviews within 24 hours',
          ],
        },
        createdAt: new Date().toISOString(),
      };

      setReport(fullReport);
      addToast('Analysis Complete', 'Your business analysis and health score are ready.', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to generate recommendations. Please try again.');
      addToast('Generation Error', err.message || 'Unable to generate recommendations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToFirestore = async () => {
    if (!report || !currentUser) return;
    setSaving(true);
    try {
      const id = await saveDocument('generatedReports', report);
      setSavedId(id);
      addToast('Saved to Firestore', 'Report saved to your account history.', 'success');
    } catch (err: any) {
      addToast('Save Failed', 'Unable to save report.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportTxt = () => {
    if (!report) return;
    const txtContent = ` AI - BUSINESS ANALYSIS & HEALTH REPORT
Business Name: ${report.businessName}
Category: ${report.category}
Health Score: ${report.healthScore?.totalScore || 75}/100

SUMMARY:
${report.summary}

SWOT ANALYSIS:
Strengths: ${report.swotAnalysis.strengths.join(', ')}
Weaknesses: ${report.swotAnalysis.weaknesses.join(', ')}
Opportunities: ${report.swotAnalysis.opportunities.join(', ')}
Threats: ${report.swotAnalysis.threats.join(', ')}

PRIORITY ACTION PLAN:
${report.priorityActionPlan.map((step, i) => `${i + 1}. ${step}`).join('\n')}
`;
    exportToTxt(`${report.businessName}_Business_Analysis`, txtContent);
    addToast('Downloaded TXT', 'Exported analysis as text file.', 'info');
  };

  const handleExportPdf = () => {
    if (!report) return;
    exportToPdf(`${report.businessName} Business Analysis Report`, report);
    addToast('Downloaded PDF', 'Exported analysis as PDF document.', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Module 1
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Business Analysis & Health Score
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate strategic SWOT analysis, growth opportunities, priority roadmap, and a 0-100 Business Health Score.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Apex Local Dental Clinic"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Business Category / Industry <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Dental Care / Healthcare"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Location / City
              </label>
              <input
                type="text"
                disabled={loading}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Austin, Texas"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Years in Business
              </label>
              <input
                type="text"
                disabled={loading}
                value={formData.yearsInBusiness}
                onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                placeholder="e.g. 3 years"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                disabled={loading}
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g. Families & professionals within 10 miles"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Business Goals
              </label>
              <input
                type="text"
                disabled={loading}
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                placeholder="e.g. Double monthly inquiries & reviews"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Challenges / Bottlenecks
            </label>
            <textarea
              rows={2}
              disabled={loading}
              value={formData.challenges}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              placeholder="e.g. Low Google Business Profile rank, lack of social media content consistency, low review response rate."
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
                <Sparkles className="w-4 h-4" /> Run Business Analysis & Health Audit
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 text-brand-700 text-xs font-semibold flex items-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
            <span>Generating personalized recommendations... Please wait a moment.</span>
          </div>
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="card" count={2} />
        </div>
      )}

      {/* Error Message & Retry */}
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
            <RefreshCw className="w-3.5 h-3.5" /> Retry Request
          </button>
        </div>
      )}

      {/* Results Display */}
      {report && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-400">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Analysis Ready for {report.businessName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveToFirestore}
                disabled={saving || !!savedId}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" /> {savedId ? 'Saved in History' : saving ? 'Saving...' : 'Save to Firestore'}
              </button>
              <button
                onClick={handleExportTxt}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export TXT
              </button>
              <button
                onClick={handleExportPdf}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>

          {/* Health Score Visual Chart */}
          <BusinessHealthScoreChart scoreData={report.healthScore} businessName={report.businessName} />

          {/* Executive Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Executive Summary</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* SWOT Analysis Matrix */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-6">
              SWOT Strategic Analysis Matrix
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
                  Strengths (Internal Advantages)
                </h4>
                <ul className="space-y-2">
                  {report.swotAnalysis.strengths.map((item, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-3">
                  Weaknesses (Internal Gaps)
                </h4>
                <ul className="space-y-2">
                  {report.swotAnalysis.weaknesses.map((item, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800/60">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-700 dark:text-brand-400 mb-3">
                  Opportunities (External Market Upside)
                </h4>
                <ul className="space-y-2">
                  {report.swotAnalysis.opportunities.map((item, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-3">
                  Threats (External Risks)
                </h4>
                <ul className="space-y-2">
                  {report.swotAnalysis.threats.map((item, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Priority Action Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
              Priority Growth Action Plan
            </h3>
            <div className="space-y-3">
              {report.priorityActionPlan.map((action, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed mt-0.5">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
