import React, { useState } from 'react';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, User, MapPin, Building, Phone, Eye, EyeOff } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    organization: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.location) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const success = await register(formData, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed. Email may already exist.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <UserPlus color="white" size={24} />
                </div>
                <h4 className="fw-bold text-primary">Create Account</h4>
                <p className="text-muted">Join the consultation platform</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={isLoading}
                          style={{ paddingLeft: '2.5rem' }}
                          required
                        />
                        <User 
                          size={18} 
                          className="position-absolute text-muted" 
                          style={{ left: '0.75rem', top: '0.75rem' }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address *</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                          style={{ paddingLeft: '2.5rem' }}
                          required
                        />
                        <Mail 
                          size={18} 
                          className="position-absolute text-muted" 
                          style={{ left: '0.75rem', top: '0.75rem' }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password *</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          disabled={isLoading}
                          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                          required
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
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Location *</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      name="location"
                      placeholder="City, State (e.g., Mumbai, Maharashtra)"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={isLoading}
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                    <MapPin 
                      size={18} 
                      className="position-absolute text-muted" 
                      style={{ left: '0.75rem', top: '0.75rem' }}
                    />
                  </div>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Organization (Optional)</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          name="organization"
                          placeholder="Company or organization name"
                          value={formData.organization}
                          onChange={handleChange}
                          disabled={isLoading}
                          style={{ paddingLeft: '2.5rem' }}
                        />
                        <Building 
                          size={18} 
                          className="position-absolute text-muted" 
                          style={{ left: '0.75rem', top: '0.75rem' }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone (Optional)</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="+91-9876543210"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={isLoading}
                          style={{ paddingLeft: '2.5rem' }}
                        />
                        <Phone 
                          size={18} 
                          className="position-absolute text-muted" 
                          style={{ left: '0.75rem', top: '0.75rem' }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Check 
                    type="checkbox"
                    id="terms-conditions"
                    label={
                      <span>
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary">Privacy Policy</Link>
                      </span>
                    }
                    required
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="success" 
                  className="w-100 py-2 fw-bold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0 small text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none">
                    Sign In
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
