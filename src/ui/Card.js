import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';

const Card = ({ title, children }) => {
  return (
    <BootstrapCard className="mb-4">
      <BootstrapCard.Header as="h5">{title}</BootstrapCard.Header>
      <BootstrapCard.Body>{children}</BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default Card;
