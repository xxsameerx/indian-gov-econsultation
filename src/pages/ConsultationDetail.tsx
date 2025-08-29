import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, MessageSquare, Download, Share2, Bookmark, 
  ThumbsUp, ThumbsDown, Send, Clock, Building2 
} from 'lucide-react';
import consultationsData from '../data/consultations.json';
import commentsData from '../data/comments.json';
import { Consultation, Comment } from '../types';

const ConsultationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    const fetchConsultationAndComments = async () => {
      if (id) {
        try {
          // Find consultation by ID
          const foundConsultation = consultationsData.find(c => c.id === id) as Consultation | undefined;
          
          if (foundConsultation) {
            setConsultation(foundConsultation);
            
            // Find comments for this consultation
            const consultationComments = commentsData.filter(
              c => c.consultationId === id
            ) as Comment[];
            
            setComments(consultationComments);
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error fetching consultation:', error);
          navigate('/');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchConsultationAndComments();
  }, [id, navigate]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      // Create new comment object
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        consultationId: id!,
        userId: user.id,
        userInfo: {
          name: user.name,
          avatar: user.avatar,
          organization: user.organization
        },
        content: newComment.trim(),
        sentiment: 'neutral',
        status: 'pending',
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString(),
        isEdited: false
      };

      // Add to local comments state (simulate real-time)
      setComments(prevComments => [newCommentObj, ...prevComments]);
      
      // Reset form
      setNewComment('');
      setShowCommentForm(false);
      
      // Show success message
      alert('Comment submitted successfully! (In demo mode - not saved to database)');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleDislikeComment = (commentId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, dislikes: comment.dislikes + 1 }
          : comment
      )
    );
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading consultation details...</p>
        </div>
      </Container>
    );
  }

  if (!consultation) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>Consultation not found</h3>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </Container>
    );
  }

  const daysLeft = Math.ceil((new Date(consultation.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Badge bg="success" className="mb-2">
                    🔴 {consultation.status === 'active' ? 'Live Discussion' : consultation.status}
                  </Badge>
                  <h1 className="h4 mb-2">{consultation.title}</h1>
                  <div className="d-flex align-items-center gap-3 text-muted small">
                    <span>
                      <Building2 size={14} className="me-1" />
                      {consultation.ministry}
                    </span>
                    <span>
                      <Calendar size={14} className="me-1" />
                      Deadline: {new Date(consultation.deadline).toLocaleDateString('en-IN')}
                    </span>
                    <span>
                      <Clock size={14} className="me-1" />
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">
                    <Bookmark size={16} />
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <Share2 size={16} />
                  </Button>
                </div>
              </div>
            </Card.Header>

            <Card.Body>
              <p className="text-muted mb-4">{consultation.description}</p>
              <div className="consultation-content">
                <div dangerouslySetInnerHTML={{ __html: consultation.content.replace(/\n/g, '<br/>') }} />
              </div>
              <div className="d-flex flex-wrap gap-2 mt-4">
                {consultation.tags?.map(tag => (
                  <Badge key={tag} bg="light" text="dark">#{tag}</Badge>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Comments Section */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <MessageSquare size={20} className="me-2" />
                💬 Comments ({comments.length})
              </h5>
              {isAuthenticated && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowCommentForm(!showCommentForm)}
                >
                  Add Comment
                </Button>
              )}
            </Card.Header>

            <Card.Body>
              {showCommentForm && (
                <Form onSubmit={handleSubmitComment} className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Share your thoughts on this consultation..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" size="sm">
                      <Send size={16} className="me-1" />
                      Submit Comment
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setShowCommentForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}

              {!isAuthenticated && (
                <Alert variant="info">
                  Please <Button variant="link" onClick={() => navigate('/login')}>login</Button> to participate in this consultation.
                </Alert>
              )}

              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <MessageSquare size={48} className="mb-3 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="comment-item border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <strong>{comment.userInfo.name}</strong>
                          {comment.userInfo.organization && (
                            <small className="text-muted ms-2">({comment.userInfo.organization})</small>
                          )}
                        </div>
                        <div className="text-end">
                          <Badge 
                            bg={comment.sentiment === 'positive' ? 'success' : 
                                comment.sentiment === 'negative' ? 'danger' : 'secondary'}
                            className="small me-2"
                          >
                            {comment.sentiment}
                          </Badge>
                          <small className="text-muted">
                            {new Date(comment.createdAt).toLocaleDateString('en-IN')}
                          </small>
                        </div>
                      </div>

                      <p className="mb-2">{comment.content}</p>
                      {comment.section && (
                        <small className="text-muted">Section: {comment.section}</small>
                      )}

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex gap-3">
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            <ThumbsUp size={14} className="me-1" />
                            {comment.likes}
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDislikeComment(comment.id)}
                          >
                            <ThumbsDown size={14} className="me-1" />
                            {comment.dislikes}
                          </Button>
                        </div>
                        
                        <Badge bg={comment.status === 'approved' ? 'success' : 'warning'}>
                          {comment.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <h6 className="mb-3">📊 Discussion Stats</h6>
              <div className="row text-center">
                <div className="col-6">
                  <div className="h4 text-primary">{comments.length}</div>
                  <small>Comments</small>
                </div>
                <div className="col-6">
                  <div className="h4 text-success">{consultation.bookmarksCount}</div>
                  <small>Bookmarks</small>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h6 className="mb-3">Consultation Status</h6>
              <div className="text-muted small">
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                  Status: {consultation.status}
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="bg-info rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                  Ministry: {consultation.ministry}
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                  Deadline: {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h6 className="mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" size="sm">
                  <Download size={16} className="me-1" />
                  Download PDF
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <Share2 size={16} className="me-1" />
                  Share Consultation
                </Button>
                <Button variant="outline-success" size="sm">
                  <Bookmark size={16} className="me-1" />
                  Bookmark
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ConsultationDetail;
