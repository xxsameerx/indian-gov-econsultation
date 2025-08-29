 import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MessageSquare, Users, TrendingUp, Shield, BarChart3, Download, UserCheck } from 'lucide-react';
import consultationsData from '../data/consultations.json';
import { Consultation } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [consultations] = useState<Consultation[]>(consultationsData as Consultation[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || consultation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(consultations.map(c => c.category)));

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'closed': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-5" style={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' 
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <div className="mb-3">
                <Badge bg="light" text="primary" className="px-3 py-2 fs-6 mb-3">
                   Government of India Initiative
                </Badge>
              </div>
              <h1 className="display-3 fw-bold mb-4">
                GCAP
                <div className="fs-4 fw-normal mt-2 opacity-90">
                  Government Consultation Analytics Platform
                </div>
              </h1>
              <p className="lead mb-2 fs-5" style={{ fontStyle: 'italic', color: '#fbbf24' }}>
                "Your Voice, Government's Choice"
              </p>
              <p className="lead mb-4 opacity-90">
                Advanced analytics-driven consultation platform enabling data-driven policy decisions 
                through secure citizen participation and real-time insights.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  variant="outline-success" 
                  size="lg" 
                  className="px-4"
                  onClick={() => navigate('/consultations')}
                >
                  <MessageSquare size={20} className="me-2" />
                  Start Consulting
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg" 
                  className="px-4"
                  onClick={() => navigate('/register')}
                >
                  <UserCheck size={20} className="me-2" />
                  Get OTP Verification
                </Button>
              </div>
            </Col>
            <Col lg={4} className="text-center">
              <div className=" bg-opacity-15 rounded-4 p-4 backdrop-blur">
                <h3 className="h4 mb-3">📊 Live Analytics</h3>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="h2 fw-bold text-warning">{consultations.filter(c => c.status === 'active').length}</div>
                    <small className="d-block">Active Consultations</small>
                  </div>
                  <div className="col-6">
                    <div className="h2 fw-bold text-success">{consultations.length}</div>
                    <small className="d-block">Total Policies</small>
                  </div>
                  <div className="col-6">
                    <div className="h2 fw-bold text-info">87%</div>
                    <small className="d-block">Positive Sentiment</small>
                  </div>
                  <div className="col-6">
                    <div className="h2 fw-bold text-light">24/7</div>
                    <small className="d-block">Real-time Updates</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Key Features Banner */}
      <section className="bg-light py-3">
        <Container>
          <Row className="text-center g-3">
            <Col md={3}>
              <div className="d-flex align-items-center justify-content-center">
                <Shield size={20} className="text-primary me-2" />
                <span className="fw-semibold">OTP-Secured Participation</span>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-center justify-content-center">
                <BarChart3 size={20} className="text-success me-2" />
                <span className="fw-semibold">Real-time Analytics</span>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-center justify-content-center">
                <Users size={20} className="text-info me-2" />
                <span className="fw-semibold">Role-based Access</span>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-center justify-content-center">
                <Download size={20} className="text-warning me-2" />
                <span className="fw-semibold">Cabinet-ready Reports</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search and Filter Section */}
      <section className="py-4 bg-white">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto">
              <div className="d-flex gap-3 mb-4">
                <div className="flex-grow-1 position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search active consultations & policy drafts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    className="border-2"
                  />
                  <Search 
                    size={18} 
                    className="position-absolute text-muted" 
                    style={{ left: '0.75rem', top: '0.75rem' }}
                  />
                </div>
                <Form.Select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: 'auto' }}
                  className="border-2"
                >
                  <option value="">All Ministries</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Active Consultations */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary">🔴 Live Government Consultations</h2>
            <p className="text-muted">Real-time policy consultations with advanced sentiment analysis and topic modeling</p>
          </div>
          
          <Row className="g-4">
            {filteredConsultations.slice(0, 6).map(consultation => (
              <Col key={consultation.id} lg={4} md={6}>
                <Card className="consultation-card h-100 shadow-sm border-0">
                  <Card.Header className="bg-gradient border-0" style={{
                    background: consultation.status === 'active' 
                      ? 'linear-gradient(45deg, #10b981, #059669)'
                      : 'linear-gradient(45deg, #6b7280, #4b5563)'
                  }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge 
                        bg={consultation.status === 'active' ? 'light' : 'secondary'} 
                        text={consultation.status === 'active' ? 'dark' : 'light'}
                        className="consultation-status"
                      >
                        {consultation.status === 'active' ? '🔴 LIVE' : consultation.status.toUpperCase()}
                      </Badge>
                      <small className="text-white">
                        <Calendar size={14} className="me-1" />
                        {new Date(consultation.deadline).toLocaleDateString('en-IN')}
                      </small>
                    </div>
                    <h5 className="card-title text-white mb-0">{consultation.title}</h5>
                  </Card.Header>
                  
                  <Card.Body>
                    <p className="text-muted mb-3" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {consultation.description}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                      <span>
                        <MessageSquare size={14} className="me-1" />
                        {consultation.commentsCount} responses
                      </span>
                      <span className="fw-semibold">{consultation.ministry}</span>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {consultation.tags?.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} bg="light" text="dark" className="small">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Analytics Preview */}
                    <div className="bg-light rounded p-2 mb-3">
                      <div className="d-flex justify-content-between text-small">
                        <span className="text-success">👍 85% Positive</span>
                        <span className="text-info">📊 Analytics Ready</span>
                      </div>
                    </div>
                  </Card.Body>
                  
                  <Card.Footer className="bg-transparent border-0">
                    <Button 
                      variant={consultation.status === 'active' ? 'success' : 'primary'}
                      className="w-100 fw-semibold"
                      onClick={() => navigate(`/consultation/${consultation.id}`)}
                    >
                      {consultation.status === 'active' ? 'Participate Now' : 'View Analytics'}
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          
          <div className="text-center mt-5">
            <Button 
              variant="outline-primary" 
              size="lg" 
              className="px-5"
              onClick={() => navigate('/consultations')}
            >
              View All Government Consultations
            </Button>
          </div>
        </Container>
      </section>

      {/* GCAP Features Section */}
      <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary">Why GCAP for Government Consultations?</h2>
            <p className="text-muted">Advanced analytics and security features designed for government decision-making</p>
          </div>
          
          <Row className="g-4">
            <Col md={6} lg={3} className="text-center">
              <div className="bg-primary rounded-4 d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '80px', height: '80px' }}>
                <Shield color="white" size={36} />
              </div>
              <h4 className="h5 fw-bold">🔐 OTP-Secured Participation</h4>
              <p className="text-muted small">
                Verified citizen identities through OTP authentication ensuring legitimate participation and preventing spam.
              </p>
            </Col>
            
            <Col md={6} lg={3} className="text-center">
              <div className="bg-success rounded-4 d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '80px', height: '80px' }}>
                <BarChart3 color="white" size={36} />
              </div>
              <h4 className="h5 fw-bold">📊 Real-time Dashboards</h4>
              <p className="text-muted small">
                Live sentiment analysis, topic modeling, and participation metrics with AI-powered insights for policy makers.
              </p>
            </Col>
            
            <Col md={6} lg={3} className="text-center">
              <div className="bg-info rounded-4 d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '80px', height: '80px' }}>
                <Users color="white" size={36} />
              </div>
              <h4 className="h5 fw-bold">👥 Role-based Access</h4>
              <p className="text-muted small">
                Structured access controls for ministries, agencies, and departments with customizable permission levels.
              </p>
            </Col>
            
            <Col md={6} lg={3} className="text-center">
              <div className="bg-warning rounded-4 d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '80px', height: '80px' }}>
                <Download color="white" size={36} />
              </div>
              <h4 className="h5 fw-bold">📋 Exportable Insights</h4>
              <p className="text-muted small">
                Generate cabinet-ready reports, PRS summaries, and detailed analytics for parliamentary submissions.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Government Benefits Section */}
      <section className="py-5 bg-primary text-white">
   <Container>
  <Row className="align-items-start">
    <Col lg={8}>
      {/* Enhanced Section Header */}
      <div className="mb-5">
        <h2 className="display-6 fw-bold text-white mb-3">Transform Government Decision-Making</h2>
        <div className="tricolor-accent-line mb-4"></div>
        <p className="lead text-white opacity-90 mb-0">
          Empowering democratic governance through advanced analytics and citizen-centric policy development
        </p>
      </div>

      {/* Feature Cards Grid */}
      <Row className="g-4">
        <Col md={6}>
          <div className="benefit-card">
            <div className="benefit-icon bg-gradient-orange">
              <TrendingUp size={28} color="white" />
            </div>
            <div className="benefit-content">
              <h5 className="benefit-title">Data-Driven Policies</h5>
              <p className="benefit-desc">Evidence-based policy making through comprehensive citizen feedback analysis and ML-powered insights</p>
            </div>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="benefit-card">
            <div className="benefit-icon bg-gradient-white">
              <MessageSquare size={28} color="#2563eb" />
            </div>
            <div className="benefit-content">
              <h5 className="benefit-title">Enhanced Transparency</h5>
              <p className="benefit-desc">Open government initiatives with full audit trails and public participation records for accountability</p>
            </div>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="benefit-card">
            <div className="benefit-icon bg-gradient-green">
              <BarChart3 size={28} color="white" />
            </div>
            <div className="benefit-content">
              <h5 className="benefit-title">Advanced Analytics</h5>
              <p className="benefit-desc">ML-powered sentiment analysis, topic clustering, and predictive policy impact modeling for better outcomes</p>
            </div>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="benefit-card">
            <div className="benefit-icon bg-gradient-blue">
              <Users size={28} color="white" />
            </div>
            <div className="benefit-content">
              <h5 className="benefit-title">Citizen Engagement</h5>
              <p className="benefit-desc">Structured feedback collection with demographic analysis and regional insights for inclusive governance</p>
            </div>
          </div>
        </Col>
      </Row>
    </Col>

    {/* Enhanced Statistics Panel */}
    <Col lg={4} className="text-center">
      <div className="stats-panel">
        <div className="stats-header mb-4">
          <div className="stats-icon mb-2">🏛️</div>
          <h4 className="stats-title">Government Impact</h4>
          <p className="stats-subtitle">Real-time platform metrics</p>
        </div>
        
        <Row className="g-3">
          <Col xs={6}>
            <div className="stat-item">
              <div className="stat-number text-warning">15+</div>
              <div className="stat-label">Ministries Connected</div>
              <div className="stat-growth">+3 this quarter</div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="stat-item">
              <div className="stat-number text-success">50K+</div>
              <div className="stat-label">Citizen Responses</div>
              <div className="stat-growth">+12% this month</div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="stat-item">
              <div className="stat-number text-info">200+</div>
              <div className="stat-label">Policies Analyzed</div>
              <div className="stat-growth">+25 active</div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="stat-item">
              <div className="stat-number text-primary">95%</div>
              <div className="stat-label">Decision Accuracy</div>
              <div className="stat-growth">Industry leading</div>
            </div>
          </Col>
        </Row>
        
        {/* Call-to-Action */}
        <div className="mt-4">
          <Button variant="outline-light" size="sm" className="tricolor-btn"  onClick={() => navigate('/analytics/government-impact')}>
            View Detailed Analytics
          </Button>
        </div>
      </div>
    </Col>
  </Row>
</Container>

      </section>
    </div>
  );
};

export default Home;
