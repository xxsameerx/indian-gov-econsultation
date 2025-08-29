import React from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Card, Row, Col } from 'react-bootstrap';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const SentimentChart: React.FC = () => {
  // Default sentiment data
  const sentimentData = {
    totalComments: 1000,
    positive: 600,
    neutral: 250,
    negative: 150,
    trends: [
      { date: "2025-01-01", positive: 50, neutral: 20, negative: 10 },
      { date: "2025-02-01", positive: 52, neutral: 22, negative: 12 },
      { date: "2025-03-01", positive: 48, neutral: 26, negative: 14 },
      { date: "2025-04-01", positive: 55, neutral: 18, negative: 7 },
      { date: "2025-05-01", positive: 60, neutral: 30, negative: 10 },
      { date: "2025-06-01", positive: 65, neutral: 20, negative: 15 },
      { date: "2025-07-01", positive: 70, neutral: 15, negative: 5 }
    ]
  };

  const doughnutData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
        backgroundColor: ['#059669', '#6b7280', '#ef4444'],
        borderColor: ['#047857', '#4b5563', '#dc2626'],
        borderWidth: 2,
        hoverBackgroundColor: ['#10b981', '#9ca3af', '#f87171'],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Overall Sentiment Distribution',
        font: { size: 16, weight: 'bold' as const },
        padding: { bottom: 20 },
      },
    },
  };

  const trendData = {
    labels: sentimentData.trends.map(t => new Date(t.date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })),
    datasets: [
      {
        label: 'Positive',
        data: sentimentData.trends.map(t => t.positive),
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Neutral',
        data: sentimentData.trends.map(t => t.neutral),
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Negative',
        data: sentimentData.trends.map(t => t.negative),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Comments',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time Period',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sentiment Trends Over Time',
        font: { size: 16, weight: 'bold' as const },
      },
    },
  };

  const barData = {
    labels: ['Corporate Law', 'Digital Governance', 'Financial Reporting', 'CSR Rules', 'Tax Policy'],
    datasets: [
      {
        label: 'Positive',
        data: [245, 189, 123, 156, 98],
        backgroundColor: '#059669',
      },
      {
        label: 'Neutral',
        data: [98, 76, 54, 67, 43],
        backgroundColor: '#6b7280',
      },
      {
        label: 'Negative',
        data: [45, 34, 23, 28, 19],
        backgroundColor: '#ef4444',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sentiment by Consultation Category',
        font: { size: 16, weight: 'bold' as const },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <Row className="g-4">
      <Col md={4}>
        <Card>
          <Card.Body>
            <div style={{ height: '300px' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={8}>
        <Card>
          <Card.Body>
            <div style={{ height: '300px' }}>
              <Line data={trendData} options={trendOptions} />
            </div>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={12}>
        <Card>
          <Card.Body>
            <div style={{ height: '400px' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SentimentChart;
