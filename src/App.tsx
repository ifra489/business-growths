import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { RefreshCw } from 'lucide-react';

// Lazy-loaded pages for optimal performance and code splitting
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));

const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const BusinessAnalysisPage = lazy(() => import('./pages/modules/BusinessAnalysisPage').then((m) => ({ default: m.BusinessAnalysisPage })));
const GbpAuditPage = lazy(() => import('./pages/modules/GbpAuditPage').then((m) => ({ default: m.GbpAuditPage })));
const SocialGeneratorPage = lazy(() => import('./pages/modules/SocialGeneratorPage').then((m) => ({ default: m.SocialGeneratorPage })));
const ReviewReplyPage = lazy(() => import('./pages/modules/ReviewReplyPage').then((m) => ({ default: m.ReviewReplyPage })));
const PromotionGeneratorPage = lazy(() => import('./pages/modules/PromotionGeneratorPage').then((m) => ({ default: m.PromotionGeneratorPage })));
const MarketingPlanPage = lazy(() => import('./pages/modules/MarketingPlanPage').then((m) => ({ default: m.MarketingPlanPage })));
const CompetitivePositioningPage = lazy(() => import('./pages/modules/CompetitivePositioningPage').then((m) => ({ default: m.CompetitivePositioningPage })));
const HistoryPage = lazy(() => import('./pages/history/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
    <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center animate-spin shadow-lg mb-3">
      <RefreshCw className="w-5 h-5" />
    </div>
    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading module...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected Application SaaS Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DashboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/modules/business-analysis"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <BusinessAnalysisPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/modules/gbp-audit"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <GbpAuditPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/modules/social-generator"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SocialGeneratorPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/modules/review-reply"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ReviewReplyPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/modules/promotion-generator"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <PromotionGeneratorPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/modules/marketing-plan"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <MarketingPlanPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/modules/competitive-positioning"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <CompetitivePositioningPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <HistoryPage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ProfilePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Fallback Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
