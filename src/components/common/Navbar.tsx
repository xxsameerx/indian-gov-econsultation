/* src/components/common/Navbar.tsx */
import React, { useEffect } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Users, BarChart3, Settings, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const onScroll = () => {
      document
        .querySelector('.navbar-gov')
        ?.classList.toggle('scrolled', window.scrollY > 10);
    };
    onScroll();               // run once on mount
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar expand="lg" className="navbar-gov shadow">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="navbar-brand-gov">
          {/* India flag emoji without Unicode errors */}
          <span role="img" aria-label="India flag">&#x1F1EE;&#x1F1F3;</span>
          <span className="ms-2">GCAP</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="nav" />
        <BootstrapNavbar.Collapse id="nav">
          <Nav className="me-auto navbar-nav-gov">
            <Nav.Link as={Link} to="/">
              <FileText size={16} className="me-1" />
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/consultations">
              <FileText size={16} className="me-1" />
              All Consultations
            </Nav.Link>
            <Nav.Link as={Link} to="/analytics">
              <BarChart3 size={16} className="me-1" />
              Analytics
            </Nav.Link>
          </Nav>

          <Nav className="navbar-nav-gov">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  <Users size={16} className="me-1" />
                  Dashboard
                </Nav.Link>

                {isAdmin && (
                  <Nav.Link as={Link} to="/admin">
                    <Settings size={16} className="me-1" />
                    Admin
                  </Nav.Link>
                )}

                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="me-1" />
                  Logout {user?.name && `(${user.name})`}
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
