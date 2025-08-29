import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size, message }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-5">
      <Spinner animation="border" variant="primary" size={size} />
      {message && <p className="mt-3 text-muted">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
