import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-gov">
      <Container>
        <Row>
          <Col md={4}>
            <div className="d-flex align-items-center mb-3">
              <Building2 size={24} className="me-2" />
              <h5>Ministry of Corporate Affairs</h5>
            </div>
            <p className="mb-3">
              Empowering citizens through transparent governance and meaningful participation in policy-making processes.
            </p>
            <div className="d-flex gap-3">
              <Mail size={20} />
              <Phone size={20} />
            </div>
          </Col>
          
          <Col md={2}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/consultations">Consultations</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </Col>
          
          <Col md={2}>
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li><a href="#" target="_blank">Privacy Policy</a></li>
              <li><a href="#" target="_blank">Terms of Use</a></li>
              <li><a href="#" target="_blank">RTI Act</a></li>
              <li><a href="#" target="_blank">Accessibility</a></li>
            </ul>
          </Col>
          
          <Col md={2}>
            <h5>Government</h5>
            <ul className="list-unstyled">
              <li><a href="https://india.gov.in" target="_blank">India Portal <ExternalLink size={12} /></a></li>
              <li><a href="https://mygov.in" target="_blank">MyGov <ExternalLink size={12} /></a></li>
              <li><a href="https://digitalindia.gov.in" target="_blank">Digital India <ExternalLink size={12} /></a></li>
            </ul>
          </Col>
          
          <Col md={2}>
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/grievance">Grievance</Link></li>
            </ul>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row>
          <Col md={6}>
            <p className="mb-0">
              &copy; 2024 Government of India. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">
              Last updated: August 29, 2025 | Version 2.1.0
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
