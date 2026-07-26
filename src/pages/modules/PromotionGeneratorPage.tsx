import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { generateAiContent } from '../../services/apiService';
import { saveDocument } from '../../services/firebaseService';
import { PromotionItem } from '../../types';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { exportToTxt } from '../../utils/export/exportTxt';
import { exportToPdf } from '../../utils/export/exportPdf';
import {
  Tag,
  Sparkles,
  Download,
  FileText,
  Save,
  Copy,
  RefreshCw,
  AlertCircle,
  Megaphone,
} from 'lucide-react';

export const PromotionGeneratorPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    promotionType: 'Weekend Campaign' as PromotionItem['promotionType'],
    discountDetails: '',
  });

  const [loading, setLoading] = useState(false);
  const [promoData, setPromoData] = useState<PromotionItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName) {
      addToast('Missing Fields', 'Please enter Business Name.', 'warning');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setPromoData(null);
    setSavedId(null);

    try {
      const result = await generateAiContent<any>('promotion-generator', formData);
      const promo: PromotionItem = {
        userId: currentUser?.uid || 'guest',
        businessName: formData.businessName,
        promotionType: formData.promotionType,
        campaignTitle: result.campaignTitle || 'Special Business Promotion',
        description: result.description || 'Promotional offer campaign.',
        targetAudience: result.targetAudience || 'Local community customers',
        headline: result.headline || 'Exclusive Offer This Week!',
        bodyCopy: result.bodyCopy || 'Visit us today to enjoy special perks.',
        offerDetails: result.offerDetails || '20% off all services',
        ctaText: result.ctaText || 'Claim Offer Now',
        duration: result.duration || 'Weekend Only',
        channels: result.channels || ['Instagram', 'Google Business Profile', 'In-Store'],
        createdAt: new Date().toISOString(),
      };

      setPromoData(promo);
      addToast('Campaign Created!', 'Promotional campaign framework ready.', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to generate recommendations. Please try again.');
      addToast('Generation Error', err.message || 'Unable to generate recommendations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!promoData || !currentUser) return;
    setSaving(true);
    try {
      const id = await saveDocument('promotions', promoData);
      setSavedId(id);
      addToast('Saved to Firestore', 'Promotion campaign saved.', 'success');
    } catch (err: any) {
      addToast('Save Failed', 'Unable to save campaign.', 'error');
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
          <Tag className="w-3.5 h-3.5" /> Module 5
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Promotion & Campaign Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create high-converting weekend campaigns, holiday promos, referral programs, and seasonal discounts.
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
                placeholder="e.g. Glow Skincare Spa"
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
                placeholder="e.g. Wellness & Spa"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Promotion Type
              </label>
              <select
                disabled={loading}
                value={formData.promotionType}
                onChange={(e) => setFormData({ ...formData, promotionType: e.target.value as any })}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              >
                <option value="Weekend Campaign">Weekend Flash Special</option>
                <option value="Holiday Promotion">Holiday Season Promotion</option>
                <option value="Referral Campaign">Customer Referral Offer</option>
                <option value="Loyalty Program">Loyalty Rewards Program</option>
                <option value="Festival Offer">Festival Event Offer</option>
                <option value="Seasonal Discount">Seasonal Clearance Discount</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Specific Offer or Discount Details
            </label>
            <input
              type="text"
              disabled={loading}
              value={formData.discountDetails}
              onChange={(e) => setFormData({ ...formData, discountDetails: e.target.value })}
              placeholder="e.g. Buy 1 Facial get 50% off second service + free consultation"
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
                <Sparkles className="w-4 h-4" /> Generate Promotional Campaign
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

      {promoData && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-rose-500" /> {promoData.campaignTitle}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !!savedId}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" /> {savedId ? 'Saved' : saving ? 'Saving...' : 'Save Promotion'}
              </button>
              <button
                onClick={() => exportToTxt(`${promoData.businessName}_Promotion`, JSON.stringify(promoData, null, 2))}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export TXT
              </button>
              <button
                onClick={() => exportToPdf(`${promoData.businessName} Promotion`, promoData)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
            <div>
              <span className="px-3 py-1 text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-lg inline-block mb-2">
                Headline Banner
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{promoData.headline}</h2>
              <p className="text-xs text-slate-500 mt-1">{promoData.description}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Campaign Body Copy:</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{promoData.bodyCopy}</p>
              <button
                onClick={() => copyText(promoData.bodyCopy, 'Promotional Body Copy')}
                className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Copy
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200/60">
                <span className="text-[10px] font-bold uppercase text-brand-600">Offer perk</span>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">{promoData.offerDetails}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60">
                <span className="text-[10px] font-bold uppercase text-emerald-600">Recommended CTA</span>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">{promoData.ctaText}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/60">
                <span className="text-[10px] font-bold uppercase text-amber-600">Runtime Duration</span>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">{promoData.duration}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
