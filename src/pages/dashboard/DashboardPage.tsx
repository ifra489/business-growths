import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserDocuments } from '../../services/firebaseService';
import { StatCard } from '../../components/dashboard/StatCard';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { LastGeneratedReportCard } from '../../components/dashboard/LastGeneratedReportCard';
import { BusinessAnalysisReport } from '../../types';
import {
  Building2,
  FileText,
  Calendar,
  Share2,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    businesses: 1,
    reports: 0,
    marketingPlans: 0,
    socialPosts: 0,
    reviewReplies: 0,
  });

  const [lastReport, setLastReport] = useState<BusinessAnalysisReport | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const loadDashboardData = async () => {
      try {
        const [reports, plans, posts, reviews, promotions, positioning] = await Promise.all([
          getUserDocuments<BusinessAnalysisReport>('generatedReports', currentUser.uid),
          getUserDocuments<any>('marketingPlans', currentUser.uid),
          getUserDocuments<any>('socialPosts', currentUser.uid),
          getUserDocuments<any>('reviewReplies', currentUser.uid),
          getUserDocuments<any>('promotions', currentUser.uid),
          getUserDocuments<any>('competitorInsights', currentUser.uid),
        ]);

        setStats({
          businesses: Math.max(1, new Set(reports.map((r) => r.businessName)).size),
          reports: reports.length,
          marketingPlans: plans.length,
          socialPosts: posts.length,
          reviewReplies: reviews.length,
        });

        if (reports.length > 0) {
          const sorted = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLastReport(sorted[0]);
        }

        // Build recent activity timeline
        const allEvents: any[] = [
          ...reports.map((r) => ({ id: r.id || '', type: 'Analysis', businessName: r.businessName, title: 'SWOT & Business Health Audit', createdAt: r.createdAt })),
          ...plans.map((p) => ({ id: p.id || '', type: '30-Day Plan', businessName: p.businessName, title: '30-Day Marketing Roadmap', createdAt: p.createdAt })),
          ...posts.map((s) => ({ id: s.id || '', type: 'Social', businessName: s.businessName, title: `Social Content for ${s.platform || 'Multi-platform'}`, createdAt: s.createdAt })),
          ...reviews.map((rv) => ({ id: rv.id || '', type: 'Review Reply', businessName: rv.businessName, title: `Customer Review Reply (${rv.tone})`, createdAt: rv.createdAt })),
          ...promotions.map((pr) => ({ id: pr.id || '', type: 'Promotion', businessName: pr.businessName, title: pr.promotionType, createdAt: pr.createdAt })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setActivities(allEvents);
      } catch (err) {
        console.warn('Dashboard load warning:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md mb-2 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" /> AI Business Advisor Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {userProfile?.displayName || 'Business Owner'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 mt-1 max-w-xl">
            Here is your local business growth overview. Use our 7 AI modules to optimize SEO, create social content, and boost revenue.
          </p>
        </div>

        <button
          onClick={() => navigate('/modules/business-analysis')}
          className="relative z-10 px-5 py-3 bg-white text-brand-700 font-bold text-xs rounded-2xl shadow-lg hover:bg-brand-50 transition-all shrink-0 flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4 text-brand-600" /> Run New Analysis
        </button>

        {/* Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Business Profiles"
          count={stats.businesses}
          icon={Building2}
          onClick={() => navigate('/profile')}
        />
        <StatCard
          title="Reports Generated"
          count={stats.reports}
          icon={FileText}
          onClick={() => navigate('/history')}
        />
        <StatCard
          title="Marketing Plans"
          count={stats.marketingPlans}
          icon={Calendar}
          onClick={() => navigate('/modules/marketing-plan')}
        />
        <StatCard
          title="Social Posts"
          count={stats.socialPosts}
          icon={Share2}
          onClick={() => navigate('/modules/social-generator')}
        />
        <StatCard
          title="Review Replies"
          count={stats.reviewReplies}
          icon={MessageSquare}
          onClick={() => navigate('/modules/review-reply')}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Grid Layout: Last Generated Report & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LastGeneratedReportCard report={lastReport} />
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
};
