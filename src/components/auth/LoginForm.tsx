import React, { useState } from 'react';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Invalid credentials. Use admin@gov.in/password123 for admin or any user email with "password"');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <Lock color="white" size={24} />
                </div>
                <h4 className="fw-bold text-primary">Sign In</h4>
                <p className="text-muted">Access your consultation dashboard</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                    <Mail 
                      size={18} 
                      className="position-absolute text-muted" 
                      style={{ left: '0.75rem', top: '0.75rem' }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    />
                    <Lock 
                      size={18} 
                      className="position-absolute text-muted" 
                      style={{ left: '0.75rem', top: '0.75rem' }}
                    />
                    <Button
                      variant="link"
                      className="position-absolute border-0 p-0"
                      style={{ right: '0.75rem', top: '0.5rem' }}
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check 
                    type="checkbox"
                    id="remember-me"
                    label="Remember me"
                  />
                  <Link to="/forgot-password" className="text-primary text-decoration-none small">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100 py-2 fw-bold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0 small text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary fw-bold text-decoration-none">
                    Create Account
                  </Link>
                </p>
              </div>

              <div className="mt-4 pt-3 border-top">
                <small className="text-muted">
                  <strong>Demo Credentials:</strong><br />
                  Admin: admin@gov.in / password123<br />
                  User: Any registered email / password
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
