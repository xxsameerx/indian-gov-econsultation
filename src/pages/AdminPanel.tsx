import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Form, Modal } from 'react-bootstrap';
import { 
  Users, MessageSquare, FileText, TrendingUp, Settings, 
  Plus, Edit, Trash, Eye, Download, Search 
} from 'lucide-react';
import consultationsData from '../data/consultations.json';
import commentsData from '../data/comments.json';
import usersData from '../data/user.json'; 
import SentimentChart from '../components/ai/SentimentChart';
import { Consultation, Comment, User, AdminStats } from '../types';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [consultations] = useState<Consultation[]>(consultationsData as Consultation[]);
  const [comments] = useState<Comment[]>(commentsData as Comment[]);
  const [users] = useState<User[]>(usersData as User[]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Default sentiment data
  const defaultSentimentData = {
    totalComments: 1000,
    positive: 600,
    neutral: 250,
    negative: 150
  };

  const stats: AdminStats = {
    totalUsers: users.length,
    totalConsultations: consultations.length,
    totalComments: comments.length,
    activeConsultations: consultations.filter(c => c.status === 'active').length,
    pendingComments: comments.filter(c => c.status === 'pending').length,
    userGrowth: 12.5,
    engagementRate: 68.3
  };

  const filteredConsultations = consultations.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComments = comments.filter(c =>
    c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.userInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={2}>
          <div className="admin-sidebar">
            <h5 className="px-3 mb-4">Admin Panel</h5>
            <nav className="nav flex-column">
              <Button 
                variant="link" 
                className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <TrendingUp size={18} />
                Overview
              </Button>
              <Button 
                variant="link" 
                className={`admin-nav-item ${activeTab === 'consultations' ? 'active' : ''}`}
                onClick={() => setActiveTab('consultations')}
              >
                <FileText size={18} />
                Consultations
              </Button>
              <Button 
                variant="link" 
                className={`admin-nav-item ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                <MessageSquare size={18} />
                Comments
              </Button>
              <Button 
                variant="link" 
                className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={18} />
                Users
              </Button>
              <Button 
                variant="link" 
                className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <TrendingUp size={18} />
                AI Analytics
              </Button>
              <Button 
                variant="link" 
                className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} />
                Settings
              </Button>
            </nav>
          </div>
        </Col>

        <Col md={10}>
          <div className="admin-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <Row className="mb-4">
                  <Col>
                    <h2>Dashboard Overview</h2>
                    <p className="text-muted">Monitor platform activity and engagement metrics</p>
                  </Col>
                </Row>

                <Row className="g-4 mb-4">
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <Users size={32} className="text-primary mb-2" />
                        <h3>{stats.totalUsers}</h3>
                        <small className="text-muted">Total Users</small>
                        <div className="text-success small mt-1">+ {stats.userGrowth}%</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <FileText size={32} className="text-success mb-2" />
                        <h3>{stats.totalConsultations}</h3>
                        <small className="text-muted">Consultations</small>
                        <div className="text-info small mt-1">{stats.activeConsultations} active</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <MessageSquare size={32} className="text-info mb-2" />
                        <h3>{stats.totalComments}</h3>
                        <small className="text-muted">Total Comments</small>
                        <div className="text-warning small mt-1">{stats.pendingComments} pending</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <TrendingUp size={32} className="text-warning mb-2" />
                        <h3>{stats.engagementRate}%</h3>
                        <small className="text-muted">Engagement Rate</small>
                        <div className="text-success small mt-1">High activity</div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col md={8}>
                    <Card>
                      <Card.Header>
                        <h5>Recent Activity</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="list-group list-group-flush">
                          {comments.slice(0, 5).map(comment => (
                            <div key={comment.id} className="list-group-item border-0">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <strong>{comment.userInfo.name}</strong> commented on consultation
                                  <p className="mb-1 text-muted small">{comment.content.substring(0, 100)}...</p>
                                </div>
                                <Badge bg={comment.status === 'approved' ? 'success' : 'warning'}>
                                  {comment.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card>
                      <Card.Header>
                        <h5>Quick Actions</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-grid gap-2">
                          <Button variant="primary" onClick={() => setShowModal(true)}>
                            <Plus size={16} className="me-2" />
                            Create New Consultation
                          </Button>
                          <Button variant="outline-primary">
                            <Download size={16} className="me-2" />
                            Export Reports
                          </Button>
                          <Button variant="outline-secondary">
                            <Settings size={16} className="me-2" />
                            Platform Settings
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {/* Consultations Tab */}
            {activeTab === 'consultations' && (
              <div>
                <Row className="mb-3">
                  <Col>
                    <div className="d-flex justify-content-between align-items-center">
                      <h3>Manage Consultations</h3>
                      <Button variant="primary" onClick={() => setShowModal(true)}>
                        <Plus size={16} className="me-2" />
                        New Consultation
                      </Button>
                    </div>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <div className="position-relative">
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
                  </Col>
                </Row>

                <Card>
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Comments</th>
                        <th>Deadline</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConsultations.map(consultation => (
                        <tr key={consultation.id}>
                          <td>
                            <strong>{consultation.title}</strong>
                            <br />
                            <small className="text-muted">{consultation.ministry}</small>
                          </td>
                          <td>
                            <Badge bg="light" text="dark">{consultation.category}</Badge>
                          </td>
                          <td>
                            <Badge bg={
                              consultation.status === 'active' ? 'success' :
                              consultation.status === 'draft' ? 'warning' : 'secondary'
                            }>
                              {consultation.status}
                            </Badge>
                          </td>
                          <td>{consultation.commentsCount}</td>
                          <td>
                            <small>{new Date(consultation.deadline).toLocaleDateString('en-IN')}</small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-primary" size="sm">
                                <Eye size={14} />
                              </Button>
                              <Button variant="outline-secondary" size="sm">
                                <Edit size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div>
                <Row className="mb-3">
                  <Col>
                    <h3>Comment Moderation</h3>
                    <p className="text-muted">Review and moderate user comments</p>
                  </Col>
                </Row>

                <Card>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Comment</th>
                        <th>Consultation</th>
                        <th>Sentiment</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComments.map(comment => (
                        <tr key={comment.id}>
                          <td>
                            <div>
                              <strong>{comment.userInfo.name}</strong>
                              <br />
                              <small className="text-muted">{comment.userInfo.organization}</small>
                            </div>
                          </td>
                          <td>
                            <div style={{ maxWidth: '300px' }}>
                              {comment.content.length > 100 
                                ? comment.content.substring(0, 100) + '...'
                                : comment.content
                              }
                            </div>
                          </td>
                          <td>
                            <small>{comment.consultationId}</small>
                          </td>
                          <td>
                            <Badge bg={
                              comment.sentiment === 'positive' ? 'success' :
                              comment.sentiment === 'negative' ? 'danger' : 'secondary'
                            }>
                              {comment.sentiment}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={comment.status === 'approved' ? 'success' : 'warning'}>
                              {comment.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="success" size="sm" title="Approve">
                                ✓
                              </Button>
                              <Button variant="danger" size="sm" title="Reject">
                                ✗
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <Row className="mb-3">
                  <Col>
                    <h3>User Management</h3>
                    <p className="text-muted">Manage platform users and their permissions</p>
                  </Col>
                </Row>

                <Card>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>
                            <strong>{user.name}</strong>
                            <br />
                            <small className="text-muted">{user.organization}</small>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td><small>{user.location}</small></td>
                          <td>
                            <Badge bg={user.isVerified ? 'success' : 'warning'}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </Badge>
                          </td>
                          <td>
                            <small>{new Date(user.createdAt).toLocaleDateString('en-IN')}</small>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button variant="outline-primary" size="sm">
                                <Edit size={14} />
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <Trash size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </div>
            )}

            {/* AI Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <Row className="mb-3">
                  <Col>
                    <h3>🤖 AI-Powered Analytics</h3>
                    <p className="text-muted">Machine learning insights and sentiment analysis dashboard</p>
                  </Col>
                </Row>

                {/* Sentiment Overview Cards */}
                <Row className="g-3 mb-4">
                  <Col md={3}>
                    <Card className="text-center border-success">
                      <Card.Body>
                        <h4 className="text-success">{((defaultSentimentData.positive / defaultSentimentData.totalComments) * 100).toFixed(1)}%</h4>
                        <small>Positive Sentiment</small>
                        <div className="text-success small">+ Trending Up</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center border-secondary">
                      <Card.Body>
                        <h4 className="text-secondary">{((defaultSentimentData.neutral / defaultSentimentData.totalComments) * 100).toFixed(1)}%</h4>
                        <small>Neutral Sentiment</small>
                        <div className="text-info small">- Stable</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center border-danger">
                      <Card.Body>
                        <h4 className="text-danger">{((defaultSentimentData.negative / defaultSentimentData.totalComments) * 100).toFixed(1)}%</h4>
                        <small>Negative Sentiment</small>
                        <div className="text-danger small">- Needs Attention</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center border-primary">
                      <Card.Body>
                        <h4 className="text-primary">87.3%</h4>
                        <small>ML Accuracy</small>
                        <div className="text-success small">High Confidence</div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Charts */}
                <SentimentChart />

                {/* ML Model Information */}
                <Row className="mt-4">
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h5>🧠 ML Model Performance</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Model Accuracy</span>
                          <Badge bg="success">87.3%</Badge>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Processing Speed</span>
                          <Badge bg="info">2.3ms/comment</Badge>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Last Training</span>
                          <Badge bg="secondary">2 days ago</Badge>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Total Processed</span>
                          <Badge bg="primary">15,847 comments</Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h5>⚡ Real-time Processing Status</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <small>Queue Status</small>
                            <Badge bg="success">✓ Healthy</Badge>
                          </div>
                          <div className="d-flex justify-content-between">
                            <small>Processing Rate</small>
                            <span>45 comments/min</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <small>Pending Analysis</small>
                            <span>12 comments</span>
                          </div>
                        </div>
                        <Button variant="primary" size="sm">
                          Retrain Model
                        </Button>
                        <Button variant="outline-secondary" size="sm" className="ms-2">
                          Export Data
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Additional Analytics */}
                <Row className="g-4 mt-3">
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h5>📈 Engagement Metrics</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between">
                            <span>Comments per Consultation</span>
                            <strong>15.3</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Average Response Time</span>
                            <strong>2.4 days</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>User Retention Rate</span>
                            <strong>67.8%</strong>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <Card.Header>
                        <h5>🏆 Popular Categories</h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="mb-2">
                          <div className="d-flex justify-content-between">
                            <span>Corporate Law</span>
                            <Badge bg="primary">42%</Badge>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="d-flex justify-content-between">
                            <span>Digital Governance</span>
                            <Badge bg="success">28%</Badge>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="d-flex justify-content-between">
                            <span>Financial Reporting</span>
                            <Badge bg="info">23%</Badge>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="d-flex justify-content-between">
                            <span>Others</span>
                            <Badge bg="secondary">7%</Badge>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <Row>
                  <Col md={8}>
                    <Card>
                      <Card.Header>
                        <h5>Platform Settings</h5>
                      </Card.Header>
                      <Card.Body>
                        <Form>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Platform Name</Form.Label>
                                <Form.Control defaultValue="E-Consultation Portal" />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Ministry</Form.Label>
                                <Form.Control defaultValue="Ministry of Corporate Affairs" />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Contact Email</Form.Label>
                                <Form.Control defaultValue="admin@mca.gov.in" />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Default Consultation Duration</Form.Label>
                                <Form.Select defaultValue="30">
                                  <option value="15">15 days</option>
                                  <option value="30">30 days</option>
                                  <option value="45">45 days</option>
                                  <option value="60">60 days</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <hr />
                          
                          <h6>Notification Settings</h6>
                          <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                            <label className="form-check-label">
                              Email notifications for new consultations
                            </label>
                          </div>
                          <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                            <label className="form-check-label">
                              Moderate comments before publishing
                            </label>
                          </div>
                          <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label">
                              Allow anonymous comments
                            </label>
                          </div>
                          
                          <Button variant="primary">Save Settings</Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Modal for creating new consultation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Consultation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter consultation title" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Brief description" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select>
                <option>Corporate Law</option>
                <option>Digital Governance</option>
                <option>Financial Reporting</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            Create Consultation
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPanel;
