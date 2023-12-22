import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Hero = ({ children }) => {
  return (
    <div className="bg-light rounded p-4 mb-4 mt-4">
      <Row>
        <Col>{children}</Col>
      </Row>
    </div>
  );
};

export default Hero;
