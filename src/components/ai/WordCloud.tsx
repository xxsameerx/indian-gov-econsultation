import React from 'react';
import { Card } from 'react-bootstrap';

interface WordData {
  text: string;
  value: number;
}

interface WordCloudProps {
  data?: WordData[];
}

const WordCloudComponent: React.FC<WordCloudProps> = ({ data }) => {
  const defaultWords = [
    { text: 'governance', value: 45 },
    { text: 'transparency', value: 38 },
    { text: 'digital', value: 35 },
    { text: 'policy', value: 32 },
    { text: 'compliance', value: 30 },
    { text: 'corporate', value: 28 },
    { text: 'regulatory', value: 25 },
    { text: 'framework', value: 22 },
    { text: 'implementation', value: 20 },
    { text: 'stakeholder', value: 18 },
    { text: 'standards', value: 16 },
    { text: 'audit', value: 14 },
    { text: 'business', value: 12 },
    { text: 'reporting', value: 10 }
  ];

  const words = data || defaultWords;

  return (
    <Card>
      <Card.Header>
        <h5>Key Topics Word Cloud</h5>
        <small className="text-muted">Most discussed terms in consultations</small>
      </Card.Header>
      <Card.Body>
        <div 
          className="d-flex flex-wrap justify-content-center align-items-center" 
          style={{ minHeight: '200px', padding: '20px' }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              style={{
                fontSize: `${Math.max(word.value * 0.4, 12)}px`,
                margin: '5px',
                color: `hsl(${200 + index * 15}, 70%, 50%)`,
                fontWeight: word.value > 30 ? 'bold' : 'normal',
                opacity: 0.7 + (word.value / 100),
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = `${0.7 + (word.value / 100)}`;
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {word.text}
            </span>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default WordCloudComponent;
