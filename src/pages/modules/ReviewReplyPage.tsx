import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { generateAiContent } from '../../services/apiService';
import { saveDocument } from '../../services/firebaseService';
import { ReviewReplyItem } from '../../types';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { exportToTxt } from '../../utils/export/exportTxt';
import { exportToPdf } from '../../utils/export/exportPdf';
import {
  MessageSquare,
  Sparkles,
  Download,
  FileText,
  Save,
  Copy,
  RefreshCw,
  AlertCircle,
  ThumbsUp,
} from 'lucide-react';

export const ReviewReplyPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    customerReview: '',
    tone: 'Professional' as 'Professional' | 'Friendly' | 'Formal' | 'Apologetic',
  });

  const [loading, setLoading] = useState(false);
  const [replyData, setReplyData] = useState<ReviewReplyItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.customerReview) {
      addToast('Missing Fields', 'Please enter Business Name and Customer Review.', 'warning');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setReplyData(null);
    setSavedId(null);

    try {
      const result = await generateAiContent<any>('review-reply', formData);
      const item: ReviewReplyItem = {
        userId: currentUser?.uid || 'guest',
        businessName: formData.businessName,
        customerReview: formData.customerReview,
        tone: formData.tone,
        professionalReply: result.professionalReply || 'Thank you for taking the time to review our business.',
        alternativeReply: result.alternativeReply || 'We appreciate your valuable feedback.',
        shortVersion: result.shortVersion || 'Thank you for your feedback!',
        createdAt: new Date().toISOString(),
      };

      setReplyData(item);
      addToast('Replies Generated!', '3 review reply variations ready.', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to generate recommendations. Please try again.');
      addToast('Generation Error', err.message || 'Unable to generate recommendations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!replyData || !currentUser) return;
    setSaving(true);
    try {
      const id = await saveDocument('reviewReplies', replyData);
      setSavedId(id);
      addToast('Saved to Firestore', 'Review reply saved.', 'success');
    } catch (err: any) {
      addToast('Save Failed', 'Unable to save review reply.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied!', `${label} copied.`, 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
          <MessageSquare className="w-3.5 h-3.5" /> Module 4
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Google Review Reply Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Turn reviews into customer loyalty. Generate professional, friendly, formal, or apologetic responses instantly.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                placeholder="e.g. Apex Auto Repairs"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Desired Reply Tone
              </label>
              <select
                disabled={loading}
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              >
                <option value="Professional">Professional & Courteous</option>
                <option value="Friendly">Friendly & Warm</option>
                <option value="Formal">Formal & Official</option>
                <option value="Apologetic">Apologetic & Problem Solver</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Paste Customer Review <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              disabled={loading}
              value={formData.customerReview}
              onChange={(e) => setFormData({ ...formData, customerReview: e.target.value })}
              placeholder="e.g. 'Great service! Fixed my car AC on short notice and reasonable price. Will definitely come back!'"
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
                <Sparkles className="w-4 h-4" /> Generate Review Replies
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

      {replyData && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-emerald-500" /> Replies Ready ({replyData.tone} Tone)
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !!savedId}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" /> {savedId ? 'Saved' : saving ? 'Saving...' : 'Save Replies'}
              </button>
              <button
                onClick={() => exportToTxt(`${replyData.businessName}_Review_Reply`, JSON.stringify(replyData, null, 2))}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export TXT
              </button>
              <button
                onClick={() => exportToPdf(`${replyData.businessName} Review Reply`, replyData)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft relative flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 inline-block mb-3">
                  Option 1: Primary Reply
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {replyData.professionalReply}
                </p>
              </div>
              <button
                onClick={() => copyText(replyData.professionalReply, 'Primary Reply')}
                className="mt-4 py-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-slate-700 dark:text-slate-300 hover:text-brand-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Primary Reply
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft relative flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 inline-block mb-3">
                  Option 2: Alternative Reply
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {replyData.alternativeReply}
                </p>
              </div>
              <button
                onClick={() => copyText(replyData.alternativeReply, 'Alternative Reply')}
                className="mt-4 py-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Alternative
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft relative flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 inline-block mb-3">
                  Option 3: Short / Quick Version
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {replyData.shortVersion}
                </p>
              </div>
              <button
                onClick={() => copyText(replyData.shortVersion, 'Short Reply')}
                className="mt-4 py-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 hover:text-amber-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Short Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
