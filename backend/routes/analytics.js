const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Consultation = require('../models/Consultation');
const SentimentAnalysis = require('../models/SentimentAnalysis');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get sentiment analysis for a consultation
router.get('/sentiment/:consultationId', authenticateToken, async (req, res) => {
  try {
    const { consultationId } = req.params;
    
    const comments = await Comment.find({ 
      consultationId,
      status: 'approved'
    });

    const sentimentCounts = {
      positive: comments.filter(c => c.sentiment === 'positive').length,
      neutral: comments.filter(c => c.sentiment === 'neutral').length,
      negative: comments.filter(c => c.sentiment === 'negative').length,
      total: comments.length
    };

    // Calculate trends (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentComments = comments.filter(c => new Date(c.createdAt) > thirtyDaysAgo);
    
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayComments = recentComments.filter(c => {
        const commentDate = new Date(c.createdAt);
        return commentDate.toDateString() === date.toDateString();
      });

      trends.push({
        date: date.toISOString().split('T')[0],
        positive: dayComments.filter(c => c.sentiment === 'positive').length,
        neutral: dayComments.filter(c => c.sentiment === 'neutral').length,
        negative: dayComments.filter(c => c.sentiment === 'negative').length
      });
    }

    res.json({
      consultationId,
      ...sentimentCounts,
      trends,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// Get overall platform analytics (Admin only)
router.get('/platform', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalConsultations = await Consultation.countDocuments();
    const totalComments = await Comment.countDocuments();
    const activeConsultations = await Consultation.countDocuments({ status: 'active' });
    const pendingComments = await Comment.countDocuments({ status: 'pending' });

    // Sentiment distribution across all comments
    const allComments = await Comment.find({ status: 'approved' });
    const sentimentDistribution = {
      positive: allComments.filter(c => c.sentiment === 'positive').length,
      neutral: allComments.filter(c => c.sentiment === 'neutral').length,
      negative: allComments.filter(c => c.sentiment === 'negative').length
    };

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const userGrowth = totalUsers > 0 ? ((newUsers / totalUsers) * 100) : 0;

    // Engagement rate calculation
    const usersWithComments = await Comment.distinct('userId');
    const engagementRate = totalUsers > 0 ? ((usersWithComments.length / totalUsers) * 100) : 0;

    res.json({
      totalUsers,
      totalConsultations,
      totalComments,
      activeConsultations,
      pendingComments,
      userGrowth: parseFloat(userGrowth.toFixed(1)),
      engagementRate: parseFloat(engagementRate.toFixed(1)),
      sentimentDistribution,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Platform analytics error:', error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

// Get word frequency analysis
router.get('/wordcloud/:consultationId?', authenticateToken, async (req, res) => {
  try {
    const { consultationId } = req.params;
    const query = consultationId ? { consultationId, status: 'approved' } : { status: 'approved' };
    
    const comments = await Comment.find(query);
    const allText = comments.map(c => c.content).join(' ').toLowerCase();
    
    // Simple word frequency analysis (in production, use more sophisticated NLP)
    const words = allText
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'had', 'have', 'this', 'that', 'will', 'with'].includes(word));

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    const sortedWords = Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 50)
      .map(([text, value]) => ({ text, value }));

    res.json({
      consultationId: consultationId || 'all',
      words: sortedWords,
      totalWords: words.length,
      uniqueWords: Object.keys(frequency).length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Word cloud analysis error:', error);
    res.status(500).json({ error: 'Failed to generate word cloud' });
  }
});

module.exports = router;
