import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MessageSquare, Users } from 'lucide-react';
import consultationsData from '../data/consultations.json';
import { Consultation } from '../types';

const Consultations: React.FC = () => {
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
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold text-primary">All Government Consultations</h1>
          <p className="text-muted">Participate in shaping India's policies and regulations</p>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <div className="d-flex gap-3">
            <div className="flex-grow-1 position-relative">
              <Form.Control
                type="text"
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
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
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Form.Select>
          </div>
        </Col>
      </Row>

      {/* Results Count */}
      <Row className="mb-3">
        <Col>
          <p className="text-muted">
            Showing {filteredConsultations.length} of {consultations.length} consultations
          </p>
        </Col>
      </Row>

      {/* Consultations Grid */}
      <Row className="g-4">
        {filteredConsultations.map(consultation => (
          <Col key={consultation.id} lg={4} md={6}>
            <Card className="h-100 consultation-card shadow-sm">
              <Card.Header>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Badge bg={getStatusVariant(consultation.status)} className="consultation-status">
                    {consultation.status === 'active' ? '🔴 Live' : consultation.status}
                  </Badge>
                  <small className="text-muted">
                    <Calendar size={14} className="me-1" />
                    {new Date(consultation.deadline).toLocaleDateString('en-IN')}
                  </small>
                </div>
                <h5 className="card-title">{consultation.title}</h5>
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
                    {consultation.commentsCount} comments
                  </span>
                  <span>{consultation.ministry}</span>
                </div>
                
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {consultation.tags?.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} bg="light" text="dark" className="small">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
              
              <Card.Footer className="bg-transparent border-0">
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={() => navigate(`/consultation/${consultation.id}`)}
                >
                  {consultation.status === 'active' ? 'Join Discussion' : 'View Details'}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* No Results */}
      {filteredConsultations.length === 0 && (
        <Row>
          <Col className="text-center py-5">
            <Users size={64} className="text-muted mb-3" />
            <h3>No consultations found</h3>
            <p className="text-muted">Try adjusting your search terms or category filter.</p>
            <Button variant="outline-primary" onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}>
              Clear Filters
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Consultations;
