import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { generateAiContent } from '../../services/apiService';
import { saveDocument } from '../../services/firebaseService';
import { CompetitorInsightItem } from '../../types';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { exportToTxt } from '../../utils/export/exportTxt';
import { exportToPdf } from '../../utils/export/exportPdf';
import {
  Target,
  Sparkles,
  Download,
  FileText,
  Save,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const CompetitivePositioningPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    competitorInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [positioningData, setPositioningData] = useState<CompetitorInsightItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.competitorInfo) {
      addToast('Missing Fields', 'Please enter Business Name and Competitor Information.', 'warning');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setPositioningData(null);
    setSavedId(null);

    try {
      const result = await generateAiContent<any>('competitive-positioning', formData);
      const item: CompetitorInsightItem = {
        userId: currentUser?.uid || 'guest',
        businessName: formData.businessName,
        competitorsProvided: formData.competitorInfo,
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        opportunities: result.opportunities || [],
        differentiationStrategy: result.differentiationStrategy || [],
        nextSteps: result.nextSteps || [
          'Highlight Unique Value Proposition on website',
          'Offer bundle service options',
          'Emphasize local community connection',
        ],
        createdAt: new Date().toISOString(),
      };

      setPositioningData(item);
      addToast('Analysis Complete', 'Competitive positioning analysis ready based on provided data.', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to generate recommendations. Please try again.');
      addToast('Generation Error', err.message || 'Unable to generate recommendations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!positioningData || !currentUser) return;
    setSaving(true);
    try {
      const id = await saveDocument('competitorInsights', positioningData);
      setSavedId(id);
      addToast('Saved to Firestore', 'Competitive positioning report saved.', 'success');
    } catch (err: any) {
      addToast('Save Failed', 'Unable to save analysis.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
          <Target className="w-3.5 h-3.5" /> Module 7
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Competitive Positioning Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Analyze user-supplied competitor details to craft unique differentiation strategies and competitive advantages.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Strict Input-Based Analysis Notice</span>
          <span>
            The AI analyzes ONLY the specific competitor information you provide in the box below. It does not perform live internet scraping or fabricate undisclosed competitor data.
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                My Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Quantum Fitness Gym"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Industry / Category
              </label>
              <input
                type="text"
                disabled={loading}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Fitness & Personal Training"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Manually Enter Competitors & Known Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              disabled={loading}
              value={formData.competitorInfo}
              onChange={(e) => setFormData({ ...formData, competitorInfo: e.target.value })}
              placeholder="e.g. 'Competitor A: Big Chain Gym, cheap $10/mo pricing, busy crowds, poor personal coaching. Competitor B: Boutique studio, very expensive $200/mo, limited hours.'"
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
                <Sparkles className="w-4 h-4" /> Analyze Competitive Positioning
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
            <RefreshCw className="w-3.5 h-3.5" /> Retry Request
          </button>
        </div>
      )}

      {positioningData && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-600" /> Positioning Strategy for {positioningData.businessName}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !!savedId}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" /> {savedId ? 'Saved' : saving ? 'Saving...' : 'Save Strategy'}
              </button>
              <button
                onClick={() => exportToTxt(`${positioningData.businessName}_Positioning`, JSON.stringify(positioningData, null, 2))}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export TXT
              </button>
              <button
                onClick={() => exportToPdf(`${positioningData.businessName} Competitive Positioning`, positioningData)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>

          {/* Differentiation Strategies */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
              Unique Differentiation Strategy (UVP Positioning)
            </h3>
            <div className="space-y-3">
              {positioningData.differentiationStrategy.map((strat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{strat}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft">
              <h4 className="text-xs font-extrabold uppercase text-emerald-600 mb-3">Relative Competitive Advantages</h4>
              <ul className="space-y-2">
                {positioningData.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft">
              <h4 className="text-xs font-extrabold uppercase text-purple-600 mb-3">Market Opportunities Identified</h4>
              <ul className="space-y-2">
                {positioningData.opportunities.map((o, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3 Practical Next Steps */}
          {positioningData.nextSteps && positioningData.nextSteps.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">3 Practical Next Steps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {positioningData.nextSteps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 text-xs font-medium text-slate-800 dark:text-slate-200">
                    <span className="font-bold text-brand-600 mr-1.5">{idx + 1}.</span> {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
