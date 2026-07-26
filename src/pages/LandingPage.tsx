import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BarChart3,
  MapPin,
  Share2,
  MessageSquare,
  Tag,
  Calendar,
  Target,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="h-20 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md sticky top-0 z-30 bg-white/70 dark:bg-slate-950/70 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight block"> AI</span>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider block">
              Local Business Growth Advisor
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-16 md:py-24 px-6 lg:px-12 text-center max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-300 text-xs font-bold border border-brand-200 dark:border-brand-800 mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-brand-500" />
          University Final Year Capstone Project
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
          Supercharge Your Local Business Growth with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-emerald-500">AI Intelligence</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-normal">
          An all-in-one AI Growth Advisor for local stores, clinics, restaurants, and service providers. Calculate your Business Health Score, audit Google Business Profile SEO, craft multi-platform social posts, respond to customer reviews, and generate 30-day marketing roadmaps.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-3 group hover:scale-105"
          >
            Launch Advisor Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            Existing User Login
          </button>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Firebase Auth & Firestore
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure Express AI Backend
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> TXT & PDF Export
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Business Health Score
          </span>
        </div>
      </header>

      {/* Modules Grid */}
      <section className="py-16 px-6 lg:px-12 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              7 Powerful AI Modules Built for Small Business Success
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              Automate local marketing, SEO optimization, and customer engagement in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Business Analysis & Health Score',
                desc: 'Comprehensive SWOT analysis, priority growth plan, and visual score out of 100.',
                icon: BarChart3,
                badge: 'Visual Score',
              },
              {
                title: 'Google Business Profile SEO Audit',
                desc: 'Optimized bios, local SEO keywords, category recommendations, and FAQ suggestions.',
                icon: MapPin,
                badge: 'Local SEO',
              },
              {
                title: 'Social Media Content Generator',
                desc: 'Instant Instagram captions, FB posts, LinkedIn articles, Reel scripts, and hashtags.',
                icon: Share2,
                badge: 'Multi-Platform',
              },
              {
                title: 'Google Review Reply Generator',
                desc: 'Generate professional, friendly, formal, and apologetic responses for positive or negative reviews.',
                icon: MessageSquare,
                badge: 'Reputation',
              },
              {
                title: 'Promotion Generator',
                desc: 'Create weekend offers, holiday promos, referral programs, and seasonal campaigns.',
                icon: Tag,
                badge: 'Sales Boost',
              },
              {
                title: '30-Day Marketing Planner',
                desc: '4-week structured marketing roadmap with daily actionable execution checklists.',
                icon: Calendar,
                badge: 'Action Plan',
              },
              {
                title: 'Competitive Positioning Advisor',
                desc: 'Input competitor information to receive differentiation strategies based solely on supplied data.',
                icon: Target,
                badge: 'Differentiation',
              },
            ].map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{mod.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{mod.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 lg:px-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026  AI Local Business Growth Advisor. University Final Year Project.</p>
      </footer>
    </div>
  );
};
