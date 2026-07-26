import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { generateAiContent } from '../../services/apiService';
import { saveDocument } from '../../services/firebaseService';
import { SocialPostItem } from '../../types';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { exportToTxt } from '../../utils/export/exportTxt';
import { exportToPdf } from '../../utils/export/exportPdf';
import {
  Share2,
  Sparkles,
  Download,
  FileText,
  Save,
  Copy,
  RefreshCw,
  AlertCircle,
  Instagram,
  Facebook,
  Linkedin,
  Video,
} from 'lucide-react';

export const SocialGeneratorPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    targetAudience: '',
    topicOrOffer: '',
  });

  const [loading, setLoading] = useState(false);
  const [socialData, setSocialData] = useState<SocialPostItem | null>(null);
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
    setSocialData(null);
    setSavedId(null);

    try {
      const result = await generateAiContent<any>('social-generator', formData);
      const postItem: SocialPostItem = {
        userId: currentUser?.uid || 'guest',
        businessName: formData.businessName,
        platform: 'Promotional',
        instagramCaptions: result.instagramCaptions || [],
        facebookPosts: result.facebookPosts || [],
        linkedInPosts: result.linkedInPosts || [],
        promotionalContent: result.promotionalContent || [],
        hashtags: result.hashtags || [],
        storyIdeas: result.storyIdeas || [],
        reelIdeas: result.reelIdeas || [],
        ctaSuggestions: result.ctaSuggestions || [],
        createdAt: new Date().toISOString(),
      };

      setSocialData(postItem);
      addToast('Social Posts Generated!', 'Captions, stories, and reel ideas ready.', 'success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to generate recommendations. Please try again.');
      addToast('Generation Error', err.message || 'Unable to generate recommendations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!socialData || !currentUser) return;
    setSaving(true);
    try {
      const id = await saveDocument('socialPosts', socialData);
      setSavedId(id);
      addToast('Saved to Firestore', 'Social posts saved.', 'success');
    } catch (err: any) {
      addToast('Save Failed', 'Unable to save post.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyText = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied!', `${title} copied to clipboard.`, 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
          <Share2 className="w-3.5 h-3.5" /> Module 3
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Social Media Content Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate engaging Instagram captions, Facebook updates, LinkedIn posts, Stories, Reels scripts, and hashtags.
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
                placeholder="e.g. Bella Italia Bistro"
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
                placeholder="e.g. Italian Restaurant / Dining"
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
                placeholder="e.g. Local food lovers & families"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Special Topic / Promotion / Offer Focus
            </label>
            <input
              type="text"
              disabled={loading}
              value={formData.topicOrOffer}
              onChange={(e) => setFormData({ ...formData, topicOrOffer: e.target.value })}
              placeholder="e.g. 20% off Friday Pizza Night special offer"
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
                <Sparkles className="w-4 h-4" /> Generate Social Content
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

      {socialData && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-400">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Social Media Content Ready for {socialData.businessName}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !!savedId}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" /> {savedId ? 'Saved' : saving ? 'Saving...' : 'Save Posts'}
              </button>
              <button
                onClick={() => exportToTxt(`${socialData.businessName}_Social_Posts`, JSON.stringify(socialData, null, 2))}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export TXT
              </button>
              <button
                onClick={() => exportToPdf(`${socialData.businessName} Social Media Posts`, socialData)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>

          {/* Instagram Captions */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Instagram className="w-5 h-5 text-rose-500" /> Instagram Captions
            </h3>
            <div className="space-y-4">
              {socialData.instagramCaptions.map((cap, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 relative group">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pr-10">{cap}</p>
                  <button
                    onClick={() => copyText(cap, `Instagram Caption ${idx + 1}`)}
                    className="absolute right-3 top-3 p-2 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Facebook & LinkedIn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                <Facebook className="w-4 h-4 text-blue-600" /> Facebook Post
              </h3>
              {socialData.facebookPosts.map((post, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 relative">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pr-8">{post}</p>
                  <button
                    onClick={() => copyText(post, 'Facebook Post')}
                    className="absolute right-3 top-3 p-1.5 text-slate-400 hover:text-brand-600 rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-soft">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn Article / Post
              </h3>
              {socialData.linkedInPosts.map((post, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 relative">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pr-8">{post}</p>
                  <button
                    onClick={() => copyText(post, 'LinkedIn Post')}
                    className="absolute right-3 top-3 p-1.5 text-slate-400 hover:text-brand-600 rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reels & Story Ideas */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-soft">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Video className="w-5 h-5 text-purple-500" /> Story & Reel Video Ideas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Instagram Story Ideas</h4>
                {socialData.storyIdeas.map((story, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 mb-2 border border-slate-200/60">
                    💡 {story}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Trending Reel Scripts</h4>
                {socialData.reelIdeas.map((reel, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 mb-2 border border-slate-200/60">
                    🎬 {reel}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
