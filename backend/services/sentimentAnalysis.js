const natural = require('natural');

class SentimentAnalysisService {
  constructor() {
    this.analyzer = new natural.SentimentAnalyzer('English', 
      natural.PorterStemmer, 'afinn');
    this.tokenizer = new natural.WordTokenizer();
    
    // Initialize with pre-trained model or custom rules
    this.initializeModel();
  }

  initializeModel() {
    // In production, load a pre-trained model
    // For demo, we'll use rule-based analysis with AFINN lexicon
    this.positiveWords = [
      'good', 'excellent', 'great', 'amazing', 'wonderful', 'fantastic',
      'support', 'helpful', 'beneficial', 'positive', 'approve', 'agree',
      'effective', 'efficient', 'innovative', 'progressive', 'improvement'
    ];

    this.negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'wrong', 'problem',
      'issue', 'concern', 'oppose', 'disagree', 'ineffective', 'burden',
      'difficult', 'complex', 'confusing', 'inadequate', 'insufficient'
    ];
  }

  analyzeText(text) {
    if (!text || typeof text !== 'string') {
      return { sentiment: 'neutral', score: 0, confidence: 0 };
    }

    // Clean and tokenize text
    const cleanText = text.toLowerCase().replace(/[^\w\s]/gi, ' ');
    const tokens = this.tokenizer.tokenize(cleanText);
    
    if (tokens.length === 0) {
      return { sentiment: 'neutral', score: 0, confidence: 0 };
    }

    // Calculate sentiment score
    let score = 0;
    let positiveCount = 0;
    let negativeCount = 0;

    tokens.forEach(token => {
      if (this.positiveWords.includes(token)) {
        score += 1;
        positiveCount++;
      } else if (this.negativeWords.includes(token)) {
        score -= 1;
        negativeCount++;
      }
    });

    // Normalize score
    const normalizedScore = score / tokens.length;
    
    // Determine sentiment category
    let sentiment = 'neutral';
    if (normalizedScore > 0.1) {
      sentiment = 'positive';
    } else if (normalizedScore < -0.1) {
      sentiment = 'negative';
    }

    // Calculate confidence based on word count and score magnitude
    const totalSentimentWords = positiveCount + negativeCount;
    const confidence = Math.min(
      (totalSentimentWords / tokens.length) * Math.abs(normalizedScore) * 100,
      100
    );

    return {
      sentiment,
      score: parseFloat(normalizedScore.toFixed(3)),
      confidence: parseFloat(confidence.toFixed(1)),
      wordCount: tokens.length,
      positiveWords: positiveCount,
      negativeWords: negativeCount
    };
  }

  // Batch analysis for multiple texts
  analyzeMultiple(texts) {
    return texts.map(text => this.analyzeText(text));
  }

  // Enhanced analysis with context consideration
  analyzeWithContext(text, context = {}) {
    const baseAnalysis = this.analyzeText(text);
    
    // Adjust based on context (consultation category, user history, etc.)
    if (context.category === 'Corporate Law' && baseAnalysis.sentiment === 'negative') {
      // Corporate law discussions often contain critical but constructive feedback
      baseAnalysis.confidence *= 0.8;
    }

    return baseAnalysis;
  }
}

module.exports = new SentimentAnalysisService();
