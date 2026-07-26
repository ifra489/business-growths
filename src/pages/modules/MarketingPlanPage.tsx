import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { generateAiContent } from '../../services/apiService';
import { saveDocument } from '../../services/firebaseService';
import { MarketingPlanItem } from '../../types';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { exportToTxt } from '../../utils/export/exportTxt';
import { exportToPdf } from '../../utils/export/exportPdf';
import {
  Calendar,
  Sparkles,
  Download,
  FileText,
  Save,
  CheckSquare,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const MarketingPlanPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    primaryGoal: '',
  });

  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState<MarketingPlanItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName) {
      addToast('Missing Field', 'Please enter Business Name.', 'warning');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setPlanData(null);
    setSavedId(null);

    try {
      const result = await generateAiContent<any>('marketing-plan', formData);
      const plan: MarketingPlanItem = {
        userId: currentUser?.uid || 'guest',
        businessName: formData.businessName,
        month: '30-Day Growth Roadmap',
        weeks: result.weeks || [],
        dailyChecklist: result.dailyChecklist || [
          'Respond to all new Google Reviews',
          'Publish 1 story update or GBP photo',
        ],
        createdAt: new Date().toISOString(),
      };

      setPlanData(plan);
      addToast('Roadmap Generated!', '30-Day Marketing Roadmap complete.', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to generate recommendations. Please try again.');
      addToast('Generation Error', err.message || 'Unable to generate recommendations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!planData || !currentUser) return;
    setSaving(true);
    try {
      const id = await saveDocument('marketingPlans', planData);
      setSavedId(id);
      addToast('Saved to Firestore', '30-Day marketing plan saved.', 'success');
    } catch (err: any) {
      addToast('Save Failed', 'Unable to save plan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = (weekIdx: number, taskIdx: number) => {
    if (!planData) return;
    const updatedWeeks = [...planData.weeks];
    const task = updatedWeeks[weekIdx].tasks[taskIdx];
    task.completed = !task.completed;
    setPlanData({ ...planData, weeks: updatedWeeks });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
          <Calendar className="w-3.5 h-3.5" /> Module 6
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          30-Day Marketing Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Structured 4-week local marketing roadmap with daily actionable checklists to scale customer acquisition.
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
                placeholder="e.g. Horizon Coffee Roasters"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                disabled={loading}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Coffee Shop & Bakery"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Goal for Next 30 Days
              </label>
              <input
                type="text"
                disabled={loading}
                value={formData.primaryGoal}
                onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                placeholder="e.g. Increase repeat foot traffic & local reviews"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>
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
                <Sparkles className="w-4 h-4" /> Generate 30-Day Roadmap
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

      {planData && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" /> 30-Day Growth Roadmap for {planData.businessName}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !!savedId}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" /> {savedId ? 'Saved' : saving ? 'Saving...' : 'Save Plan'}
              </button>
              <button
                onClick={() => exportToTxt(`${planData.businessName}_Marketing_Plan`, JSON.stringify(planData, null, 2))}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export TXT
              </button>
              <button
                onClick={() => exportToPdf(`${planData.businessName} 30-Day Marketing Plan`, planData)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>

          {/* Daily Routine Checklist */}
          <div className="p-6 rounded-3xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/60">
            <h4 className="text-xs font-extrabold uppercase text-brand-700 dark:text-brand-300 mb-2 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" /> Daily Habits Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {planData.dailyChecklist.map((habit, i) => (
                <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 border border-brand-100 dark:border-brand-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>{habit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Sections */}
          <div className="space-y-6">
            {planData.weeks.map((week, wIdx) => (
              <div key={wIdx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      Week {week.weekNumber}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-2">{week.focusArea}</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  {week.tasks.map((task, tIdx) => (
                    <div
                      key={tIdx}
                      onClick={() => toggleTask(wIdx, tIdx)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 line-through opacity-75'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!task.completed}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 block">{task.day}</span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{task.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
