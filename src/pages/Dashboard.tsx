import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tab, Tabs, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Bookmark, TrendingUp, Calendar, Download, Eye } from 'lucide-react';
import consultationsData from '../data/consultations.json';
import commentsData from '../data/comments.json';
import { Consultation, Comment } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userConsultations] = useState<Consultation[]>(consultationsData as Consultation[]);
  const [userComments] = useState<Comment[]>(commentsData as Comment[]);

  const stats = {
    totalComments: userComments.length,
    activeConsultations: userConsultations.filter(c => c.status === 'active').length,
    bookmarkedConsultations: 5,
    participationScore: 85
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="dashboard-stats">
            <Row className="align-items-center mb-4">
              <Col>
                <h1 className="h3 mb-1">Welcome back, {user?.name}!</h1>
                <p className="mb-0 opacity-75">Track your consultation participation and engagement</p>
              </Col>
              <Col xs="auto">
                <div className="text-end">
                  <div className="h4 mb-1">{stats.participationScore}%</div>
                  <small>Participation Score</small>
                </div>
              </Col>
            </Row>

            <Row className="g-3">
              <Col md={3}>
                <div className="stat-card">
                  <MessageSquare size={24} className="mb-2" />
                  <div className="h4 mb-1">{stats.totalComments}</div>
                  <small>Total Comments</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card">
                  <Calendar size={24} className="mb-2" />
                  <div className="h4 mb-1">{stats.activeConsultations}</div>
                  <small>Active Consultations</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card">
                  <Bookmark size={24} className="mb-2" />
                  <div className="h4 mb-1">{stats.bookmarkedConsultations}</div>
                  <small>Bookmarked</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card">
                  <TrendingUp size={24} className="mb-2" />
                  <div className="h4 mb-1">Top 10%</div>
                  <small>Engagement Rank</small>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'overview')} className="mb-4">
                <Tab eventKey="overview" title="Overview">
                  <Row className="g-4">
                    <Col md={8}>
                      <h5 className="mb-3">Recent Activity</h5>
                      <div className="space-y-3">
                        {userComments.slice(0, 3).map(comment => (
                          <Card key={comment.id} className="border-start border-primary border-3">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <Badge bg="primary" className="small">Comment</Badge>
                                <small className="text-muted">
                                  {new Date(comment.createdAt).toLocaleDateString('en-IN')}
                                </small>
                              </div>
                              <p className="mb-2 text-truncate">{comment.content}</p>
                              <small className="text-muted">
                                <Eye size={14} className="me-1" />
                                Consultation ID: {comment.consultationId}
                              </small>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    </Col>

                    <Col md={4}>
                      <h5 className="mb-3">Quick Actions</h5>
                      <div className="d-grid gap-2">
                        <Button variant="primary" size="sm">
                          <MessageSquare size={16} className="me-2" />
                          Browse Consultations
                        </Button>
                        <Button variant="outline-primary" size="sm">
                          <Download size={16} className="me-2" />
                          Export My Data
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          <Calendar size={16} className="me-2" />
                          Set Reminders
                        </Button>
                      </div>

                      <Card className="mt-4">
                        <Card.Body>
                          <h6 className="mb-3">Participation Progress</h6>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between small mb-1">
                              <span>Monthly Goal</span>
                              <span>8/10 comments</span>
                            </div>
                            <ProgressBar now={80} variant="success" />
                          </div>
                          <div className="mb-0">
                            <div className="d-flex justify-content-between small mb-1">
                              <span>Active Engagement</span>
                              <span>85%</span>
                            </div>
                            <ProgressBar now={85} variant="info" />
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="comments" title="My Comments">
                  <div className="space-y-3">
                    {userComments.map(comment => (
                      <Card key={comment.id}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <Badge 
                                bg={comment.sentiment === 'positive' ? 'success' : 
                                    comment.sentiment === 'negative' ? 'danger' : 'secondary'}
                                className="me-2"
                              >
                                {comment.sentiment}
                              </Badge>
                              <Badge bg={comment.status === 'approved' ? 'success' : 'warning'}>
                                {comment.status}
                              </Badge>
                            </div>
                            <small className="text-muted">
                              {new Date(comment.createdAt).toLocaleDateString('en-IN')}
                            </small>
                          </div>
                          
                          <p className="mb-2">{comment.content}</p>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              Section: {comment.section || 'General'}
                            </small>
                            <div>
                              <span className="text-success me-3">
                                👍 {comment.likes}
                              </span>
                              <span className="text-danger">
                                👎 {comment.dislikes}
                              </span>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Tab>

                <Tab eventKey="bookmarks" title="Bookmarked">
                  <Row className="g-3">
                    {userConsultations.slice(0, 4).map(consultation => (
                      <Col md={6} key={consultation.id}>
                        <Card className="consultation-card">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <Badge bg="success">Active</Badge>
                              <Bookmark size={16} className="text-warning" fill="currentColor" />
                            </div>
                            <h6 className="card-title">{consultation.title}</h6>
                            <p className="text-muted small mb-3" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {consultation.description}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {consultation.commentsCount} comments
                              </small>
                              <Button variant="outline-primary" size="sm">
                                View
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab>

                <Tab eventKey="profile" title="Profile Settings">
                  <Row>
                    <Col md={8}>
                      <h5 className="mb-3">Profile Information</h5>
                      <Card>
                        <Card.Body>
                          <Row className="g-3">
                            <Col md={6}>
                              <label className="form-label">Full Name</label>
                              <input type="text" className="form-control" defaultValue={user?.name} />
                            </Col>
                            <Col md={6}>
                              <label className="form-label">Email Address</label>
                              <input type="email" className="form-control" defaultValue={user?.email} readOnly />
                            </Col>
                            <Col md={6}>
                              <label className="form-label">Location</label>
                              <input type="text" className="form-control" defaultValue={user?.location} />
                            </Col>
                            <Col md={6}>
                              <label className="form-label">Organization</label>
                              <input type="text" className="form-control" defaultValue={user?.organization} />
                            </Col>
                            <Col md={6}>
                              <label className="form-label">Phone</label>
                              <input type="tel" className="form-control" defaultValue={user?.phone} />
                            </Col>
                            <Col md={6}>
                              <label className="form-label">Language Preference</label>
                              <select className="form-select" defaultValue={user?.preferences.language}>
                                <option value="en">English</option>
                                <option value="hi">हिंदी</option>
                              </select>
                            </Col>
                          </Row>
                          
                          <hr className="my-4" />
                          
                          <h6 className="mb-3">Notification Preferences</h6>
                          <div className="form-check mb-2">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              defaultChecked={user?.preferences.notifications} 
                            />
                            <label className="form-check-label">
                              Email notifications for new consultations
                            </label>
                          </div>
                          <div className="form-check mb-3">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              defaultChecked={user?.preferences.emailUpdates} 
                            />
                            <label className="form-check-label">
                              Weekly digest of consultation updates
                            </label>
                          </div>
                          
                          <Button variant="primary">Save Changes</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
