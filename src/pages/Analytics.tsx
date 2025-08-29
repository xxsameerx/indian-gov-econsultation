import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import SentimentChart from '../components/ai/SentimentChart';
import WordCloudComponent from '../components/ai/WordCloud';
import { TrendingUp, MessageSquare, Users, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
  // Default sentiment data
  const sentimentData = {
    totalComments: 1000,
    positive: 600,
    neutral: 250,
    negative: 150
  };

  const positivePercentage = ((sentimentData.positive / sentimentData.totalComments) * 100).toFixed(1);
  const neutralPercentage = ((sentimentData.neutral / sentimentData.totalComments) * 100).toFixed(1);
  const negativePercentage = ((sentimentData.negative / sentimentData.totalComments) * 100).toFixed(1);

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold text-primary">AI Analytics Dashboard</h1>
          <p className="text-muted">Real-time sentiment analysis and engagement insights</p>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-success">
            <Card.Body className="text-center">
              <TrendingUp size={32} className="text-success mb-2" />
              <h3 className="text-success">{positivePercentage}%</h3>
              <p className="mb-0">Positive Sentiment</p>
              <Badge bg="success">{sentimentData.positive} comments</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-secondary">
            <Card.Body className="text-center">
              <Activity size={32} className="text-secondary mb-2" />
              <h3 className="text-secondary">{neutralPercentage}%</h3>
              <p className="mb-0">Neutral Sentiment</p>
              <Badge bg="secondary">{sentimentData.neutral} comments</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-danger">
            <Card.Body className="text-center">
              <MessageSquare size={32} className="text-danger mb-2" />
              <h3 className="text-danger">{negativePercentage}%</h3>
              <p className="mb-0">Negative Sentiment</p>
              <Badge bg="danger">{sentimentData.negative} comments</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-info">
            <Card.Body className="text-center">
              <Users size={32} className="text-info mb-2" />
              <h3 className="text-info">{sentimentData.totalComments}</h3>
              <p className="mb-0">Total Comments</p>
              <Badge bg="info">100% analyzed</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <SentimentChart />

      {/* Word Cloud */}
      <Row className="g-4 mt-4">
        <Col md={8}>
          <WordCloudComponent />
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>AI Insights Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-success">✅ Key Findings</h6>
                <ul className="small">
                  <li>60% positive sentiment indicates strong public support</li>
                  <li>Corporate Law consultations generate highest engagement</li>
                  <li>Transparency and governance are top concerns</li>
                </ul>
              </div>
              
              <div className="mb-3">
                <h6 className="text-warning">⚠️ Areas of Concern</h6>
                <ul className="small">
                  <li>15% negative sentiment requires attention</li>
                  <li>Implementation timelines cause most criticism</li>
                  <li>SME compliance burden needs addressing</li>
                </ul>
              </div>
              
              <div>
                <h6 className="text-info">📊 Recommendations</h6>
                <ul className="small">
                  <li>Focus on addressing implementation concerns</li>
                  <li>Provide more SME-friendly guidance</li>
                  <li>Increase transparency in decision-making</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Analytics;
