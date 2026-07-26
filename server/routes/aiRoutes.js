import express from 'express';
import { callGemini } from '../services/geminiService.js';
import { buildBusinessAnalysisPrompt } from '../prompts/businessAnalysis.js';
import { buildSeoAuditPrompt } from '../prompts/seoAudit.js';
import { buildSocialGeneratorPrompt } from '../prompts/socialGenerator.js';
import { buildReviewReplyPrompt } from '../prompts/reviewReply.js';
import { buildPromotionGeneratorPrompt } from '../prompts/promotionGenerator.js';
import { buildMarketingPlanPrompt } from '../prompts/marketingPlan.js';
import { buildCompetitivePositioningPrompt } from '../prompts/competitivePositioning.js';

const router = express.Router();

// 1. Business Analysis + Business Health Score
router.post('/business-analysis', async (req, res, next) => {
  try {
    const { name, category, location, yearsInBusiness, targetAudience, challenges, goals } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Business Name and Category are required.' });
    }

    const prompt = buildBusinessAnalysisPrompt({
      name,
      category,
      location: location || 'Local Area',
      yearsInBusiness: yearsInBusiness || 1,
      targetAudience: targetAudience || 'Local Residents',
      challenges: challenges || 'Increasing local visibility and customer leads',
      goals: goals || 'Higher local search ranking and revenue growth',
    });

    const result = await callGemini(prompt);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

// 2. Google Business Profile SEO Audit
router.post('/gbp-audit', async (req, res, next) => {
  try {
    const { businessName, category, location, currentServices } = req.body;
    if (!businessName || !category) {
      return res.status(400).json({ success: false, message: 'Business Name and Category are required.' });
    }

    const prompt = buildSeoAuditPrompt({
      businessName,
      category,
      location: location || 'Local Market',
      currentServices,
    });

    const result = await callGemini(prompt);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

// 3. Social Media Generator
router.post('/social-generator', async (req, res, next) => {
  try {
    const { businessName, category, targetAudience, topicOrOffer } = req.body;
    if (!businessName || !category) {
      return res.status(400).json({ success: false, message: 'Business Name and Category are required.' });
    }

    const prompt = buildSocialGeneratorPrompt({
      businessName,
      category,
      targetAudience: targetAudience || 'Local community',
      topicOrOffer,
    });

    const result = await callGemini(prompt);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

// 4. Google Review Reply Generator
router.post('/review-reply', async (req, res, next) => {
  try {
    const { businessName, customerReview, tone } = req.body;
    if (!businessName || !customerReview) {
      return res.status(400).json({ success: false, message: 'Business Name and Customer Review are required.' });
    }

    const prompt = buildReviewReplyPrompt({
      businessName,
      customerReview,
      tone: tone || 'Professional',
    });

    const result = await callGemini(prompt);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

// 5. Promotion Generator
router.post('/promotion-generator', async (req, res, next) => {
  try {
    const { businessName, category, promotionType, discountDetails } = req.body;
    if (!businessName || !promotionType) {
      return res.status(400).json({ success: false, message: 'Business Name and Promotion Type are required.' });
    }

    const prompt = buildPromotionGeneratorPrompt({
      businessName,
      category: category || 'General Business',
      promotionType,
      discountDetails,
    });

    const result = await callGemini(prompt);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

// 6. 30-Day Marketing Planner
router.post('/marketing-plan', async (req, res, next) => {
  try {
    const { businessName, category, primaryGoal } = req.body;
    if (!businessName) {
      return res.status(400).json({ success: false, message: 'Business Name is required.' });
    }

    const prompt = buildMarketingPlanPrompt({
      businessName,
      category: category || 'Local Business',
      primaryGoal: primaryGoal || 'Attract more local customers and boost sales',
    });

    const result = await callGemini(prompt);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

// 7. Competitive Positioning Advisor
router.post('/competitive-positioning', async (req, res, next) => {
  try {
    const { businessName, category, competitorInfo } = req.body;
    if (!businessName || !competitorInfo) {
      return res.status(400).json({ success: false, message: 'Business Name and Competitor Information are required.' });
    }

    const prompt = buildCompetitivePositioningPrompt({
      businessName,
      category: category || 'Local Services',
      competitorInfo,
    });

    const result = await callGemini(prompt);
    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
});

export default router;
