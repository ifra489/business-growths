// TypeScript interfaces for AI Local Business Growth Advisor

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface BusinessProfile {
  id?: string;
  userId: string;
  name: string;
  category: string;
  location: string;
  yearsInBusiness: number | string;
  targetAudience: string;
  challenges: string;
  goals: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BusinessHealthScore {
  totalScore: number;
  categories: {
    seo: number;
    googleBusinessProfile: number;
    socialMedia: number;
    customerEngagement: number;
    growthPotential: number;
  };
  keyImprovements: string[];
}

export interface BusinessAnalysisReport {
  id?: string;
  userId: string;
  businessName: string;
  category: string;
  summary: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  growthOpportunities: string[];
  recommendedImprovements: string[];
  priorityActionPlan: string[];
  healthScore: BusinessHealthScore;
  createdAt: string;
}

export interface GbpAuditReport {
  id?: string;
  userId: string;
  businessName: string;
  category: string;
  optimizedDescription: string;
  recommendedCategories: string[];
  seoKeywords: string[];
  recommendedServices: string[];
  faqSuggestions: { question: string; answer: string }[];
  photoSuggestions: string[];
  postingStrategy: string[];
  reviewStrategy: string[];
  optimizationScore: number;
  createdAt: string;
}

export interface SocialPostItem {
  id?: string;
  userId: string;
  businessName: string;
  platform: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Promotional' | 'Story' | 'Reel';
  instagramCaptions: string[];
  facebookPosts: string[];
  linkedInPosts: string[];
  promotionalContent: string[];
  hashtags: string[];
  storyIdeas: string[];
  reelIdeas: string[];
  ctaSuggestions: string[];
  createdAt: string;
}

export interface ReviewReplyItem {
  id?: string;
  userId: string;
  businessName: string;
  customerReview: string;
  tone: 'Professional' | 'Friendly' | 'Formal' | 'Apologetic';
  professionalReply: string;
  alternativeReply: string;
  shortVersion: string;
  createdAt: string;
}

export interface PromotionItem {
  id?: string;
  userId: string;
  businessName: string;
  promotionType: 'Weekend Campaign' | 'Holiday Promotion' | 'Referral Campaign' | 'Loyalty Program' | 'Festival Offer' | 'Seasonal Discount';
  campaignTitle: string;
  description: string;
  targetAudience: string;
  headline: string;
  bodyCopy: string;
  offerDetails: string;
  ctaText: string;
  duration: string;
  channels: string[];
  createdAt: string;
}

export interface WeeklyMarketingPlan {
  weekNumber: number;
  focusArea: string;
  objectives: string[];
  tasks: { day: string; task: string; completed?: boolean }[];
}

export interface MarketingPlanItem {
  id?: string;
  userId: string;
  businessName: string;
  month: string;
  weeks: WeeklyMarketingPlan[];
  dailyChecklist: string[];
  createdAt: string;
}

export interface CompetitorInsightItem {
  id?: string;
  userId: string;
  businessName: string;
  competitorsProvided: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  differentiationStrategy: string[];
  nextSteps: string[];
  createdAt: string;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  defaultBusinessId?: string;
  updatedAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
